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
