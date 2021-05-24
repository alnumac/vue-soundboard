<template>
  <div>
    <SoundPlayer :id="id" @remove="$emit('remove')"/>
  </div>
</template>

<script>
//import BoardSection from '@/components/BoardSection'
import SoundPlayer from '@/components/SoundPlayer.vue'

export default {
  props: {
    id: String
  },
  components: {
    SoundPlayer
  },
  emits: ['remove'],
  setup() {
    return {

    }
  }
}
</script>

<style scoped>
div {
  grid-column-end: span 2;
}
</style>