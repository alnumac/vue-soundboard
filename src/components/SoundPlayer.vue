<template>
  <div class="container md-elevation-z2"
    :class="{
      playing: playing,
      loading: loading,
    }"
    @click="togglePlay"
  >
    <div class="icon primary">
      <LoadSpinner v-if="loading"/>
      <SvgIcon v-if="!loading" type="mdi" :size="36" :path="icon" />
    </div>
    <div class="title">{{ title }}</div>
    <div class="actions">
      <div class="icon volume">
        <!-- <SvgIcon type="mdi" :size="24" :path="mdiVolumeHigh" /> -->
        <SoundPlayerVolume v-model="localVolume" />
      </div>
      <div class="icon loop">
        <Button
          type="button"
          icon="pi"
          class="p-button-rounded p-button-text p-button-plain"
          @click.stop="toggleLoop"
        >
          <SvgIcon type="mdi" :size="24" :path="looping ? mdiRepeat : mdiRepeatOff" />
        </Button>
      </div>
      <div class="icon more">
        <Button
          type="button"
          icon="pi pi-ellipsis-v"
          class="p-button-rounded p-button-text p-button-plain"
          @click.stop="toggleMoreMenu"
        />
        <Menu ref="moreMenuElement" :model="moreMenuItems" :popup="true" />
        <Dialog v-model:visible="displayEdit" :modal="true">
          <template #header>
            <h3>Edit sound</h3>
          </template>
          <div class="edit-container">
            <label>Icon</label>
            <IconSelector v-model="tempEditIcon"/>
            <label>Title</label>
            <InputText type="text" v-model="tempEditTitle" required="true"/>
          </div>
          <template #footer>
            <Button label="Save" icon="pi pi-check" class="" @click="saveEdit" />
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
// import SoundPlayerMore from '@/components/SoundPlayerMore'
// import EditableText from '@/components/EditableText.vue'
import InputText from 'primevue/inputtext';
import IconSelector from '@/components/IconSelector'
// import InputSwitch from 'primevue/inputswitch';

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
    },
  },
  components: {
    SvgIcon,
    LoadSpinner,
    SoundPlayerVolume,
    Button,
    Menu,
    Dialog,
    InputText,
    IconSelector
  },
  emits: [
    'update:volume',
    'remove',
    'load'
  ],

  setup(props, context) {
    const title = ref('untitled')
    const extension = ref('mp3')
    const icon = ref(mdiVolumeHigh)

    const localVolume = ref(props.volume)
    const looping = ref(false)

    const howl = ref(null)

    const hover = ref(false)

    const state = reactive({
      howl,
      title,
      extension,
      icon
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
      icon.value = loaded_state.icon
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
        title.value = loaded_entry.title || title.value
        looping.value = loaded_entry.looping || looping.value
        extension.value = loaded_entry.extension || extension.value
        icon.value = loaded_entry.icon || icon.value
      }
    }

    async function saveEntry() {
      const new_entry = {
        title: title.value,
        looping: looping.value,
        extension: extension.value,
        icon: icon.value,
      }
      await db.entries.setItem(props.id, new_entry)
    }

    async function togglePlay() {
      console.log('Toggling play')
      if (loading.value) {
        console.log('is loading')
        return
      }
      if (howl.value === null) {
        console.log('howl is null')
        await loadFileAndCreateHowl(props.id)
      }

      if (howl.value.state() === 'unloaded') {
        console.log('howl is unloaded')
        await howl.value.load()
      }
      
      if (!howl.value.playing()) {
        console.log('starting play')
        console.dir(howl.value)
        await play()
      } else {
        console.log('stopping play')
        await stop()
      }
    }

    async function play() {
      howl.value.off('fade')
      howl.value.volume(localVolume.value)
      if (looping.value) {
        howl.value.play()
        howl.value.fade(0, localVolume.value, 500)
      } else {
        howl.value.play()
      }
    }

    async function stop() {
      howl.value.fade(howl.value.volume(), 0, 300)
      howl.value.once('fade', () => {
        howl.value.stop()
        howl.value.volume(localVolume.value)
      }
      )
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
    const tempEditIcon = ref(icon.value)
    const tempEditTitle = ref(title.value)
    function showEdit() {
      tempEditIcon.value = icon.value
      tempEditTitle.value = title.value
      displayEdit.value = true
    }
    function hideEdit() {
      displayEdit.value = false
    }
    function saveEdit() {
      icon.value = tempEditIcon.value
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
    
    watch([title, icon, looping], debounce(saveEntry, 500))
    watch(looping, (newValue) => {
      if (howl.value !== null)
        howl.value.loop(newValue)
    })
    watch(localVolume, (newValue) => {
      if (howl.value !== null)
        howl.value.volume(newValue)
      context.emit('update:volume', newValue)
    })

    return {
      title,
      icon,
      hover,
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
      tempEditIcon,
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
  position: relative;
  overflow: hidden;
  min-width: 160px;
  height: 160px;
  display: grid;
  grid-template-rows: 40px 56px 48px;
  text-align: center;
  align-items: center;
  padding: 12px 6px 0px 6px;
  border-style: solid;
  border-width: 2px;
  border-color: hsla(0, 100%, 100%, 0%);
}

.container.playing {
  background-color: hsla(270, 96%, 79%, 14%);
  border-color: hsl(270, 96%, 79%);
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
  justify-items: center;
}

.actions > .icon {
  height: 48px;
  width: 48px;
  color: hsla(0, 100%, 100%, 59%);
  border-radius: 50%;
}

h3 {
  margin: 0;
}

.edit-container {
  display: flex;
  flex-direction: column;
  align-items:flex-start;
}

.edit-container>label {
  margin-top: 1.5rem;
}

.edit-container>label:first-child {
  margin-top: 0;
}
</style>