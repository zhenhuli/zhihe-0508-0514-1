(function(global) {
  'use strict';

  const state = {
    files: [],
    currentFile: null,
    parsedData: null,
    previewContent: '',
    cssClasses: {}
  };

  function init() {
    loadCSSClasses();
    setupEventListeners();
    loadTestFiles();
  }

  function loadCSSClasses() {
    fetch('dist/css/class-map.json')
      .then(response => response.json())
      .then(data => {
        state.cssClasses = data.main || {};
      })
      .catch(() => {
        state.cssClasses = {
          container: 'container',
          header: 'header',
          title: 'title',
          subtitle: 'subtitle',
          mainContent: 'mainContent',
          uploadSection: 'uploadSection',
          previewSection: 'previewSection',
          toolsSection: 'toolsSection',
          sectionTitle: 'sectionTitle',
          dropZone: 'dropZone',
          dropZoneActive: 'dropZoneActive',
          dropZoneText: 'dropZoneText',
          fileList: 'fileList',
          fileItem: 'fileItem',
          fileName: 'fileName',
          fileSize: 'fileSize',
          formatSelect: 'formatSelect',
          selectGroup: 'selectGroup',
          label: 'label',
          select: 'select',
          button: 'button',
          buttonPrimary: 'buttonPrimary',
          buttonSuccess: 'buttonSuccess',
          buttonDanger: 'buttonDanger',
          previewTextarea: 'previewTextarea',
          toolsGrid: 'toolsGrid',
          toolCard: 'toolCard',
          toolTitle: 'toolTitle',
          inputGroup: 'inputGroup',
          input: 'input',
          actionButtons: 'actionButtons',
          footer: 'footer'
        };
      });
  }

  function setupEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const offsetBtn = document.getElementById('offsetBtn');
    const scaleBtn = document.getElementById('scaleBtn');
    const targetFormat = document.getElementById('targetFormat');

    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add(state.cssClasses.dropZoneActive || 'dropZoneActive');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove(state.cssClasses.dropZoneActive || 'dropZoneActive');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove(state.cssClasses.dropZoneActive || 'dropZoneActive');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    convertBtn.addEventListener('click', handleConvert);
    downloadBtn.addEventListener('click', handleDownload);
    offsetBtn.addEventListener('click', handleOffset);
    scaleBtn.addEventListener('click', handleScale);
    targetFormat.addEventListener('change', handleConvert);
  }

  function loadTestFiles() {
    const testFiles = [
      { name: 'test.srt', path: 'test/test.srt' },
      { name: 'test.ass', path: 'test/test.ass' },
      { name: 'test.lrc', path: 'test/test.lrc' }
    ];

    testFiles.forEach(testFile => {
      fetch(testFile.path)
        .then(response => response.text())
        .then(content => {
          const file = new File([content], testFile.name, { type: 'text/plain' });
          const fileData = {
            file,
            name: testFile.name,
            size: content.length,
            content,
            format: SubtitleConverter.detectFormat(testFile.name)
          };
          state.files.push(fileData);
          updateFileList();
          
          if (state.files.length === 1) {
            selectFile(0);
          }
        })
        .catch(() => {});
    });
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const fileData = {
          file,
          name: file.name,
          size: file.size,
          content,
          format: SubtitleConverter.detectFormat(file.name)
        };
        state.files.push(fileData);
        updateFileList();
        
        if (state.files.length === 1) {
          selectFile(state.files.length - 1);
        }
      };
      reader.readAsText(file);
    });
  }

  function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    state.files.forEach((file, index) => {
      const div = document.createElement('div');
      div.className = state.cssClasses.fileItem || 'fileItem';
      div.innerHTML = `
        <div>
          <div class="${state.cssClasses.fileName || 'fileName'}">${file.name}</div>
          <div class="${state.cssClasses.fileSize || 'fileSize'}">${formatFileSize(file.size)}</div>
        </div>
        <button class="${state.cssClasses.button || 'button'} ${state.cssClasses.buttonDanger || 'buttonDanger'}" data-index="${index}">删除</button>
      `;
      
      div.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile(parseInt(e.target.dataset.index));
      });

      div.addEventListener('click', () => selectFile(index));
      
      if (state.currentFile === index) {
        div.style.border = '2px solid #3498db';
      }

      fileList.appendChild(div);
    });
  }

  function selectFile(index) {
    state.currentFile = index;
    const fileData = state.files[index];
    
    try {
      state.parsedData = SubtitleConverter.parseInput(fileData.content, fileData.format);
      updatePreview();
      updateFileList();
    } catch (error) {
      alert('解析字幕文件失败: ' + error.message);
    }
  }

  function removeFile(index) {
    state.files.splice(index, 1);
    
    if (state.currentFile === index) {
      state.currentFile = null;
      state.parsedData = null;
      state.previewContent = '';
      updatePreview();
    } else if (state.currentFile > index) {
      state.currentFile--;
    }
    
    updateFileList();
  }

  function updatePreview() {
    const previewTextarea = document.getElementById('previewTextarea');
    
    if (state.parsedData) {
      const targetFormat = document.getElementById('targetFormat').value;
      const converted = SubtitleConverter.convertFormat(state.parsedData, targetFormat);
      state.previewContent = SubtitleConverter.generateOutput(converted, targetFormat);
      previewTextarea.value = state.previewContent;
    } else {
      previewTextarea.value = '';
    }
  }

  function handleConvert() {
    if (!state.parsedData) {
      alert('请先选择字幕文件');
      return;
    }
    updatePreview();
  }

  function handleDownload() {
    if (!state.previewContent) {
      alert('请先转换字幕');
      return;
    }

    const targetFormat = document.getElementById('targetFormat').value;
    const originalName = state.files[state.currentFile].name;
    const baseName = originalName.replace(/\.[^.]+$/, '');
    const fileName = `${baseName}.${targetFormat}`;

    const blob = new Blob([state.previewContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleOffset() {
    if (!state.parsedData) {
      alert('请先选择字幕文件');
      return;
    }

    const offsetInput = document.getElementById('offsetInput');
    const offsetValue = parseFloat(offsetInput.value);
    const offsetMs = offsetValue * 1000;
    
    if (isNaN(offsetMs)) {
      alert('请输入有效的偏移时间');
      return;
    }

    if (offsetValue === 0) {
      alert('偏移时间为 0 时，时间轴不会有变化\n请输入不等于 0 的时间，例如 1 或 -0.5');
      return;
    }

    state.parsedData = SubtitleConverter.offsetTime(state.parsedData, offsetMs);
    state.files[state.currentFile].content = SubtitleConverter.generateOutput(
      state.parsedData,
      state.parsedData.type
    );
    updatePreview();
    
    offsetInput.value = '';
  }

  function handleScale() {
    if (!state.parsedData) {
      alert('请先选择字幕文件');
      return;
    }

    const scaleInput = document.getElementById('scaleInput');
    const scaleFactor = parseFloat(scaleInput.value);
    
    if (isNaN(scaleFactor) || scaleFactor <= 0) {
      alert('请输入有效的缩放比例');
      return;
    }

    if (scaleFactor === 1) {
      alert('缩放比例为 1 时，时间轴不会有变化\n请输入不等于 1 的比例，例如 0.5 或 2');
      return;
    }

    state.parsedData = SubtitleConverter.scaleTime(state.parsedData, scaleFactor);
    
    state.files[state.currentFile].content = SubtitleConverter.generateOutput(
      state.parsedData,
      state.parsedData.type
    );
    updatePreview();
    
    scaleInput.value = '1.0';
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  global.addEventListener('DOMContentLoaded', init);

})(window);

(function(global) {
  'use strict';

  function convertFormat(data, targetFormat) {
    const sourceFormat = data.type;
    
    if (sourceFormat === targetFormat) {
      return data;
    }

    const result = {
      type: targetFormat,
      subtitles: JSON.parse(JSON.stringify(data.subtitles)),
      metadata: data.metadata || {}
    };

    return result;
  }

  function offsetTime(data, offsetMs) {
    const result = {
      type: data.type,
      subtitles: data.subtitles.map(sub => ({
        ...sub,
        startTime: Math.max(0, sub.startTime + offsetMs),
        endTime: Math.max(0, sub.endTime + offsetMs)
      })),
      metadata: data.metadata || {}
    };

    return result;
  }

  function scaleTime(data, scaleFactor) {
    const result = {
      type: data.type,
      subtitles: data.subtitles.map(sub => ({
        ...sub,
        startTime: Math.round(sub.startTime * scaleFactor),
        endTime: Math.round(sub.endTime * scaleFactor)
      })),
      metadata: data.metadata || {}
    };

    return result;
  }

  function convertEncoding(text, fromEncoding, toEncoding) {
    if (fromEncoding === toEncoding) {
      return text;
    }

    if (toEncoding === 'utf8') {
      try {
        return decodeURIComponent(escape(text));
      } catch (e) {
        return text;
      }
    }

    if (toEncoding === 'gbk') {
      try {
        return unescape(encodeURIComponent(text));
      } catch (e) {
        return text;
      }
    }

    return text;
  }

  function generateOutput(data, format) {
    switch (format) {
      case 'srt':
        return SRTParser.generate(data);
      case 'ass':
        return ASSParser.generate(data);
      case 'lrc':
        return LRCParser.generate(data);
      default:
        return SRTParser.generate(data);
    }
  }

  function parseInput(content, format) {
    switch (format) {
      case 'srt':
        return SRTParser.parse(content);
      case 'ass':
        return ASSParser.parse(content);
      case 'lrc':
        return LRCParser.parse(content);
      default:
        return detectAndParse(content);
    }
  }

  function detectAndParse(content) {
    if (/^\d+\s*\n\d{2}:\d{2}:\d{2},\d{3}/m.test(content)) {
      return SRTParser.parse(content);
    }
    
    if (/\[Script Info\]|\[V4\+ Styles\]|\[Events\]/i.test(content)) {
      return ASSParser.parse(content);
    }
    
    if (/\[\d{2}:\d{2}\.\d{2,3}\]/.test(content)) {
      return LRCParser.parse(content);
    }

    throw new Error('Unable to detect subtitle format');
  }

  function detectFormat(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['srt', 'ass', 'ssa', 'lrc'].includes(ext)) {
      return ext === 'ssa' ? 'ass' : ext;
    }
    return null;
  }

  global.SubtitleConverter = {
    convertFormat,
    offsetTime,
    scaleTime,
    convertEncoding,
    generateOutput,
    parseInput,
    detectAndParse,
    detectFormat
  };

})(window);

(function(global) {
  'use strict';

  function parseASS(content) {
    const lines = content.split('\n');
    const subtitles = [];
    const metadata = {
      scriptInfo: {},
      styles: [],
      events: []
    };

    let currentSection = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('[')) {
        currentSection = trimmedLine;
        continue;
      }

      if (!trimmedLine || trimmedLine.startsWith(';')) continue;

      switch (currentSection) {
        case '[Script Info]':
          parseScriptInfo(trimmedLine, metadata);
          break;
        case '[V4+ Styles]':
        case '[V4 Styles]':
          parseStyle(trimmedLine, metadata);
          break;
        case '[Events]':
          parseEvent(trimmedLine, subtitles);
          break;
      }
    }

    return {
      type: 'ass',
      subtitles,
      metadata
    };
  }

  function parseScriptInfo(line, metadata) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      metadata.scriptInfo[key] = value;
    }
  }

  function parseStyle(line, metadata) {
    if (line.startsWith('Format:')) {
      metadata.styleFormat = line.substring(7).split(',').map(s => s.trim());
    } else if (line.startsWith('Style:')) {
      const values = line.substring(6).split(',');
      const style = {};
      if (metadata.styleFormat) {
        metadata.styleFormat.forEach((key, i) => {
          style[key] = values[i] ? values[i].trim() : '';
        });
      }
      metadata.styles.push(style);
    }
  }

  function parseEvent(line, subtitles) {
    if (line.startsWith('Dialogue:')) {
      const parts = line.substring(9).split(',');
      if (parts.length >= 10) {
        const startTime = assTimeToMs(parts[1].trim());
        const endTime = assTimeToMs(parts[2].trim());
        const text = parts.slice(9).join(',').replace(/\\N/g, '\n').replace(/\{[^}]+\}/g, '');

        subtitles.push({
          layer: parseInt(parts[0]) || 0,
          startTime,
          endTime,
          style: parts[3].trim(),
          name: parts[4].trim(),
          marginL: parts[5].trim(),
          marginR: parts[6].trim(),
          marginV: parts[7].trim(),
          effect: parts[8].trim(),
          text: text
        });
      }
    }
  }

  function generateASS(data) {
    const lines = [];
    
    lines.push('[Script Info]');
    lines.push('Title: Converted Subtitle');
    lines.push('ScriptType: v4.00+');
    lines.push('WrapStyle: 0');
    lines.push('ScaledBorderAndShadow: yes');
    lines.push('');

    lines.push('[V4+ Styles]');
    lines.push('Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding');
    lines.push('Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1');
    lines.push('');

    lines.push('[Events]');
    lines.push('Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text');

    data.subtitles.forEach(sub => {
      const text = sub.text.replace(/\n/g, '\\N');
      lines.push(`Dialogue: 0,${msToASSTime(sub.startTime)},${msToASSTime(sub.endTime)},Default,,0,0,0,,${text}`);
    });

    return lines.join('\n');
  }

  function assTimeToMs(timeStr) {
    const match = timeStr.match(/(\d+):(\d{2}):(\d{2})\.(\d{2})/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const centiseconds = parseInt(match[4]);
      return hours * 3600000 + minutes * 60000 + seconds * 1000 + centiseconds * 10;
    }
    return 0;
  }

  function msToASSTime(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    ms %= 1000;
    const centiseconds = Math.floor(ms / 10);

    return `${pad(hours, 1)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(centiseconds, 2)}`;
  }

  function pad(num, length) {
    return String(num).padStart(length, '0');
  }

  global.ASSParser = {
    parse: parseASS,
    generate: generateASS
  };

})(window);

