<template>
  <div>
    <SoundPlayer :id="id" />
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