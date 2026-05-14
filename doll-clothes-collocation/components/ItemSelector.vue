<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="item in items"
        :key="item.id"
        @click="$emit('select', item.id)"
        class="relative w-full aspect-square rounded-xl transition-all duration-300 transform hover:scale-105"
        :class="selected === item.id ? 'ring-4 ring-pink-400 ring-offset-2 scale-105' : 'hover:shadow-md'"
      >
        <div 
          class="absolute inset-0 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: item.color }"
        >
          <span class="text-white text-xs font-bold drop-shadow-md">{{ item.name.charAt(0) }}</span>
        </div>
      </button>
    </div>
    <p class="mt-3 text-sm text-gray-500 text-center">
      已选: <span class="font-medium text-gray-700">{{ selectedItem?.name }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: string
  name: string
  color: string
  image: string
}

const props = defineProps<{
  title: string
  items: Item[]
  selected: string
}>()

defineEmits<{
  select: [id: string]
}>()

const selectedItem = computed(() => {
  return props.items.find(i => i.id === props.selected)
})
</script>
