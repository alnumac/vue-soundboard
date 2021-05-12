<template>
  <div class="container">
    <input type="file" @change="onFileUpload" accept="audio/*">
  </div>
</template>

<script>

export default {
  components: {
  },
  setup(props, context) {
    function onFileUpload (event) {
      const files = event.target.files
      for (let i = 0; i < files.length; i++) {
        context.emit('upload', files[i])
      }
    }
    return {
      onFileUpload
    }
  }
}
</script>

<style scoped>

</style>