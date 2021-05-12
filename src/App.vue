<template>
  <SoundInput @upload="onFileUpload"/>
  <div v-for="file in files" :key="file">
    <SoundPlayer v-bind:file="file" />
  </div>
</template>

<script>
import SoundInput from './components/SoundInput.vue'
import SoundPlayer from './components/SoundPlayer.vue'

export default {
  name: 'App',
  components: {
    SoundInput,
    SoundPlayer
  },
  data: function () {
    return {
      files: []
    }
  },
  methods: {
    onFileUpload (file) {
      this.files.push(file)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
