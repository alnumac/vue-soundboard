<template>
<div class="position-container">
  <div class="volume-container"
  ref="elContainer"
  :class="{'md-elevation-picker': active}"
  @click.stop
  @focusin="onFocus"
  @focusout="onBlur"
  tabindex=0>
    <Button
      type="button"
      icon="pi"
      class="p-button-rounded p-button-text p-button-plain"
      @click="toggleDisplay"
    >
      <SvgIcon type="mdi" :size="24" :path="volumeIcon" />
    </Button>
    <transition name="fade">
      <div v-if="active" class="slider-container">
        <Slider v-model="volume" orientation="vertical" :min="0" :max="100" :step="1" />
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import { ref, watch, computed } from 'vue'

import SvgIcon from '@jamescoyle/vue-icon'
import { mdiVolumeHigh, mdiVolumeMedium, mdiVolumeLow, mdiVolumeVariantOff } from '@mdi/js'

import Slider from 'primevue/slider';
import Button from 'primevue/button';

export default {
  components: { SvgIcon, Slider, Button },
  props: {
    modelValue: Number
  },
  emits: ['update:modelValue'],

  setup(props, context) {
    const elContainer = ref(null)
    const volume = ref(props.modelValue * 100)
    watch(volume, (newValue) => context.emit('update:modelValue', newValue * 0.01))
    
    const volumeIcon = computed( () => {
      if (volume.value > 66) return mdiVolumeHigh
      if (volume.value > 33) return mdiVolumeMedium
      if (volume.value >  0) return mdiVolumeLow
      return mdiVolumeVariantOff
    })

    const active = ref(false)
    function toggleDisplay() {
      if (active.value) {
        elContainer.value.focus()
      }
    }

    function onBlur(event) {
      if (!elContainer.value.contains(event.relatedTarget)) {
        active.value = false
      }
    }

    function onFocus(event) {
      active.value = true
    }


    return {
      elContainer,
      volume,
      volumeIcon,
      active,
      toggleDisplay,
      onBlur,
      onFocus
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

.volume-container {
  display: flex;
  position: absolute;
  bottom: 0px;
  flex-direction: column-reverse;
  align-items: center;
  border-radius: 24px;
  transition: background-color 0.2s ease;
}

.volume-container {
  cursor: pointer;
}

.slider-container {
  padding: 12px 0px;
}

.slider-container > * {
  margin: auto;
}

.p-slider-vertical {
  height: 84px;
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