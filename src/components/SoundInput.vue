<template>
  <button class="md-elevation-fab floating-action-button">
    <label for="file-upload" class="custom-file-upload">
      <SvgIcon class="icon" type="mdi" :path="mdiPlus" :size="24"></SvgIcon>
    </label>
    <input id="file-upload" type="file" @change="onFileUpload" accept="audio/*">
  </button>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlus } from '@mdi/js'

export default {
  components: {
    SvgIcon
  },
  setup(props, context) {
    function onFileUpload (event) {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        context.emit('upload', files[i])
      }
    }
    return {
      onFileUpload,
      mdiPlus
    }
  }
}
</script>

<style scoped>
.floating-action-button {
  border: none;
  background-color: var(--md-color-primary);
  border-radius: 50%;
  padding: 0;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  appearance: none;
  display: block;
  height: 56px;
  width: 56px;
  overflow: hidden;
}

.custom-file-upload {
  padding: 1rem;
}

input[type="file"] {
    display: none;
}


</style>