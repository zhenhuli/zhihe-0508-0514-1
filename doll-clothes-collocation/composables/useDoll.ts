import type { Outfit } from '~/data/items'

export const useDoll = () => {
  const currentHairstyle = useState('currentHairstyle', () => 'h1')
  const currentClothes = useState('currentClothes', () => 'c1')
  const currentAccessory = useState('currentAccessory', () => 'a1')
  const currentBackground = useState('currentBackground', () => 'b1')
  
  const savedOutfits = useState<Outfit[]>('savedOutfits', () => [])
  
  const currentOutfitId = useState('currentOutfitId', () => '')

  const saveCurrentOutfit = (name: string) => {
    const newOutfit: Outfit = {
      id: `outfit_${Date.now()}`,
      name,
      hairstyle: currentHairstyle.value,
      clothes: currentClothes.value,
      accessory: currentAccessory.value,
      background: currentBackground.value,
      createdAt: new Date(),
    }
    savedOutfits.value.push(newOutfit)
    return newOutfit
  }

  const loadOutfit = (outfitId: string) => {
    const outfit = savedOutfits.value.find(o => o.id === outfitId)
    if (outfit) {
      currentHairstyle.value = outfit.hairstyle
      currentClothes.value = outfit.clothes
      currentAccessory.value = outfit.accessory
      currentBackground.value = outfit.background
      currentOutfitId.value = outfitId
    }
  }

  const deleteOutfit = (outfitId: string) => {
    savedOutfits.value = savedOutfits.value.filter(o => o.id !== outfitId)
    if (currentOutfitId.value === outfitId) {
      currentOutfitId.value = ''
    }
  }

  const resetCurrent = () => {
    currentHairstyle.value = 'h1'
    currentClothes.value = 'c1'
    currentAccessory.value = 'a1'
    currentBackground.value = 'b1'
    currentOutfitId.value = ''
  }

  return {
    currentHairstyle,
    currentClothes,
    currentAccessory,
    currentBackground,
    savedOutfits,
    currentOutfitId,
    saveCurrentOutfit,
    loadOutfit,
    deleteOutfit,
    resetCurrent,
  }
}
