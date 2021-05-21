<template>
  <button class="">
    <label for="sound-upload" class="custom-file-upload">
      <div class="icon-bg">
      <SvgIcon class="icon" type="mdi" :path="mdiPlus" :size="24"></SvgIcon>
      </div>
    </label>
    <input id="sound-upload" type="file" @change="onFileUpload" accept="audio/*">
  </button>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlus } from '@mdi/js'
import sha1 from 'js-sha1'
import db from '@/db'

export default {
  components: {
    SvgIcon
  },
  setup(props, context) {
    async function addToFileDb(id, file) {
      const value = await db.files.getItem(id)
      if (value === null)
        await db.files.setItem(id, file)
    }

    function splitFileNameAndExtension(fileNameWithExtension) {
      const parts = fileNameWithExtension.split('.')
      const extension = parts.pop()
      const fileName = parts.join('.')
      return {fileName, extension}
    }

    function prettyName(name) {
      return name.replaceAll('_', ' ')
    }

    async function addToSoundDb(id, file) {
      const value = await db.entries.getItem(id)
      if (value === null) {
        const { fileName, extension } = splitFileNameAndExtension(file.name)
        const soundTitle = prettyName(fileName)
        await db.entries.setItem(id, {
          icon: 'default',
          title: soundTitle,
          extension: extension,
          repeat: true,
          volume: 1
        })
      }
    }

    async function onFileUpload (event) {
      event.target.files.forEach( async (file) => {
        let buffer = await file.arrayBuffer()
        let file_sha1 = await sha1(buffer)
        await addToFileDb(file_sha1, file)
        await addToSoundDb(file_sha1, file)
        context.emit('upload', file_sha1)
      })
    }
    return {
      onFileUpload,
      mdiPlus
    }
  }
}
</script>

<style scoped>
button {
  border: none;
  background-color: unset;
  padding: 0;
  bottom: 2rem;
  right: 2rem;
  appearance: none;
  display: block;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.custom-file-upload {
  padding: 1rem;
  display: flex;
  height: 100%;
  width: 100%;
}

.icon-bg {
  background-color: var(--md-color-primary);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  margin: auto;
  padding: 1rem;
}

input[type="file"] {
    display: none;
}


</style>