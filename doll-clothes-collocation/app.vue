<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
    <header class="bg-white/80 backdrop-blur-sm shadow-lg">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          🎀 玩偶服饰搭配模拟器
        </h1>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <DollPreview />
          <SavedOutfits />
        </div>
        <div class="space-y-6">
          <ItemSelector title="💇 发型" :items="hairstyles" :selected="currentHairstyle" @select="currentHairstyle = $event" />
          <ItemSelector title="👗 衣服" :items="clothes" :selected="currentClothes" @select="currentClothes = $event" />
          <ItemSelector title="✨ 配饰" :items="accessories" :selected="currentAccessory" @select="currentAccessory = $event" />
          <BackgroundSelector />
          <SaveOutfit />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { hairstyles, clothes, accessories } from '~/data/items'

const { currentHairstyle, currentClothes, currentAccessory } = useDoll()
</script>
