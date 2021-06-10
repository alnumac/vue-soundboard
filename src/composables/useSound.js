import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue'
import { debounce } from 'lodash';

import db from '@/db'

export default function useSound(soundId) {
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