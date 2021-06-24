<template>
  <TheHeader @openSidebar="openSidebar">
    <template #left>
      <EditableText v-model="title" identifier="soundboard-title"/>
    </template>
    <template #right>
      <Slider v-model="globalVolume" :min="0" :max="100" :step="1" />
      <Button type="button" label="Add" icon="pi pi-plus" @click="toggleAddMenu" />
      <Menu ref="addMenuElement" :model="addMenuItems" :popup="true" />
      <input class="hidden" ref="uploadElement" type="file" @change="onFileUpload" accept="audio/*" multiple="true">
    </template>
  </TheHeader>
  <main>
      <section>
        <draggable
          :list="entries"
          itemKey="id"
          group="audioBoard"
          :animation="300"
          class="grid"
          :class="{dragging, 'not-dragging': !dragging}"
          ghostClass="drag-ghost"
          dragClass="drag-element"
          @start="dragging=true"
          @end="dragging=false"
        >
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              v-model:volume="element.volume"
              class="soundplayer md-color-surface md-elevation-transition md-corner-rounded"
              @remove="removeEntry(index, entries)"
              :loadedSounds="loadedSounds"
              @load="onSoundLoad"
            />
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
            <EditableText v-model="section.title" :identifier="section.id" />
          </template>
        </BoardSeparator>
        <draggable
          :list="section.entries"
          itemKey="id"
          group="audioBoard"
          :animation="300"
          class="grid"
          :class="{dragging, 'not-dragging': !dragging}"
          ghostClass="drag-ghost"
          dragClass="drag-element"
          @start="dragging=true"
          @end="dragging=false"
        >
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              v-model:volume="element.volume"
              class="soundplayer md-color-surface md-elevation-transition md-corner-rounded"
              @remove="removeEntry(index, entries)"
              :loadedSounds="loadedSounds"
              @load="onSoundLoad"
            />
          </template>
        </draggable>
      </section>
    </transition-group>
  </main>
</template>

<script>
import { ref, watch } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import EditableText from '@/components/EditableText.vue'
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Slider from 'primevue/slider';
import SoundPlayer from '@/components/SoundPlayer.vue'
import BoardSeparator from '@/components/BoardSeparator.vue'
import draggable from 'vuedraggable'

import useSoundBoardList from '@/composables/useSoundBoardList'
import useSoundBoard from '@/composables/useSoundBoard'
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
      default: '0'
    }
  },
  emits: [
    'openSideBar'
  ],

  setup(props, context) {
    const { soundBoardRenamed } = useSoundBoardList()
    const { title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry, allBoardsAsItems } = useSoundBoard(props.id)
    const { globalVolume, stopAll, loadedSounds, onSoundLoad } = useGlobalAudioControls()
    const { uploadElement, showUploadPrompt, onFileUpload } = useAudioUpload({addToBoard: addEntry})
    const { addMenuElement, toggleAddMenu, addMenuItems } = useAddBoardEntryMenu({onUpload: showUploadPrompt, onSeparator: addSection})

    const dragging = ref(false)

    function openSidebar() {
      context.emit('openSideBar')
    }

    watch(title, (newValue) => {soundBoardRenamed(props.id, newValue)})

    return {
      title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry, allBoardsAsItems,
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume, stopAll, loadedSounds, onSoundLoad,
      addMenuElement, toggleAddMenu, addMenuItems,
      dragging,
      openSidebar
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
  grid-template-columns: [row-start] repeat(auto-fill, minmax(160px, 1fr)) [row-end];
  justify-content: center;
}
 
div.grid:empty {
  text-align:center;
  align-items: center;
  height: 160px;
  border-style: dashed;
  border-radius: 4px;
  border-color: hsla(0, 100%, 100%, 30%);
}

div.grid:empty::before {
  grid-column-start: row-start;
  grid-column-end: row-end;
  color: hsla(0, 100%, 100%, 59%);
  font-size: 1.5rem;

  content: 'Empty';
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

.drag-element {
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  background-color: hsl(
    var(--md-color-surface-h),
    var(--md-color-surface-s),
    calc( var(--md-color-surface-l) + 12% )
  );
}

.drag-ghost {
  opacity: 0.5;
  border-style: dashed;
  border-color: white;
}

.drag-ghost ::v-deep(*) {
  opacity: 0;
}

.not-dragging > .soundplayer:hover {
  background-color: hsl(
    var(--md-color-surface-h),
    var(--md-color-surface-s),
    calc( var(--md-color-surface-l) + 12% )
  );
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.not-dragging > .soundplayer.playing:hover {
  background-color: hsla(270, 96%, 79%, 19%);
}
</style>
