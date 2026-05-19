export const skinTypes = [
  {
    id: 'oily',
    name: '油性皮肤',
    icon: 'tint',
    description: '油脂分泌旺盛，易长痘，需要清洁力强、清爽的配方',
    recommendedOils: ['coconut', 'palm', 'castor', 'neem'],
    avoidOils: ['olive', 'avocado', 'shea'],
    superfat: 3,
    waterRatio: 0.38
  },
  {
    id: 'dry',
    name: '干性皮肤',
    icon: 'sun',
    description: '皮肤干燥缺水，需要滋润、保湿的配方',
    recommendedOils: ['olive', 'avocado', 'shea', 'almond'],
    avoidOils: ['coconut', 'palm'],
    superfat: 8,
    waterRatio: 0.33
  },
  {
    id: 'combination',
    name: '混合性皮肤',
    icon: 'adjust',
    description: 'T区油、两颊干，需要平衡的配方',
    recommendedOils: ['olive', 'coconut', 'palm', 'sunflower'],
    avoidOils: [],
    superfat: 5,
    waterRatio: 0.35
  },
  {
    id: 'sensitive',
    name: '敏感性皮肤',
    icon: 'heartbeat',
    description: '皮肤易过敏，需要温和、无刺激的配方',
    recommendedOils: ['olive', 'shea', 'almond', 'rice'],
    avoidOils: ['coconut', 'castor', 'neem'],
    superfat: 7,
    waterRatio: 0.33
  },
  {
    id: 'normal',
    name: '中性皮肤',
    icon: 'smile',
    description: '皮肤状态良好，水油平衡，适合温和配方',
    recommendedOils: ['olive', 'coconut', 'palm', 'almond'],
    avoidOils: [],
    superfat: 5,
    waterRatio: 0.35
  },
  {
    id: 'mature',
    name: '熟龄肌肤',
    icon: 'leaf',
    description: '皮肤松弛有细纹，需要滋养、抗老化配方',
    recommendedOils: ['olive', 'avocado', 'shea', 'rosehip'],
    avoidOils: ['coconut', 'palm'],
    superfat: 8,
    waterRatio: 0.33
  }
];

export const oils = [
  {
    id: 'olive',
    name: '橄榄油',
    saponificationValue: 0.134,
    hardness: 1,
    cleaning: 1,
    foamy: 3,
    moisturizing: 5,
    stability: 3,
    description: '特级初榨橄榄油，富含维生素E，滋润保湿',
    iodineValue: 82,
    recommendedUsage: '20-80%'
  },
  {
    id: 'coconut',
    name: '椰子油',
    saponificationValue: 0.191,
    hardness: 4,
    cleaning: 5,
    foamy: 5,
    moisturizing: 1,
    stability: 4,
    description: '精制椰子油，起泡丰富，清洁力强',
    iodineValue: 10,
    recommendedUsage: '15-30%'
  },
  {
    id: 'palm',
    name: '棕榈油',
    saponificationValue: 0.142,
    hardness: 5,
    cleaning: 2,
    foamy: 1,
    moisturizing: 2,
    stability: 5,
    description: '精制棕榈油，增加皂体硬度，延长保质期',
    iodineValue: 52,
    recommendedUsage: '20-40%'
  },
  {
    id: 'castor',
    name: '蓖麻油',
    saponificationValue: 0.128,
    hardness: 1,
    cleaning: 3,
    foamy: 5,
    moisturizing: 4,
    stability: 2,
    description: '增加泡沫的绵密感和稳定性，有轻微透明度',
    iodineValue: 85,
    recommendedUsage: '5-15%'
  },
  {
    id: 'avocado',
    name: '酪梨油',
    saponificationValue: 0.133,
    hardness: 1,
    cleaning: 2,
    foamy: 2,
    moisturizing: 5,
    stability: 3,
    description: '富含维生素A、D、E，深层滋养，适合干性皮肤',
    iodineValue: 90,
    recommendedUsage: '10-30%'
  },
  {
    id: 'shea',
    name: '乳木果油',
    saponificationValue: 0.128,
    hardness: 3,
    cleaning: 1,
    foamy: 1,
    moisturizing: 5,
    stability: 4,
    description: '非洲天然乳木果，极佳的修复和保湿功效',
    iodineValue: 60,
    recommendedUsage: '10-25%'
  },
  {
    id: 'almond',
    name: '甜杏仁油',
    saponificationValue: 0.136,
    hardness: 1,
    cleaning: 2,
    foamy: 3,
    moisturizing: 4,
    stability: 3,
    description: '温和不刺激，富含维生素，适合敏感肌肤',
    iodineValue: 99,
    recommendedUsage: '10-30%'
  },
  {
    id: 'sunflower',
    name: '向日葵油',
    saponificationValue: 0.136,
    hardness: 1,
    cleaning: 2,
    foamy: 2,
    moisturizing: 3,
    stability: 2,
    description: '清爽不油腻，适合混合性皮肤',
    iodineValue: 126,
    recommendedUsage: '15-40%'
  },
  {
    id: 'rice',
    name: '米糠油',
    saponificationValue: 0.135,
    hardness: 2,
    cleaning: 2,
    foamy: 3,
    moisturizing: 4,
    stability: 3,
    description: '富含谷维素，温和保湿，适合敏感皮肤',
    iodineValue: 105,
    recommendedUsage: '15-40%'
  },
  {
    id: 'neem',
    name: '苦楝油',
    saponificationValue: 0.140,
    hardness: 2,
    cleaning: 4,
    foamy: 2,
    moisturizing: 2,
    stability: 4,
    description: '天然抗菌功效，适合油性和问题皮肤',
    iodineValue: 68,
    recommendedUsage: '5-15%'
  },
  {
    id: 'rosehip',
    name: '玫瑰果油',
    saponificationValue: 0.134,
    hardness: 1,
    cleaning: 1,
    foamy: 2,
    moisturizing: 5,
    stability: 2,
    description: '富含维生素C和抗氧化成分，抗老化修复',
    iodineValue: 165,
    recommendedUsage: '5-15%'
  },
  {
    id: 'jojoba',
    name: '荷荷巴油',
    saponificationValue: 0.069,
    hardness: 1,
    cleaning: 1,
    foamy: 1,
    moisturizing: 5,
    stability: 5,
    description: '分子结构与皮脂相似，极易吸收',
    iodineValue: 82,
    recommendedUsage: '5-20%'
  }
];

