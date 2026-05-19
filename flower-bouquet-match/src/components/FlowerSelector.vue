<template>
  <div>
    <p class="uk-text-small uk-text-muted uk-margin-small-bottom">
      点击 + 增加数量，点击 - 减少数量
    </p>
    <div class="item-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="item-card"
        :class="{ selected: getQuantity(item) > 0 }"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-color" :style="{ backgroundColor: item.color }"></div>
        <div class="item-name">{{ item.name }}</div>
        <div class="quantity-controls" style="margin-top: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
          <button
            class="uk-button uk-button-default uk-button-small"
            style="width: 24px; height: 24px; padding: 0; line-height: 1; min-height: 24px;"
            @click.stop="decrease(item)"
            :disabled="getQuantity(item) <= 0"
          >
            -
          </button>
          <span style="min-width: 20px; text-align: center; font-weight: 600;">
            {{ getQuantity(item) }}
          </span>
          <button
            class="uk-button uk-button-primary uk-button-small"
            style="width: 24px; height: 24px; padding: 0; line-height: 1; min-height: 24px; background: #ec4899; border: none;"
            @click.stop="increase(item)"
            :disabled="getQuantity(item) >= 9"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowerSelector',
  props: {
    items: {
      type: Array,
      required: true
    },
    getQuantity: {
      type: Function,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const increase = (item) => {
      const current = props.getQuantity(item)
      if (current < 9) {
        emit('update', item, current + 1)
      }
    }

    const decrease = (item) => {
      const current = props.getQuantity(item)
      if (current > 0) {
        emit('update', item, current - 1)
      }
    }

    return {
      getQuantity: props.getQuantity,
      increase,
      decrease
    }
  }
}
</script>
