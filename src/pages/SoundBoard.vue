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
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              class="soundplayer"
              @remove="removeEntry(index, entries)"/>
          </template>
        </draggable>
      </section>
    <transition-group name="sections">
      <section v-for="(section, index) in sections" :key="section.id">
        <BoardSeparator
          class="separator"
          :isFirst="index <= 0"
          :isLast="index >= (sections.length - 1)"
          @moveUp="moveSectionUp(index)"
          @moveDown="moveSectionDown(index)"
          @remove="removeSection(index)"
        >
          <template #title>
            <EditableText v-model="section.title" />
          </template>
        </BoardSeparator>
        <draggable :list="section.entries" itemKey="id" group="audioBoard" :animation="300" class="grid" >
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              class="soundplayer"
              @remove="removeEntry(index, section.entries)" />
          </template>
        </draggable>
      </section>
    </transition-group>
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
    const { title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry } = useBoard(props.id)
    const { globalVolume, stopAll } = useGlobalAudioControls()
    const { uploadElement, showUploadPrompt, onFileUpload } = useAudioUpload({addToBoard: addEntry})
    const { addMenuElement, toggleAddMenu, addMenuItems } = useAddBoardEntryMenu({onUpload: showUploadPrompt, onSeparator: addSection})

    return {
      title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry,
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume, stopAll,
      addMenuElement, toggleAddMenu, addMenuItems,
    }
  }
}
</script>

<style scoped>
.sections-enter-active,
.sections-leave-active {
  transition: transform 0.8s ease, opacity 0.8s ease;
}

.sections-enter-from,
.sections-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.sections-move {
  transition: transform 0.8s ease;
}

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
