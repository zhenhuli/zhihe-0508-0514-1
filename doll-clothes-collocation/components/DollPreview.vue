<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
    <h2 class="text-xl font-semibold text-gray-700 mb-6 text-center">👀 当前造型预览</h2>
    <div 
      class="relative w-full max-w-md mx-auto h-96 rounded-2xl overflow-hidden shadow-inner"
      :style="{ background: currentBgData?.gradient }"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative transform scale-150">
          <div class="w-24 h-32 bg-[#FFE4C4] rounded-3xl relative">
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center z-10">
              <div class="absolute -top-2 -left-1 w-20 h-16 rounded-t-full" :style="{ backgroundColor: hairData?.color }"></div>
              <div class="absolute top-2 -left-3 w-5 h-12 rounded-full" :style="{ backgroundColor: hairData?.color }"></div>
              <div class="absolute top-2 -right-3 w-5 h-12 rounded-full" :style="{ backgroundColor: hairData?.color }"></div>
              <div class="w-14 h-14 bg-[#FFE4C4] rounded-full border-4 border-white shadow-lg relative z-10">
                <div class="absolute top-3 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                <div class="absolute top-3 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                <div class="absolute top-5 left-1 w-3 h-1 bg-pink-300 rounded-full opacity-60"></div>
                <div class="absolute top-5 right-1 w-3 h-1 bg-pink-300 rounded-full opacity-60"></div>
                <div class="absolute top-7 left-1/2 -translate-x-1/2 w-2 h-1 bg-pink-400 rounded-full"></div>
              </div>
            </div>
            <div class="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-20 rounded-t-3xl rounded-b-lg shadow-lg z-0" :style="{ backgroundColor: clothesData?.color }">
              <div class="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/50 rounded-full"></div>
            </div>
            <div class="absolute z-20" :class="getAccessoryPosition(accessoryData?.id)">
              <template v-if="accessoryData?.id === 'a1'">
                <div class="w-8 h-6 flex items-center justify-center">
                  <div class="w-7 h-5 rounded-full" :style="{ backgroundColor: accessoryData.color }"></div>
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-3 rounded-t-full" :style="{ backgroundColor: accessoryData.color }"></div>
                </div>
              </template>
              <template v-else-if="accessoryData?.id === 'a2'">
                <div class="w-12 h-8 rounded-t-full" :style="{ backgroundColor: accessoryData.color }">
                  <div class="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full"></div>
                </div>
              </template>
              <template v-else-if="accessoryData?.id === 'a3'">
                <div class="flex gap-1">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: accessoryData.color }"></div>
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: accessoryData.color }"></div>
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: accessoryData.color }"></div>
                </div>
              </template>
              <template v-else-if="accessoryData?.id === 'a4'">
                <div class="flex items-center gap-1">
                  <div class="w-5 h-4 rounded border-2" :style="{ borderColor: accessoryData.color }"></div>
                  <div class="w-1 h-1 rounded-full bg-gray-600"></div>
                  <div class="w-5 h-4 rounded border-2" :style="{ borderColor: accessoryData.color }"></div>
                </div>
              </template>
              <template v-else-if="accessoryData?.id === 'a5'">
                <div class="w-8 h-6 rounded-lg" :style="{ backgroundColor: accessoryData.color }">
                  <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-3 rounded-t-full border-2" :style="{ borderColor: accessoryData.color }"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-wrap justify-center gap-3">
      <div class="px-4 py-2 bg-pink-100 rounded-full text-sm text-pink-700">
        {{ hairData?.name }}
      </div>
      <div class="px-4 py-2 bg-blue-100 rounded-full text-sm text-blue-700">
        {{ clothesData?.name }}
      </div>
      <div class="px-4 py-2 bg-purple-100 rounded-full text-sm text-purple-700">
        {{ accessoryData?.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hairstyles, clothes, accessories, backgrounds } from '~/data/items'

const { currentHairstyle, currentClothes, currentAccessory, currentBackground } = useDoll()

const hairData = computed(() => hairstyles.find(h => h.id === currentHairstyle.value))
const clothesData = computed(() => clothes.find(c => c.id === currentClothes.value))
const accessoryData = computed(() => accessories.find(a => a.id === currentAccessory.value))
const currentBgData = computed(() => backgrounds.find(b => b.id === currentBackground.value))

const getAccessoryPosition = (id?: string) => {
  switch(id) {
    case 'a1': return '-top-4 left-1/2 -translate-x-1/2'
    case 'a2': return '-top-8 left-1/2 -translate-x-1/2'
    case 'a3': return 'top-14 left-1/2 -translate-x-1/2'
    case 'a4': return 'top-0 left-1/2 -translate-x-1/2'
    case 'a5': return 'top-16 -right-2'
    default: return '-top-2 right-0'
  }
}
</script>
