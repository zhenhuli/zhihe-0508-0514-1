export const NOTE_CATEGORIES = {
  top: {
    name: '前调',
    description: '香水喷洒后最先闻到的气味，持续时间短，通常15-30分钟',
    color: '#FFD93D',
    notes: [
      { id: 'bergamot', name: '佛手柑', desc: '清新柑橘香，明亮提神', pairings: ['lavender', 'jasmine', 'vanilla'] },
      { id: 'lemon', name: '柠檬', desc: '酸爽 citrus，干净利落', pairings: ['mint', 'cedar', 'musk'] },
      { id: 'orange', name: '甜橙', desc: '温暖果香，愉悦心情', pairings: ['amber', 'vanilla', 'rose'] },
      { id: 'grapefruit', name: '葡萄柚', desc: '微苦柑橘，活力四射', pairings: ['vetiver', 'musk', 'cedar'] },
      { id: 'mint', name: '薄荷', desc: '清凉草本，沁人心脾', pairings: ['lemon', 'cedar', 'vanilla'] },
      { id: 'berry', name: '浆果', desc: '甜美果香，年轻活泼', pairings: ['rose', 'vanilla', 'peony'] }
    ]
  },
  middle: {
    name: '中调',
    description: '前调消散后出现的核心香气，持续2-4小时',
    color: '#FF6B6B',
    notes: [
      { id: 'rose', name: '玫瑰', desc: '经典花香，优雅浪漫', pairings: ['jasmine', 'sandalwood', 'musk'] },
      { id: 'jasmine', name: '茉莉', desc: '馥郁白花，温柔妩媚', pairings: ['orange', 'vanilla', 'amber'] },
      { id: 'lavender', name: '薰衣草', desc: '宁静草本，放松身心', pairings: ['bergamot', 'cedar', 'vanilla'] },
      { id: 'ylang', name: '依兰', desc: '异域花香，神秘诱人', pairings: ['sandalwood', 'vanilla', 'musk'] },
      { id: 'peony', name: '牡丹', desc: '清新花香，高贵典雅', pairings: ['berry', 'vanilla', 'musk'] },
      { id: 'lily', name: '百合', desc: '纯净花香，清新脱俗', pairings: ['jasmine', 'sandalwood', 'amber'] }
    ]
  },
  base: {
    name: '后调',
    description: '香水的基调，留香最久，可持续4-8小时以上',
    color: '#6C5CE7',
    notes: [
      { id: 'vanilla', name: '香草', desc: '温暖美食调，甜美迷人', pairings: ['bergamot', 'jasmine', 'sandalwood'] },
      { id: 'sandalwood', name: '檀香', desc: '温润木香，沉稳内敛', pairings: ['rose', 'jasmine', 'vanilla'] },
      { id: 'cedar', name: '雪松', desc: '干燥木香，坚定阳刚', pairings: ['bergamot', 'lavender', 'vetiver'] },
      { id: 'musk', name: '麝香', desc: '性感动物香，持久迷人', pairings: ['rose', 'jasmine', 'vanilla'] },
      { id: 'amber', name: '琥珀', desc: '温暖树脂香，华丽高贵', pairings: ['orange', 'vanilla', 'sandalwood'] },
      { id: 'vetiver', name: '香根草', desc: '泥土草本，深邃复杂', pairings: ['grapefruit', 'cedar', 'musk'] }
    ]
  }
};

export const getNoteById = (noteId) => {
  for (const category of Object.values(NOTE_CATEGORIES)) {
    const note = category.notes.find(n => n.id === noteId);
    if (note) return { ...note, category };
  }
  return null;
};

export const getPairings = (noteId) => {
  const note = getNoteById(noteId);
  if (!note) return [];
  return note.pairings.map(id => getNoteById(id)).filter(Boolean);
};

export const getPairingIds = (noteId) => {
  const note = getNoteById(noteId);
  if (!note) return [];
  return note.pairings;
};
