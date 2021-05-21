<template>
  <div class="container md-color-surface md-elevation-card"
    :class="{
      playing: isPlaying,
      loading: isLoading
    }"
    @click="togglePlay">
    <div class="icon primary">
      <LoadSpinner v-if="isLoading"/>
      <SvgIcon v-if="!isLoading" type="mdi" :size="36" :path="mdiVolumeHigh" />
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="actions">
      <div class="icon volume">
        <SvgIcon type="mdi" :size="24" :path="mdiVolumeHigh" />
      </div>
      <div class="icon repeat" @click.stop="toggleLoop">
        <SvgIcon type="mdi" :size="24" :path="loop ? mdiRepeat : mdiRepeatOff" />
      </div>
      <div class="icon more">
        <SvgIcon type="mdi" :size="24" :path="mdiDotsVertical" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import LoadSpinner from '@/components/LoadSpinner.vue'
import db from '@/db'

import { Howl } from 'howler';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical } from '@mdi/js'

export default {
  props: {
    id: String
  },
  components: {
    SvgIcon,
    LoadSpinner
  },

  setup(props) {

    const title = ref('test')
    const volume = ref(1)
    const loop = ref(false)
    let howl = null
    const isLoading = ref(false)
    const isPlaying = ref(false)

    const togglePlay = computed(() => {
      if (isLoading.value) return nothing
      if (isPlaying.value) return stop
      else return play
    })

    function toggleLoop() {
      loop.value = !loop.value
      if (howl) howl.loop()
    }

    async function loadEntry() {
      const loaded_entry = await db.entries.getItem(props.id)
      if (loaded_entry !== null) {
        title.value = loaded_entry.title
      }
    }

    async function nothing() {
    }

    async function stop() {
      howl.stop()
    }

    async function play() {
      if (howl === null) {
        isLoading.value = true
        const src = await loadFileAsURL(props.id)
        howl = await createHowl(src)
        isLoading.value = false
      }
      howl.play()
    }

    async function loadFileAsURL(id) {
      const loaded_file = await db.files.getItem(id)
      if (loaded_file !== null) {
        return URL.createObjectURL(loaded_file)
      }
    }

    function createHowl(src) {
      return new Promise(
        (resolve) => {
          const howl = new Howl({
            src,
            format: 'mp3',
            volume: volume.value,
            loop: loop.value,
            onload: () => resolve(howl),
            onplay: () => isPlaying.value = true,
            onend: () => isPlaying.value = false,
            onstop: () => isPlaying.value = false
          })
        })
    }

    onMounted(loadEntry)

    return {
      title,
      loop,
      isPlaying,
      isLoading,
      togglePlay,
      toggleLoop,
      mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical
    }
  }

}
</script>

<style scoped>
.container {
  width: 160px;
  height: 160px;
  display: grid;
  grid-template-rows: 40px 56px 48px;
  text-align: center;
  align-items: center;
  padding: 12px 6px 0px 6px;
  border: solid 2px hsla(270, 96%, 79%, 0%);
}

.container.loading {
}

.container.playing {
  background-color: hsla(270, 96%, 79%, 14%);
  border: solid 2px hsl(270, 96%, 79%);
}

.container.playing:hover {
  background-color: hsla(270, 96%, 79%, 19%);
}

.container > * {
  max-width: 160px;
}

.icon.primary {
  opacity: 30%;
}

.title {
  color: hsla(0, 100%, 100%, 87%);
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.06em;
  user-select: none;
  text-overflow: ellipsis;
  word-wrap: break-word;
  max-height: 56px;
  overflow: hidden;
}

.actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.actions > .icon:hover {
  background-color: hsla(0, 100%, 100%, 10%);
  
}

.actions > .icon {
  padding: 12px;
  height: 48px;
  width: 48px;
  opacity: 59%;
  border-radius: 50%;
}
</style>