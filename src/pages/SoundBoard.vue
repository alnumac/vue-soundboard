<template>
  <TheHeader>
    <template #title>
      <EditableText v-model="title"/>
    </template>
    <template #center>
      <Slider v-model="globalVolume" :min="0" :max="100" :step="1" />
    </template>
    <template #right>
      <Button type="button" label="Add" icon="pi pi-plus" @click="toggleAddMenu" />
      <Menu ref="addMenuElement" :model="addMenuItems" :popup="true" />
      <input class="hidden" ref="uploadElement" type="file" @change="onFileUpload" accept="audio/*">
    </template>
  </TheHeader>
  <main>
    <draggable :list="entries" tag="transition-group" :component-data="{name:'list'}" :itemKey="(element) => element">
      <template #item="{element, index}">
          <BoardEntry class="" :id="element" @remove="removeEntry(index)" />
      </template>
    </draggable>
  </main>
</template>

<script>
import { ref, reactive, watch, toRefs, onMounted, toRaw } from 'vue'
import { debounce } from 'lodash';

import TheHeader from '@/components/TheHeader.vue'
import EditableText from '@/components/EditableText.vue'
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Slider from 'primevue/slider';
import { Howler } from 'howler';

import BoardEntry from '@/components/BoardEntry.vue'
import draggable from 'vuedraggable'
import db from '@/db'

import useSoundUpload from '@/composables/useSoundUpload'

export default {
  name: 'SoundBoard',
  components: {
    TheHeader,
    EditableText,
    Slider,
    Button,
    Menu,
    BoardEntry,
    draggable
  },

  props: {
    id: {
      type: String,
      default: 'default'
    }
  },

  setup(props) {
    const { id } = toRefs(props)
    let entries = reactive([])
    const { uploadElement, showUploadPrompt, onFileUpload } = useSoundUpload(entries)
    const globalVolume = ref(Howler.volume() * 100)
    watch(globalVolume, (newValue, oldValue) => {
      Howler.volume(newValue * 0.01)
    })
    const addMenuElement = ref(null)
    const addMenuItems = reactive([
      {
        label: 'Audio',
        items: [{
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
              showUploadPrompt()
            }
          },
          {
            label: 'From library',
            icon: 'pi pi-book',
            command: () => {
            }
          }
        ]
      },
      {
        label: 'Separator',
        items: [{
            label: 'Create',
            icon: 'pi pi-plus',
            command: () => {
            }
          }
        ]
      },
    ])

    const title = ref('Default')
    

    async function loadBoard() {
      const loaded_board = await db.boards.getItem(id.value)
      if (loaded_board !== null) {
        title.value = loaded_board.title
        entries.push(...loaded_board.entries)
      }
    }

    async function saveBoard() {
      const new_board = {
        title: title.value,
        entries: toRaw(entries)
      }
      await db.boards.setItem(id.value, new_board)
    }
    const debouncedSaveBoard = debounce(saveBoard, 300)

    onMounted(loadBoard)
    watch([title, entries], debouncedSaveBoard, { deep: true })

    function addSound(soundId) {
      entries.unshift(soundId)
    }

    function removeEntry(index) {
      entries.splice(index, 1)
    }

    function toggleAddMenu(event) {
      addMenuElement.value.toggle(event);
    }

    return {
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume,
      addMenuElement,
      addMenuItems,
      toggleAddMenu,
      title,
      entries,
      addSound,
      removeEntry
    }
  }
}
</script>

<style scoped>
main {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
}

.hidden {
  display: none;
}

.p-slider.p-slider-horizontal {
  width: 100px;
  height: 4px;
}

.add {
  grid-column-end: span 2;
}


.list-move {
  transition: transform 0.5s;
}
</style>
