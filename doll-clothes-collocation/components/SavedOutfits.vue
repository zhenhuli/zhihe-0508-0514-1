<template>
  <div class="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-6">👗 已保存的造型 ({{ savedOutfits.length }})</h2>
    <div v-if="savedOutfits.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-6xl mb-4">🎀</p>
      <p>还没有保存的造型哦~</p>
      <p class="text-sm">搭配好造型后点击"保存造型"吧！</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="outfit in savedOutfits"
        :key="outfit.id"
        class="relative group"
      >
        <div
          class="aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          :class="currentOutfitId === outfit.id ? 'ring-4 ring-green-400' : ''"
          @click="loadOutfit(outfit.id)"
        >
          <div class="w-full h-full p-4" :style="{ background: getBgGradient(outfit.background) }">
            <div class="w-full h-full flex items-center justify-center">
              <div class="transform scale-75">
                <div class="w-16 h-20 bg-[#FFE4C4] rounded-2xl relative">
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-10 rounded-t-full" :style="{ backgroundColor: getHairColor(outfit.hairstyle) }"></div>
                  <div class="absolute -top-2 -left-1 w-3 h-8 rounded-full" :style="{ backgroundColor: getHairColor(outfit.hairstyle) }"></div>
                  <div class="absolute -top-2 -right-1 w-3 h-8 rounded-full" :style="{ backgroundColor: getHairColor(outfit.hairstyle) }"></div>
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#FFE4C4] rounded-full"></div>
                  <div class="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-xl rounded-b-lg" :style="{ backgroundColor: getClothesColor(outfit.clothes) }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 text-center">
          <p class="font-medium text-gray-700 text-sm truncate">{{ outfit.name }}</p>
          <p class="text-xs text-gray-400">{{ formatDate(outfit.createdAt) }}</p>
        </div>
        <button
          @click.stop="deleteOutfit(outfit.id)"
          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
        >
          ✕
        </button>
        <div
          v-if="currentOutfitId === outfit.id"
          class="absolute -top-2 -left-2 w-6 h-6 bg-green-500 text-white rounded-full text-xs flex items-center justify-center"
        >
          ✓
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hairstyles, clothes, backgrounds } from '~/data/items'

const { savedOutfits, currentOutfitId, loadOutfit, deleteOutfit } = useDoll()

const getHairColor = (id: string) => hairstyles.find(h => h.id === id)?.color || '#8B4513'
const getClothesColor = (id: string) => clothes.find(c => c.id === id)?.color || '#FF69B4'
const getBgGradient = (id: string) => backgrounds.find(b => b.id === id)?.gradient || 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)'

const formatDate = (date: Date) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>
