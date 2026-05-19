<template>
  <div>
    <p class="uk-text-small uk-text-muted uk-margin-small-bottom">
      选择一种包装材质
    </p>
    <div class="item-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="item-card"
        :class="{ selected: isSelected(item) }"
        @click="$emit('select', item)"
      >
        <div
          class="item-color"
          :style="{
            backgroundColor: item.color,
            width: '40px',
            height: '40px',
            borderRadius: getBorderRadius(item.texture)
          }"
        ></div>
        <div class="item-name" style="margin-top: 0.5rem;">{{ item.name }}</div>
        <div class="item-name" style="color: #9ca3af;">{{ item.style }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WrapperSelector',
  props: {
    items: {
      type: Array,
      required: true
    },
    selected: {
      type: Object,
      default: null
    }
  },
  emits: ['select'],
  setup(props) {
    const isSelected = (item) => {
      return props.selected && props.selected.id === item.id
    }

    const getBorderRadius = (texture) => {
      const radiusMap = {
        paper: '4px',
        matte: '2px',
        glitter: '50%',
        tulle: '8px',
        satin: '0px',
        linen: '6px',
        velvet: '12px'
      }
      return radiusMap[texture] || '4px'
    }

    return {
      isSelected,
      getBorderRadius
    }
  }
}
</script>
