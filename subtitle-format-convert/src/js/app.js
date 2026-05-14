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
