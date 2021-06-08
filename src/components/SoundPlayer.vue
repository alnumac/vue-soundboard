<template>
  <div class="container md-color-surface md-elevation-card"
    :class="{
      playing: playing,
      loading: loading
    }"
    @click="togglePlay">
    <div class="icon primary">
      <LoadSpinner v-if="loading"/>
      <SvgIcon v-if="!loading" type="mdi" :size="36" :path="mdiVolumeHigh" />
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="actions">
      <div class="icon volume">
        <!-- <SvgIcon type="mdi" :size="24" :path="mdiVolumeHigh" /> -->
        <SoundPlayerVolume v-model="localVolume" />
      </div>
      <div class="icon loop" @click.stop="toggleLoop">
        <SvgIcon type="mdi" :size="24" :path="looping ? mdiRepeat : mdiRepeatOff" />
      </div>
      <div class="icon more">
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          class="p-button-rounded p-button-text p-button-plain"
          @click.stop="toggleMoreMenu"
        />
        <Menu ref="moreMenuElement" :model="moreMenuItems" :popup="true" />
        <Dialog v-model:visible="displayEdit" :modal="true" :dismissableMask="true">
          <template #header>
            <h3>Edit</h3>
          </template>
          <EditableText v-model="tempEditTitle" />
          <template #footer>
            <Button label="Save" icon="pi pi-check" class="" autofocus @click="saveEdit" />
            <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-plain" @click="hideEdit" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import LoadSpinner from '@/components/LoadSpinner.vue'
import db from '@/db'
import { debounce } from 'lodash';

import { Howl } from 'howler';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical } from '@mdi/js'

import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';

import SoundPlayerVolume from '@/components/SoundPlayerVolume'
import SoundPlayerMore from '@/components/SoundPlayerMore'
import EditableText from '@/components/EditableText.vue'

export default {
  props: {
    id: String,
    volume: {
      type: Number,
      required: true,
      default: () => 1.0
    },
    loadedSounds: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  components: {
    SvgIcon,
    LoadSpinner,
    SoundPlayerVolume,
    SoundPlayerMore,
    Button,
    Menu,
    Dialog,
    EditableText
  },
  emits: [
    'update:volume',
    'remove',
    'load'
  ],

  setup(props, context) {
    const title = ref('untitled')
    const extension = ref('mp3')

    const localVolume = ref(props.volume)
    const looping = ref(false)

    const howl = ref(null)

    const state = reactive({
      howl,
      title,
      extension
    })

    watch(howl, () => context.emit('load', { soundId: props.id, state }))

    const playing = computed( () => {
      return (howl.value === null) ? false : howl.value.playing()
    })

    const loading = computed( () => {
      return (howl.value === null) ? false : (howl.value.state() === 'loading' && !playing.value)
    })

    if (props.id in props.loadedSounds) {
      const loaded_state = reactive(props.loadedSounds[props.id])
      howl.value = loaded_state.howl
      title.value = loaded_state.title
      looping.value = howl.value.loop()
      localVolume.value = howl.value.volume()
    }

    function toggleLoop() {
      looping.value = !looping.value
      if (howl.value) howl.value.loop()
    }

    async function loadEntry() {
      const loaded_entry = await db.entries.getItem(props.id)
      if (loaded_entry !== null) {
        title.value = loaded_entry.title
        looping.value = loaded_entry.looping
        extension.value = loaded_entry.extension || 'mp3'
      }
    }

    async function saveEntry() {
      console.log('saving entry: ' + title.value)
      const new_entry = {
        title: title.value,
        looping: looping.value,
        extension: extension.value
      }
      await db.entries.setItem(props.id, new_entry)
    }

    async function togglePlay() {
      if (loading.value)
        return

      if (howl.value === null)
        await loadFileAndCreateHowl(props.id)
      
      if (!howl.value.playing()) {
        await play()
      } else {
        await stop()
      }
    }

    async function play() {
      howl.value.play()
    }

    async function stop() {
      howl.value.stop()
    }

    async function loadFileAndCreateHowl(soundId) {
      const src = await loadFileAsURL(soundId)
      await createHowl(src)
      revokeFileAsURL(src)
    }

    async function loadFileAsURL(id) {
      const loaded_file = await db.files.getItem(id)
      if (loaded_file !== null) {
        return URL.createObjectURL(loaded_file)
      }
    }

    function revokeFileAsURL(loaded_file) {
      URL.revokeObjectURL(loaded_file)
    }

    function createHowl(src) {
      return new Promise(
        (resolve) => {
          howl.value = new Howl({
            src,
            format: extension.value,
            volume: localVolume.value,
            looping: looping.value,
            onload: () => resolve()
          })
        })
    }

    function remove() {
      if (howl.value)
        howl.value.unload()
      context.emit('remove')
    }

    const moreMenuElement = ref(null)
    function toggleMoreMenu(event) {
      moreMenuElement.value.toggle(event);
    }

    const displayEdit = ref(false)
    //const tempEditIcon = ref(localTitle.value)
    const tempEditTitle = ref(title.value)
    function showEdit() {
      tempEditTitle.value = title.value
      displayEdit.value = true
    }
    function hideEdit() {
      displayEdit.value = false
    }
    function saveEdit() {
      title.value = tempEditTitle.value
      hideEdit()
    }
    

    const moreMenuItems = reactive([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => showEdit()
      },
      {
        label: 'Remove',
        icon: 'pi pi-times',
        command: () => context.emit('remove')
      },
    ])

    onBeforeMount(loadEntry)
    
    watch([title], () => debounce(saveEntry, 300))
    watch(localVolume, (newValue) => {
      if (howl.value !== null)
        howl.value.volume(newValue)
      context.emit('update:volume', newValue)
    })

    return {
      title,
      localVolume,
      looping,
      playing,
      loading,
      togglePlay,
      toggleLoop,
      remove,
      mdiVolumeHigh, mdiRepeat, mdiRepeatOff, mdiDotsVertical,
      moreMenuElement,
      displayEdit,
      tempEditTitle,
      showEdit,
      saveEdit,
      hideEdit,
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