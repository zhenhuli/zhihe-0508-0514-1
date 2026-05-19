<template>
  <div>
    <header class="page-header">
      <div class="uk-container">
        <h1 class="uk-text-center">💐 鲜花花束搭配设计工具</h1>
        <p class="uk-text-center uk-margin-remove">自由搭配主花、配草、包装，打造专属于你的美丽花束</p>
      </div>
    </header>

    <main class="main-container">
      <div class="uk-container">
        <div class="uk-grid uk-grid-medium" uk-grid>
          <div class="uk-width-1-2@m">
            <div class="card">
              <div class="card-header">🎨 选择搭配</div>
              <div class="card-body">
                <ul uk-tab>
                  <li class="uk-active"><a href="#">主花</a></li>
                  <li><a href="#">配草</a></li>
                  <li><a href="#">包装</a></li>
                </ul>

                <ul class="uk-switcher uk-margin">
                  <li>
                    <FlowerSelector
                      :items="mainFlowers"
                      :get-quantity="getMainFlowerQuantity"
                      @update="updateMainFlower"
                    />
                  </li>
                  <li>
                    <FlowerSelector
                      :items="fillerFlowers"
                      :get-quantity="getFillerFlowerQuantity"
                      @update="updateFillerFlower"
                    />
                  </li>
                  <li>
                    <WrapperSelector
                      :items="wrappers"
                      :selected="selectedWrapper"
                      @select="selectWrapper"
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div class="control-panel uk-margin-top">
              <h3 class="uk-h4 uk-margin-small-bottom">已选搭配</h3>
              <div class="uk-margin-small">
                <span class="uk-text-muted">主花：</span>
                <span v-if="selectedMainFlowersList.length > 0">
                  {{ selectedMainFlowersList.map(f => `${f.name}×${f.quantity}`).join('、') }}
                </span>
                <span v-else class="uk-text-muted">未选择</span>
              </div>
              <div class="uk-margin-small">
                <span class="uk-text-muted">配草：</span>
                <span v-if="selectedFillerFlowersList.length > 0">
                  {{ selectedFillerFlowersList.map(f => `${f.name}×${f.quantity}`).join('、') }}
                </span>
                <span v-else class="uk-text-muted">未选择</span>
              </div>
              <div class="uk-margin-small">
                <span class="uk-text-muted">包装：</span>
                <span v-if="selectedWrapper">{{ selectedWrapper.name }} ({{ selectedWrapper.style }})</span>
                <span v-else class="uk-text-muted">未选择</span>
              </div>
              <button class="uk-button uk-button-primary uk-margin-top" @click="resetSelection">
                重新选择
              </button>
            </div>
          </div>

          <div class="uk-width-1-2@m">
            <div class="card">
              <div class="card-header">👀 花束预览</div>
              <div class="card-body">
                <BouquetPreview
                  :main-flowers="selectedMainFlowersList"
                  :filler-flowers="selectedFillerFlowersList"
                  :wrapper="selectedWrapper"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { mainFlowers, fillerFlowers, wrappers } from './data/flowers.js'
import FlowerSelector from './components/FlowerSelector.vue'
import WrapperSelector from './components/WrapperSelector.vue'
import BouquetPreview from './components/BouquetPreview.vue'

export default {
  name: 'App',
  components: {
    FlowerSelector,
    WrapperSelector,
    BouquetPreview
  },
  setup() {
    const selectedMainFlowers = ref({})
    const selectedFillerFlowers = ref({})
    const selectedWrapper = ref(null)

    const selectedMainFlowersList = computed(() => {
      return Object.entries(selectedMainFlowers.value)
        .filter(([id, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const flower = mainFlowers.find(f => f.id === id)
          return flower ? { ...flower, quantity } : null
        })
        .filter(Boolean)
    })

    const selectedFillerFlowersList = computed(() => {
      return Object.entries(selectedFillerFlowers.value)
        .filter(([id, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const flower = fillerFlowers.find(f => f.id === id)
          return flower ? { ...flower, quantity } : null
        })
        .filter(Boolean)
    })

    const updateMainFlower = (flower, quantity) => {
      const newVal = { ...selectedMainFlowers.value }
      if (quantity <= 0) {
        delete newVal[flower.id]
      } else {
        newVal[flower.id] = Math.min(quantity, 9)
      }
      selectedMainFlowers.value = newVal
    }

    const updateFillerFlower = (flower, quantity) => {
      const newVal = { ...selectedFillerFlowers.value }
      if (quantity <= 0) {
        delete newVal[flower.id]
      } else {
        newVal[flower.id] = Math.min(quantity, 9)
      }
      selectedFillerFlowers.value = newVal
    }

    const getMainFlowerQuantity = (flower) => {
      return selectedMainFlowers.value[flower.id] || 0
    }

    const getFillerFlowerQuantity = (flower) => {
      return selectedFillerFlowers.value[flower.id] || 0
    }

    const selectWrapper = (wrapper) => {
      selectedWrapper.value = wrapper
    }

    const resetSelection = () => {
      selectedMainFlowers.value = {}
      selectedFillerFlowers.value = {}
      selectedWrapper.value = null
    }

    return {
      mainFlowers,
      fillerFlowers,
      wrappers,
      selectedMainFlowers,
      selectedFillerFlowers,
      selectedMainFlowersList,
      selectedFillerFlowersList,
      selectedWrapper,
      updateMainFlower,
      updateFillerFlower,
      getMainFlowerQuantity,
      getFillerFlowerQuantity,
      selectWrapper,
      resetSelection
    }
  }
}
</script>
