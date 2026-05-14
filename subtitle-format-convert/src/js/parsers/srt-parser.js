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
