<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">💾 保存当前造型</h3>
    <div class="space-y-3">
      <input
        v-model="outfitName"
        type="text"
        placeholder="给这个造型起个名字..."
        class="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
        @keyup.enter="handleSave"
      />
      <div class="flex gap-2">
        <button
          @click="handleSave"
          :disabled="!outfitName.trim()"
          class="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存造型
        </button>
        <button
          @click="resetCurrent"
          class="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { saveCurrentOutfit, resetCurrent } = useDoll()

const outfitName = ref('')

const handleSave = () => {
  if (outfitName.value.trim()) {
    saveCurrentOutfit(outfitName.value.trim())
    outfitName.value = ''
  }
}
</script>
