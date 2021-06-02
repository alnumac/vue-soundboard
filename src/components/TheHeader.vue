<template>
  <header class="md-elevation-app-bar md-color-surface">
    <div class="icon"><SvgIcon type="mdi" :size="24" :path="mdiPlayCircle"></SvgIcon></div>
    <slot name="title">
      <h1>App</h1>
    </slot>
    <slot name="center">
    </slot>
    <slot name="actions">
    </slot>
    <Slider v-model="globalVolume" :min="0" :max="100" :step="1" />
  </header>
</template>

<script>
import { ref, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlayCircle } from '@mdi/js'

import Slider from 'primevue/slider';
import { Howler } from 'howler';

export default {
  components: {
    SvgIcon,
    Slider
  },
  setup() {
    const globalVolume = ref(Howler.volume() * 100)
    watch(globalVolume, (newValue, oldValue) => {
      Howler.volume(newValue * 0.01)
    })
    return {
      globalVolume,
      mdiPlayCircle
    }
  }
}
</script>

<style scoped>
header {
  position: sticky;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  height: 64px;
  width:100%;
}

.icon {
  width: 48px;
  height: 48px;
  padding: 12px;
}

h1 {
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.25rem;
  line-height: 2rem;
  letter-spacing: 0.4px;
  font-family: "Roboto Mono", monospace;
  font-weight: 500;
  letter-spacing: 0.0125em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.p-slider-horizontal {
  width: 100px;
}
</style>