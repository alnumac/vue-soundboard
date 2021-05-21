<template>
  <header class="md-elevation-app-bar md-color-surface">
    <div class="icon"><SvgIcon type="mdi" :size="24" :path="mdiPlayCircle"></SvgIcon></div>
    <h1>SoundBoard</h1>
  </header>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlayCircle } from '@mdi/js'

export default {
  components: {
    SvgIcon
  },
  setup() {
    return {
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
</style>