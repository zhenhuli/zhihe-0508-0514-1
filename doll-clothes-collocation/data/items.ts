export const hairstyles = [
  { id: 'h1', name: '长卷发', color: '#8B4513', image: 'hairstyle1' },
  { id: 'h2', name: '短发', color: '#2F1810', image: 'hairstyle2' },
  { id: 'h3', name: '双马尾', color: '#FFD700', image: 'hairstyle3' },
  { id: 'h4', name: '丸子头', color: '#4A3728', image: 'hairstyle4' },
  { id: 'h5', name: '波浪发', color: '#6B4423', image: 'hairstyle5' },
]

export const clothes = [
  { id: 'c1', name: '连衣裙', color: '#FF69B4', image: 'clothes1' },
  { id: 'c2', name: 'T恤牛仔裤', color: '#4169E1', image: 'clothes2' },
  { id: 'c3', name: '运动套装', color: '#32CD32', image: 'clothes3' },
  { id: 'c4', name: '公主裙', color: '#FFB6C1', image: 'clothes4' },
  { id: 'c5', name: '风衣', color: '#D2691E', image: 'clothes5' },
]

export const accessories = [
  { id: 'a1', name: '蝴蝶结', color: '#FF1493', image: 'accessory1' },
  { id: 'a2', name: '帽子', color: '#800080', image: 'accessory2' },
  { id: 'a3', name: '项链', color: '#FFD700', image: 'accessory3' },
  { id: 'a4', name: '眼镜', color: '#000000', image: 'accessory4' },
  { id: 'a5', name: '包包', color: '#FF6347', image: 'accessory5' },
]

export const backgrounds = [
  { id: 'b1', name: '粉色渐变', color: '#FFB6C1', gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)' },
  { id: 'b2', name: '蓝天', color: '#87CEEB', gradient: 'linear-gradient(180deg, #87CEEB 0%, #4169E1 100%)' },
  { id: 'b3', name: '草地', color: '#90EE90', gradient: 'linear-gradient(180deg, #90EE90 0%, #228B22 100%)' },
  { id: 'b4', name: '星空', color: '#191970', gradient: 'linear-gradient(135deg, #191970 0%, #000033 100%)' },
  { id: 'b5', name: '阳光', color: '#FFE4B5', gradient: 'linear-gradient(135deg, #FFE4B5 0%, #FFA500 100%)' },
]

export interface Outfit {
  id: string
  name: string
  hairstyle: string
  clothes: string
  accessory: string
  background: string
  createdAt: Date
}