export const fragrances = [
  {
    id: 'lavender',
    name: '薰衣草',
    note: '花香调',
    suitableSkin: ['oily', 'combination', 'sensitive', 'normal', 'mature'],
    description: '舒缓放松，促进睡眠，适合各种肤质',
    usageRate: '2-3%',
    blendsWith: ['rosemary', 'lemon', 'chamomile', 'geranium']
  },
  {
    id: 'rosemary',
    name: '迷迭香',
    note: '草本调',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '提神醒脑，收敛控油，适合油性皮肤',
    usageRate: '1-2%',
    blendsWith: ['lavender', 'lemon', 'peppermint', 'eucalyptus']
  },
  {
    id: 'lemon',
    name: '柠檬',
    note: '柑橘调',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '清新提神，美白亮肤，注意光敏性',
    usageRate: '2-3%',
    blendsWith: ['lavender', 'rosemary', 'ginger', 'peppermint']
  },
  {
    id: 'chamomile',
    name: '洋甘菊',
    note: '花香调',
    suitableSkin: ['sensitive', 'dry', 'normal', 'mature'],
    description: '舒缓抗敏，修复红血丝，适合敏感皮肤',
    usageRate: '2-3%',
    blendsWith: ['lavender', 'geranium', 'rose', 'sandalwood']
  },
  {
    id: 'peppermint',
    name: '薄荷',
    note: '草本调',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '清凉提神，消炎止痒，夏季使用最佳',
    usageRate: '1-2%',
    blendsWith: ['rosemary', 'lemon', 'eucalyptus', 'lavender']
  },
  {
    id: 'geranium',
    name: '天竺葵',
    note: '花香调',
    suitableSkin: ['combination', 'normal', 'mature', 'dry'],
    description: '平衡油脂，促进循环，适合各种肤质',
    usageRate: '2-3%',
    blendsWith: ['lavender', 'chamomile', 'rose', 'sandalwood']
  },
  {
    id: 'rose',
    name: '玫瑰',
    note: '花香调',
    suitableSkin: ['dry', 'mature', 'normal', 'sensitive'],
    description: '滋养抗老，舒缓情绪，适合熟龄和干性皮肤',
    usageRate: '2-3%',
    blendsWith: ['chamomile', 'geranium', 'sandalwood', 'vanilla']
  },
  {
    id: 'sandalwood',
    name: '檀香',
    note: '木质调',
    suitableSkin: ['dry', 'mature', 'sensitive', 'normal'],
    description: '保湿滋润，冥想安神，适合干性和熟龄皮肤',
    usageRate: '2-3%',
    blendsWith: ['rose', 'chamomile', 'vanilla', 'geranium']
  },
  {
    id: 'eucalyptus',
    name: '尤加利',
    note: '草本调',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '抗菌消炎，通鼻提神，适合油性皮肤',
    usageRate: '1-2%',
    blendsWith: ['rosemary', 'peppermint', 'lemon', 'tea_tree']
  },
  {
    id: 'tea_tree',
    name: '茶树',
    note: '草本调',
    suitableSkin: ['oily', 'combination', 'sensitive'],
    description: '强抗菌功效，针对痘痘和油性皮肤',
    usageRate: '1-2%',
    blendsWith: ['eucalyptus', 'rosemary', 'lavender', 'lemon']
  },
  {
    id: 'vanilla',
    name: '香草',
    note: '美食调',
    suitableSkin: ['dry', 'normal', 'mature', 'sensitive'],
    description: '温暖放松，舒缓压力，令人愉悦',
    usageRate: '2-3%',
    blendsWith: ['sandalwood', 'rose', 'orange', 'cinnamon']
  },
  {
    id: 'orange',
    name: '甜橙',
    note: '柑橘调',
    suitableSkin: ['dry', 'normal', 'combination', 'mature'],
    description: '开心阳光，保湿补水，注意光敏性',
    usageRate: '2-3%',
    blendsWith: ['vanilla', 'ginger', 'cinnamon', 'lavender']
  }
];

