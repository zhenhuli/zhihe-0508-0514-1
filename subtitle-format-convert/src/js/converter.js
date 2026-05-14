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
