<template>
  <div class="stage-container">
    <div class="control-panel">
      <h4 class="center-align blue-text text-darken-2">
        <i class="material-icons left">highlight</i>
        舞台灯光模拟器
      </h4>
      
      <div class="row">
        <div class="col s12">
          <h6 class="control-label">灯光模式</h6>
        </div>
        <div class="col s6">
          <div 
            class="mode-card" 
            :class="{ active: mode === 'spotlight' }"
            @click="setMode('spotlight')"
          >
            <i class="material-icons mode-icon">flare</i>
            <div>聚光</div>
          </div>
        </div>
        <div class="col s6">
          <div 
            class="mode-card" 
            :class="{ active: mode === 'diffuse' }"
            @click="setMode('diffuse')"
          >
            <i class="material-icons mode-icon">wb_sunny</i>
            <div>漫射</div>
          </div>
        </div>
      </div>

      <div class="row control-row">
        <div class="col s12">
          <div 
            class="strobe-toggle"
            :class="{ active: strobeEnabled }"
            @click="toggleStrobe"
          >
            <i class="material-icons strobe-icon">flash_on</i>
            <span class="strobe-label">频闪效果</span>
            <div class="strobe-switch">
              <div class="strobe-knob"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="row control-row">
        <div class="col s12">
          <h6 class="control-label">灯光颜色</h6>
          <div class="color-picker-wrapper">
            <div class="color-preview" :style="{ backgroundColor: lightColor }"></div>
            <input 
              type="color" 
              v-model="lightColor"
              style="flex: 1; height: 50px; border: none; cursor: pointer;"
            >
          </div>
        </div>
      </div>

      <div class="row control-row">
        <div class="col s6">
          <h6 class="control-label">
            照射角度
            <span class="value-display">{{ angle }}°</span>
          </h6>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="angle" 
              min="-45" 
              max="45"
              step="1"
            >
          </div>
        </div>
        <div class="col s6">
          <h6 class="control-label">
            灯光亮度
            <span class="value-display">{{ brightness }}%</span>
          </h6>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="brightness" 
              min="10" 
              max="100"
              step="5"
            >
          </div>
        </div>
      </div>

      <div class="row control-row">
        <div class="col s6">
          <h6 class="control-label">
            光束宽度
            <span class="value-display">{{ beamWidth }}°</span>
          </h6>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="beamWidth" 
              min="15" 
              max="120"
              step="5"
            >
          </div>
        </div>
        <div class="col s6" v-if="strobeEnabled">
          <h6 class="control-label">
            闪烁频率
            <span class="value-display">{{ frequency }} Hz</span>
          </h6>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="frequency" 
              min="1" 
              max="30"
              step="1"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="preview-area">
      <div class="stage">
        <div class="curtain-left"></div>
        <div class="curtain-right"></div>
        <div class="backdrop"></div>
        
        <div class="stage-frame top"></div>
        <div class="stage-frame left"></div>
        <div class="stage-frame right"></div>
        
        <div class="light-fixture"></div>
        
        <div 
          class="light-beam"
          :class="[mode]"
          :style="beamStyle"
        ></div>
        
        <div class="stage-floor">
          <div class="floor-reflection" :style="floorReflectionStyle"></div>
          <div class="floor-planks"></div>
        </div>
        
        <div class="spotlight-floor" :style="spotlightFloorStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mode = ref('spotlight')
const lightColor = ref('#ff6b6b')
const angle = ref(0)
const brightness = ref(80)
const frequency = ref(10)
const beamWidth = ref(45)
const strobeEnabled = ref(false)

const setMode = (newMode) => {
  mode.value = newMode
}

const toggleStrobe = () => {
  strobeEnabled.value = !strobeEnabled.value
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 107, b: 107 }
}

const beamStyle = computed(() => {
  const opacity = brightness.value / 100
  const duration = `${1000 / frequency.value}ms`
  const rgb = hexToRgb(lightColor.value)
  
  const width = 100 + (beamWidth.value / 120) * 400
  const height = 280
  
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translateX(-50%) rotate(${angle.value}deg)`,
    background: `linear-gradient(180deg, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.9}) 0%, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5}) 30%, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.2}) 60%, 
      transparent 100%)`,
    boxShadow: `0 0 80px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.6}),
                0 0 120px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.3})`,
    filter: `blur(${mode.value === 'diffuse' ? '15px' : '3px'})`,
    clipPath: mode.value === 'spotlight' 
      ? `polygon(${50 - beamWidth.value/4}% 0%, ${50 + beamWidth.value/4}% 0%, ${50 + beamWidth.value/2}% 100%, ${50 - beamWidth.value/2}% 100%)`
      : 'none'
  }
  
  if (strobeEnabled.value) {
    baseStyle.animation = `strobe ${duration} infinite`
  }
  
  return baseStyle
})

const floorReflectionStyle = computed(() => {
  const opacity = brightness.value / 100
  const duration = `${1000 / frequency.value}ms`
  const rgb = hexToRgb(lightColor.value)
  const width = 100 + (beamWidth.value / 120) * 400
  
  const style = {
    width: `${width * 1.2}px`,
    height: '80px',
    transform: `translateX(-50%) rotateX(180deg) translateX(${angle.value * 2}px)`,
    background: `radial-gradient(ellipse at center, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.4}) 0%, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.15}) 40%, 
      transparent 70%)`,
    filter: 'blur(10px)'
  }
  
  if (strobeEnabled.value) {
    style.animation = `strobe ${duration} infinite`
  }
  
  return style
})

const spotlightFloorStyle = computed(() => {
  const opacity = brightness.value / 100
  const duration = `${1000 / frequency.value}ms`
  const rgb = hexToRgb(lightColor.value)
  const floorSpotSize = 80 + (beamWidth.value / 120) * 200
  
  const style = {
    width: `${floorSpotSize}px`,
    height: `${floorSpotSize * 0.4}px`,
    transform: `translateX(-50%) translateX(${angle.value * 3}px)`,
    background: `radial-gradient(ellipse at center, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.6}) 0%, 
      rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.3}) 30%, 
      transparent 60%)`,
    borderRadius: '50%',
    filter: 'blur(8px)'
  }
  
  if (strobeEnabled.value) {
    style.animation = `strobe ${duration} infinite`
  }
  
  return style
})
</script>

<style>
@keyframes strobe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
