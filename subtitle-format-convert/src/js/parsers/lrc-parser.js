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
