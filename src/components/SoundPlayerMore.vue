<template>
<div class="position-container" @mouseout.stop>
  <div class="more-container"
  :class="{'active': active}"
  @click.stop
  @focus="active = true"
  @blur="active = false"
  tabindex=0>
    <SvgIcon type="mdi" :size="24" :path="mdiDotsVertical" @click.stop="setActive" />
    <transition name="fade">
      <div v-if="active" class="options-container md-elevation-picker">
        <button @click="remove">Remove</button>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
//ref, reactive, toRefs, computed, watch, onMounted, onUpdated, onUnmounted
import { ref, watch } from 'vue'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDotsVertical } from '@mdi/js'

export default {
  components: { SvgIcon },
  props: {
    modelValue: Number
  },
  emits: ['remove'],

  setup(props, context) {

    const volume = ref(props.modelValue * 100)
    watch(volume, (newValue) => context.emit('update:modelValue', newValue * 0.01))

    const active = ref(false)
    function setActive() {
      active.value = true
    }

    function remove() {
      context.emit('remove')
    }

    return {
      volume,
      mdiDotsVertical,
      setActive,
      active,
      remove
    }
  },
}
</script>

<style scoped>

.position-container {
  position: relative;
  width: 48px;
  height: 48px;
}

.more-container {
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.options-container {
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
}

.options-container > button {
  all: unset;
  padding: 12px;
}

.options-container > button:hover {
  background-color: hsla(0, 100%, 100%, 4%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>