(function(global) {
  'use strict';

  function parseLRC(content) {
    const lines = content.split('\n');
    const subtitles = [];
    const metadata = {
      tags: {}
    };

    const tagRegex = /\[([a-z]+):([^\]]*)\]/i;
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      const tagMatch = trimmedLine.match(tagRegex);
      if (tagMatch && !timeRegex.test(trimmedLine)) {
        metadata.tags[tagMatch[1].toLowerCase()] = tagMatch[2].trim();
        continue;
      }

      const timeMatches = [...trimmedLine.matchAll(timeRegex)];
      if (timeMatches.length > 0) {
        let text = trimmedLine.replace(timeRegex, '').trim();
        
        for (const match of timeMatches) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          const hundredths = parseInt(match[3].padEnd(3, '0'));
          
          const startTime = minutes * 60000 + seconds * 1000 + hundredths;
          
          subtitles.push({
            startTime,
            endTime: startTime + 5000,
            text: text
          });
        }
      }
    }

    subtitles.sort((a, b) => a.startTime - b.startTime);

    subtitles.forEach((sub, i) => {
      if (i < subtitles.length - 1) {
        sub.endTime = subtitles[i + 1].startTime;
      }
    });

    return {
      type: 'lrc',
      subtitles,
      metadata
    };
  }

  function generateLRC(data) {
    const lines = [];

    if (data.metadata && data.metadata.tags) {
      for (const [key, value] of Object.entries(data.metadata.tags)) {
        lines.push(`[${key}:${value}]`);
      }
    }

    if (!data.metadata || !data.metadata.tags || !data.metadata.tags.ti) {
      lines.push('[ti:Unknown Title]');
    }
    if (!data.metadata || !data.metadata.tags || !data.metadata.tags.ar) {
      lines.push('[ar:Unknown Artist]');
    }
    if (!data.metadata || !data.metadata.tags || !data.metadata.tags.al) {
      lines.push('[al:Unknown Album]');
    }

    lines.push('');

    data.subtitles.forEach(sub => {
      const timeStr = msToLRCTime(sub.startTime);
      lines.push(`[${timeStr}]${sub.text}`);
    });

    return lines.join('\n');
  }

  function msToLRCTime(ms) {
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    ms %= 1000;
    const hundredths = Math.floor(ms / 10);

    return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(hundredths, 2)}`;
  }

  function pad(num, length) {
    return String(num).padStart(length, '0');
  }

  global.LRCParser = {
    parse: parseLRC,
    generate: generateLRC
  };

})(window);

(function(global) {
  'use strict';

  function parseSRT(content) {
    const subtitles = [];
    const blocks = content.trim().split(/\n\n+/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 3) continue;

      const index = parseInt(lines[0]);
      const timeLine = lines[1];
      const text = lines.slice(2).join('\n');

      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
      
      if (timeMatch) {
        const startTime = timeToMs(
          parseInt(timeMatch[1]),
          parseInt(timeMatch[2]),
          parseInt(timeMatch[3]),
          parseInt(timeMatch[4])
        );
        
        const endTime = timeToMs(
          parseInt(timeMatch[5]),
          parseInt(timeMatch[6]),
          parseInt(timeMatch[7]),
          parseInt(timeMatch[8])
        );

        subtitles.push({
          index,
          startTime,
          endTime,
          text: text.replace(/\r/g, '')
        });
      }
    }

    return {
      type: 'srt',
      subtitles,
      metadata: {}
    };
  }

  function generateSRT(data) {
    const lines = [];
    
    data.subtitles.forEach((sub, index) => {
      lines.push(index + 1);
      lines.push(`${msToTime(sub.startTime)} --> ${msToTime(sub.endTime)}`);
      lines.push(sub.text);
      lines.push('');
    });

    return lines.join('\n');
  }

  function timeToMs(hours, minutes, seconds, milliseconds) {
    return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  }

  function msToTime(ms) {
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    ms %= 1000;

    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(ms, 3)}`;
  }

  function pad(num, length) {
    return String(num).padStart(length, '0');
  }

  global.SRTParser = {
    parse: parseSRT,
    generate: generateSRT
  };

})(window);
