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
    <section>
      <draggable :list="entries" itemKey="id" group="audioBoard" :animation="500" class="grid" >
        <template #item="{element}">
          <SoundPlayer
            :id="element.value"
            class="soundplayer"
            v-if="element.type === 'audio'"
            @remove="removeEntry(element)"/>
        </template>
      </draggable>
    </section>
    <section v-for="section in sections" :key="section.id">
      <BoardSeparator class="separator" @remove="removeSection(section)">
        <template #title>
          <EditableText v-model="section.title" />
        </template>
      </BoardSeparator>
      <draggable :list="section.entries" itemKey="id" group="audioBoard" :animation="300" class="grid" >
        <template #item="{element}">
          <SoundPlayer
            :id="element.value"
            class="soundplayer"
            v-if="element.type === 'audio'"
            @remove="removeEntry(element)"/>
        </template>
      </draggable>
    </section>
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
    const { title, entries, sections, addSection, removeSection, addEntry, addAudioEntry, addSeparatorEntry, removeEntry } = useBoard(props.id)
    const { globalVolume, stopAll } = useGlobalAudioControls()
    const { uploadElement, showUploadPrompt, onFileUpload } = useAudioUpload({addToBoard: addAudioEntry})
    const { addMenuElement, toggleAddMenu, addMenuItems } = useAddBoardEntryMenu({onUpload: showUploadPrompt, onSeparator: addSection})

    return {
      title, entries, sections, addSection, removeSection, addEntry, addAudioEntry, addSeparatorEntry, removeEntry,
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume, stopAll,
      addMenuElement, toggleAddMenu, addMenuItems,
    }
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: [row-start] repeat(12, 1fr) [row-end];
}

.soundplayer {
  grid-column-end: span 2;
}

.separator {
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
