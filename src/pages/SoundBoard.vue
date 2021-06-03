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
    <draggable :list="entries" tag="transition-group" :component-data="{name:'list'}" :itemKey="(entry) => entry.id">
      <template #item="{element}">
        <div :class="['entry', element.type]">
          <SoundPlayer
            v-if="element.type === 'audio'"
            :id="element.value"
            @remove="removeEntry(element)"/>
          <BoardSeparator 
            v-if="element.type === 'separator'" />
        </div>
      </template>
    </draggable>
  </main>
</template>

<script>

import TheHeader from '@/components/TheHeader.vue'
import EditableText from '@/components/EditableText.vue'
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Slider from 'primevue/slider';
import SoundPlayer from '@/components/SoundPlayer.vue'
import BoardSeparator from '@/components/BoardSeparator.vue'
import draggable from 'vuedraggable'

import useBoard from '@/composables/useBoard'
import useGlobalAudioControls from '@/composables/useGlobalAudioControls'
import useAudioUpload from '@/composables/useAudioUpload'
import useAddBoardEntryMenu from '@/composables/useAddBoardEntryMenu'


export default {
  name: 'SoundBoard',
  components: {
    TheHeader,
    EditableText,
    Slider,
    Button,
    Menu,
    draggable,
    SoundPlayer,
    BoardSeparator
  },

  props: {
    id: {
      type: String,
      default: 'default'
    }
  },

  setup(props) {
    const { title, entries, addEntry, removeEntry } = useBoard(props.id)
    const { globalVolume, stopAll } = useGlobalAudioControls()
    const { uploadElement, showUploadPrompt, onFileUpload } = useAudioUpload(entries)
    const { addMenuElement, toggleAddMenu, addMenuItems } = useAddBoardEntryMenu({onUpload: showUploadPrompt})

    return {
      title, entries, addEntry, removeEntry,
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume, stopAll,
      addMenuElement, toggleAddMenu, addMenuItems,
    }
  }
}
</script>

<style scoped>
main {
  display: grid;
  gap: 1rem;
  grid-template-columns: [row-start] repeat(12, 1fr) [row-end];
}

.entry.audio {
  grid-column-end: span 2;
}

.entry.separator {
  grid-column-start: row-start;
  grid-column-end: row-end;
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
