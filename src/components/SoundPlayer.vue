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
        <!-- <SvgIcon type="mdi" :size="24" :path="mdiVolumeHigh" /> -->
        <SoundVolume v-model="volume" />
      </div>
      <div class="icon loop" @click.stop="toggleLoop">
        <SvgIcon type="mdi" :size="24" :path="loop ? mdiRepeat : mdiRepeatOff" />
      </div>
      <div class="icon more">
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          class="p-button-rounded p-button-text p-button-plain"
          @click.stop="toggleMoreMenu"
        />
        <Menu ref="moreMenuElement" :model="moreMenuItems" :popup="true" />
        <!-- <SoundMore @remove="remove"/> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import LoadSpinner from '@/components/LoadSpinner.vue'
import db from '@/db'
import { debounce } from 'lodash';

import { Howl } from 'howler';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical } from '@mdi/js'

import Button from 'primevue/button';
import Menu from 'primevue/menu';

import SoundVolume from '@/components/SoundVolume'
import SoundMore from '@/components/SoundMore'

export default {
  props: {
    id: String
  },
  components: {
    SvgIcon,
    LoadSpinner,
    SoundVolume,
    SoundMore,
    Button,
    Menu
  },
  emits: ['remove'],

  setup(props, context) {

    const title = ref('test')
    const extension = ref('mp3')

    const volume = ref(1)
    watch(volume, (newValue, oldValue) => {
      if (howl)
        howl.volume(newValue)
      debouncedSaveEntry()
    })

    const loop = ref(false)
    watch(loop, (newValue, oldValue) => {
      if (howl)
        howl.loop(newValue)
      debouncedSaveEntry()
    })

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
        volume.value = loaded_entry.volume
        loop.value = loaded_entry.value
        extension.value = loaded_entry.extension || 'mp3'
      }
    }

    async function saveEntry() {
      const new_entry = {
        title: title.value,
        volume: volume.value,
        loop: loop.value,
        extension: extension.value
      }
      await db.entries.setItem(props.id, new_entry)
    }

    const debouncedSaveEntry = debounce(saveEntry, 300)

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
            format: extension.value,
            volume: volume.value,
            loop: loop.value,
            onload: () => resolve(howl),
            onplay: () => isPlaying.value = true,
            onend: () => isPlaying.value = false,
            onstop: () => isPlaying.value = false
          })
        })
    }

    function remove() {
      if (howl)
        howl.unload()
      context.emit('remove')
    }
    const moreMenuElement = ref(null)
    function toggleMoreMenu(event) {
      moreMenuElement.value.toggle(event);
    }
    const moreMenuItems = reactive([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => {}
      },
      {
        label: 'Remove',
        icon: 'pi pi-times',
        command: () => context.emit('remove')
      },
    ])

    onMounted(loadEntry)

    return {
      title,
      volume,
      loop,
      isPlaying,
      isLoading,
      togglePlay,
      toggleLoop,
      remove,
      mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical,
      moreMenuElement,
      toggleMoreMenu,
      moreMenuItems,
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
  opacity: 0.3;
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

/* .actions > .icon:hover {
  background-color: hsla(0, 100%, 100%, 10%);
} */

.actions > .icon {
  height: 48px;
  width: 48px;
  color: hsla(0, 100%, 100%, 59%);
  border-radius: 50%;
}

.actions > .icon.loop {
  padding: 12px;
}
</style>