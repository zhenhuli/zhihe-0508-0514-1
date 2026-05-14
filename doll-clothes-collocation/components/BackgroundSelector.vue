<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">🎨 背景</h3>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="bg in backgrounds"
        :key="bg.id"
        @click="currentBackground = bg.id"
        class="relative w-full aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
        :class="currentBackground === bg.id ? 'ring-4 ring-purple-400 ring-offset-2 scale-105' : 'hover:shadow-md'"
        :style="{ background: bg.gradient }"
      >
      </button>
    </div>
    <p class="mt-3 text-sm text-gray-500 text-center">
      已选: <span class="font-medium text-gray-700">{{ currentBgData?.name }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { backgrounds } from '~/data/items'

const { currentBackground } = useDoll()

const currentBgData = computed(() => backgrounds.find(b => b.id === currentBackground.value))
</script>
