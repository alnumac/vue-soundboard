<template>
  <TheHeader @openSidebar="openSidebar">
    <template #left>
      <EditableText v-model="title" identifier="soundboard-title"/>
      <Button @click="confirmDelete" type="button" class="p-button-text p-button-rounded p-button-danger" icon="pi pi-trash" />
    </template>
    <template #right>
      <Slider v-model="globalVolume" :min="0" :max="100" :step="1" />
      <Button type="button" label="Add" icon="pi pi-plus" @click="toggleAddMenu" />
      <Menu ref="addMenuElement" :model="addMenuItems" :popup="true" />
      <input class="hidden" ref="uploadElement" type="file" @change="onFileUpload" accept="audio/*">
    </template>
  </TheHeader>
  <TheSidebar v-model:visible="sidebarOpened" v-model:menuItems="allBoardsAsItems">
  </TheSidebar>
  <main>
      <section>
        <draggable :list="entries" itemKey="id" group="audioBoard" :animation="300" class="grid" >
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              v-model:volume="element.volume"
              class="soundplayer"
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
        <draggable :list="section.entries" itemKey="id" group="audioBoard" :animation="300" class="grid" >
          <template #item="{element, index}">
            <SoundPlayer
              :id="element.value"
              v-model:volume="element.volume"
              class="soundplayer"
              @remove="removeEntry(index, section.entries)"
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
import { ref, reactive } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import TheSidebar from '@/components/TheSidebar.vue'
import EditableText from '@/components/EditableText.vue'
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Slider from 'primevue/slider';
import { useConfirm } from "primevue/useconfirm";
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
    TheSidebar,
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

  setup(props) {
    const { title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry, allBoardsAsItems, deleteBoard } = useBoard(props.id)
    const { globalVolume, stopAll } = useGlobalAudioControls()
    const { uploadElement, showUploadPrompt, onFileUpload } = useAudioUpload({addToBoard: addEntry})
    const { addMenuElement, toggleAddMenu, addMenuItems } = useAddBoardEntryMenu({onUpload: showUploadPrompt, onSeparator: addSection})
    
    const confirmService = useConfirm()
    const confirmDelete = () => confirmService.require({
      message: 'Do you want to delete this soundboard?',
      header: 'Delete Soundboard',
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: () => {
        deleteBoard()
      },
      reject: () => {
      }
    })

    const loadedSounds = reactive({})
    function onSoundLoad({ soundId, state }) {
      loadedSounds[soundId] = state
    }

    const sidebarOpened = ref(false)
    function openSidebar() {
      sidebarOpened.value = true
    }

    return {
      confirmDelete,
      title, entries, sections, addSection, removeSection, moveSectionUp, moveSectionDown, addEntry, removeEntry, allBoardsAsItems,
      uploadElement, showUploadPrompt, onFileUpload,
      globalVolume, stopAll,
      addMenuElement, toggleAddMenu, addMenuItems,
      loadedSounds, onSoundLoad,
      sidebarOpened, openSidebar
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
  grid-template-columns: [row-start] repeat(auto-fill, 160px) [row-end];
  justify-content: left;
}
 
div.grid:empty {
  text-align:center;
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
</style>