export const additives = [
  {
    id: 'oatmeal',
    name: '燕麦粉',
    suitableSkin: ['sensitive', 'dry', 'normal'],
    description: '温和舒缓，去除死皮，适合敏感皮肤',
    usageRate: '1-3%'
  },
  {
    id: 'honey',
    name: '蜂蜜',
    suitableSkin: ['dry', 'normal', 'mature', 'sensitive'],
    description: '天然保湿剂，抗菌滋养',
    usageRate: '2-5%'
  },
  {
    id: 'activated_charcoal',
    name: '活性炭',
    suitableSkin: ['oily', 'combination'],
    description: '深层清洁毛孔，吸附油脂',
    usageRate: '1-2%'
  },
  {
    id: 'clay_kaolin',
    name: '高岭土',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '吸收多余油脂，清洁毛孔',
    usageRate: '2-5%'
  },
  {
    id: 'clay_bentonite',
    name: '膨润土',
    suitableSkin: ['oily', 'combination'],
    description: '强力吸附油脂，适合油性皮肤',
    usageRate: '1-3%'
  },
  {
    id: 'aloe_vera',
    name: '芦荟',
    suitableSkin: ['sensitive', 'dry', 'normal', 'mature'],
    description: '舒缓修复，补水保湿',
    usageRate: '5-10%'
  },
  {
    id: 'milk',
    name: '牛奶',
    suitableSkin: ['dry', 'normal', 'mature', 'sensitive'],
    description: '天然乳酸，温和去角质，滋润皮肤',
    usageRate: '5-10%'
  },
  {
    id: 'coffee',
    name: '咖啡粉',
    suitableSkin: ['oily', 'combination', 'normal'],
    description: '去角质，促进循环，紧致皮肤',
    usageRate: '1-3%'
  }
];

export const curingTimes = {
  coldProcess: {
    minDays: 4,
    typicalDays: 6,
    maxDays: 8,
    cureWeeks: 4,
    description: '冷制法：入模后24-48小时脱模，4-6周完全熟成'
  },
  hotProcess: {
    minDays: 0,
    typicalDays: 1,
    maxDays: 2,
    cureWeeks: 2,
    description: '热制法：制作完成后即可使用，2-4周完全熟成'
  },
  meltAndPour: {
    minDays: 0,
    typicalDays: 0,
    maxDays: 1,
    cureWeeks: 0,
    description: '融化再制法：冷却后即可使用'
  }
};

export const calculateLyeAmount = (oilWeights, selectedOils, superfat = 5) => {
  let totalLye = 0;
  selectedOils.forEach(oil => {
    const oilData = oils.find(o => o.id === oil.id);
    if (oilData && oilWeights[oil.id]) {
      totalLye += oilWeights[oil.id] * oilData.saponificationValue;
    }
  });
  const lyeWithSuperfat = totalLye * (1 - superfat / 100);
  return Math.round(lyeWithSuperfat * 100) / 100;
};

export const calculateWaterAmount = (oilWeights, waterRatio = 0.35) => {
  const totalOil = Object.values(oilWeights).reduce((sum, w) => sum + w, 0);
  return Math.round(totalOil * waterRatio * 100) / 100;
};

export const getRecommendedFragrances = (skinTypeId) => {
  return fragrances.filter(f => f.suitableSkin.includes(skinTypeId));
};

export const getRecommendedAdditives = (skinTypeId) => {
  return additives.filter(a => a.suitableSkin.includes(skinTypeId));
};
