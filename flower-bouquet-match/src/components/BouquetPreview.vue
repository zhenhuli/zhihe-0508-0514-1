<template>
  <div class="preview-area">
    <div class="bouquet-preview">
      <div v-if="expandedMains.length === 0 && expandedFillers.length === 0 && !wrapper" class="uk-text-center uk-text-muted">
        <span style="font-size: 3rem;">💐</span>
        <p class="uk-margin-small-top">请选择花材开始搭配</p>
      </div>
      <div v-else class="bouquet-container">
        <div class="wrapper-layer">
          <div v-if="wrapper" class="wrapper-shape" :style="getWrapperStyle()"></div>
        </div>
        <div class="filler-flowers-layer">
          <div
            v-for="(flower, index) in expandedFillers"
            :key="'filler-' + index"
            class="flower-item"
            :style="getFlowerStyle(flower, index, 'filler')"
          >
            <span :style="{ fontSize: getFillerSize(index) }">{{ flower.icon }}</span>
          </div>
        </div>
        <div class="main-flowers-layer">
          <div
            v-for="(flower, index) in expandedMains"
            :key="'main-' + index"
            class="flower-item"
            :style="getFlowerStyle(flower, index, 'main')"
          >
            <span :style="{ fontSize: getMainSize(index) }">{{ flower.icon }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="expandedMains.length > 0 || expandedFillers.length > 0" class="uk-text-center uk-padding-small">
      <p class="uk-text-small uk-text-muted">
        共 {{ expandedMains.length }} 朵主花，{{ expandedFillers.length }} 朵配草
      </p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BouquetPreview',
  props: {
    mainFlowers: {
      type: Array,
      required: true
    },
    fillerFlowers: {
      type: Array,
      required: true
    },
    wrapper: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const expandedMains = computed(() => {
      const result = []
      props.mainFlowers.forEach(flower => {
        const quantity = flower.quantity || 1
        for (let i = 0; i < quantity; i++) {
          result.push({ ...flower, instanceIndex: i })
        }
      })
      return result
    })

    const expandedFillers = computed(() => {
      const result = []
      props.fillerFlowers.forEach(flower => {
        const quantity = flower.quantity || 1
        for (let i = 0; i < quantity; i++) {
          result.push({ ...flower, instanceIndex: i })
        }
      })
      return result
    })

    const getFlowerStyle = (flower, index, type) => {
      const totalCount = type === 'main' ? expandedMains.value.length : expandedFillers.value.length
      const positions = type === 'main'
        ? getMainPositions(totalCount)
        : getFillerPositions(totalCount)
      
      const pos = positions[index] || { x: 50, y: 50 }
      
      return {
        left: pos.x + '%',
        top: pos.y + '%',
        transform: 'translate(-50%, -50%)',
        zIndex: type === 'main' ? 10 : 5
      }
    }

    const getMainPositions = (count) => {
      const positions = []
      const centerX = 50
      const centerY = 45
      const baseRadius = 20

      if (count === 0) return positions
      
      if (count === 1) {
        positions.push({ x: centerX, y: centerY })
      } else if (count <= 3) {
        for (let i = 0; i < count; i++) {
          const angle = (i * 360 / count - 90) * Math.PI / 180
          positions.push({
            x: centerX + Math.cos(angle) * baseRadius * 0.5,
            y: centerY + Math.sin(angle) * baseRadius * 0.5
          })
        }
      } else if (count <= 6) {
        positions.push({ x: centerX, y: centerY })
        const ringCount = count - 1
        for (let i = 0; i < ringCount; i++) {
          const angle = (i * 360 / ringCount - 90) * Math.PI / 180
          positions.push({
            x: centerX + Math.cos(angle) * baseRadius * 0.8,
            y: centerY + Math.sin(angle) * baseRadius * 0.8
          })
        }
      } else if (count <= 10) {
        positions.push({ x: centerX, y: centerY })
        const innerRing = Math.min(4, count - 1)
        for (let i = 0; i < innerRing; i++) {
          const angle = (i * 360 / innerRing - 90) * Math.PI / 180
          positions.push({
            x: centerX + Math.cos(angle) * baseRadius * 0.6,
            y: centerY + Math.sin(angle) * baseRadius * 0.6
          })
        }
        const outerRing = count - 1 - innerRing
        if (outerRing > 0) {
          for (let i = 0; i < outerRing; i++) {
            const angle = (i * 360 / outerRing - 60) * Math.PI / 180
            positions.push({
              x: centerX + Math.cos(angle) * baseRadius * 1.1,
              y: centerY + Math.sin(angle) * baseRadius * 0.9
            })
          }
        }
      } else {
        positions.push({ x: centerX, y: centerY })
        const innerRing = 5
        for (let i = 0; i < innerRing; i++) {
          const angle = (i * 360 / innerRing - 90) * Math.PI / 180
          positions.push({
            x: centerX + Math.cos(angle) * baseRadius * 0.5,
            y: centerY + Math.sin(angle) * baseRadius * 0.5
          })
        }
        const midRing = Math.min(8, count - 6)
        for (let i = 0; i < midRing; i++) {
          const angle = (i * 360 / midRing - 75) * Math.PI / 180
          positions.push({
            x: centerX + Math.cos(angle) * baseRadius * 0.85,
            y: centerY + Math.sin(angle) * baseRadius * 0.85
          })
        }
        const outerRing = count - 6 - midRing
        if (outerRing > 0) {
          for (let i = 0; i < outerRing; i++) {
            const angle = (i * 360 / outerRing - 60) * Math.PI / 180
            positions.push({
              x: centerX + Math.cos(angle) * baseRadius * 1.2,
              y: centerY + Math.sin(angle) * baseRadius
            })
          }
        }
      }
      return positions
    }

    const getFillerPositions = (count) => {
      const positions = []
      const centerX = 50
      const centerY = 45
      const baseRadius = 28

      if (count === 0) return positions

      for (let i = 0; i < count; i++) {
        const angle = (i * 360 / count - 45) * Math.PI / 180
        const radiusVariation = 0.8 + (i % 3) * 0.15
        positions.push({
          x: centerX + Math.cos(angle) * baseRadius * radiusVariation,
          y: centerY + Math.sin(angle) * baseRadius * radiusVariation * 0.8
        })
      }
      return positions
    }

    const getMainSize = (index) => {
      const sizes = ['2.8rem', '2.6rem', '2.4rem', '2.2rem', '2rem', '1.9rem', '1.8rem', '1.7rem', '1.6rem', '1.5rem']
      return sizes[index] || '1.5rem'
    }

    const getFillerSize = (index) => {
      const sizes = ['1.6rem', '1.5rem', '1.4rem', '1.3rem', '1.2rem']
      return sizes[index % 5] || '1.2rem'
    }

    const getWrapperStyle = () => {
      if (!props.wrapper) return {}

      const baseStyle = {
        width: '220px',
        height: '180px',
        backgroundColor: props.wrapper.color,
        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
        bottom: '20px'
      }

      const textureStyles = {
        paper: { ...baseStyle, opacity: 0.9 },
        matte: { ...baseStyle, opacity: 0.85, filter: 'brightness(1.1)' },
        glitter: { ...baseStyle, opacity: 0.9, boxShadow: `0 0 20px ${props.wrapper.color}`, clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' },
        tulle: { ...baseStyle, opacity: 0.6, filter: 'blur(1px)', width: '240px', height: '200px', clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' },
        satin: { ...baseStyle, opacity: 0.95, background: `linear-gradient(135deg, ${props.wrapper.color} 0%, ${adjustColor(props.wrapper.color, -20)} 50%, ${props.wrapper.color} 100%)` },
        linen: { ...baseStyle, opacity: 0.85, filter: 'contrast(0.9)' },
        velvet: { ...baseStyle, opacity: 0.9, background: `linear-gradient(180deg, ${adjustColor(props.wrapper.color, 10)} 0%, ${props.wrapper.color} 100%)`, clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)' }
      }

      return textureStyles[props.wrapper.texture] || baseStyle
    }

    const adjustColor = (color, amount) => {
      const hex = color.replace('#', '')
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
      return `rgb(${r}, ${g}, ${b})`
    }

    return {
      expandedMains,
      expandedFillers,
      getFlowerStyle,
      getMainSize,
      getFillerSize,
      getWrapperStyle
    }
  }
}
</script>
