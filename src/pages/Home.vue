<template>
  <TheHeader @openSidebar="openSidebar">
    <template #left>
      <h1 class="title">All soundboards</h1>
    </template>
    <template #right>
      <Button type="button" label="Add" icon="pi pi-plus" @click="addSoundBoard({})"/>
    </template>
  </TheHeader>
  <main>
    <section>
      <draggable
        :list="soundBoardList"
        itemKey="id"
        :animation="300"
        class="grid"
        :class="{dragging, 'not-dragging': !dragging}"
        ghostClass="drag-ghost"
        dragClass="drag-element"
        @start="dragging=true"
        @end="dragging=false"
        handle=".handle"
      >
        <template #item="{element}">
          <SoundBoardListItem class="md-elevation-card grid-row-full soundboard-list-item" :title="element.title" :id="element.id" @delete="confirmDelete(element.id)"/>
        </template>
      </draggable>
    </section>
  </main>
</template>

<script>
import { ref, reactive } from 'vue'
import TheHeader from '@/components/TheHeader.vue'

import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useConfirm } from "primevue/useconfirm";
import draggable from 'vuedraggable'
import SoundBoardListItem from '@/components/SoundBoardListItem.vue'

import useSoundBoardList from '@/composables/useSoundBoardList'


export default {
  name: 'SoundBoard',
  components: {
    TheHeader,
    Button,
    Menu,
    draggable,
    SoundBoardListItem
  },

  props: {
  },
  emits: [
    'openSideBar'
  ],

  setup(props, context) {
    const { soundBoardList, addSoundBoard, removeSoundBoard, } = useSoundBoardList()

    const dragging = ref(false)
    
    const confirmService = useConfirm()
    const confirmDelete = (id) => confirmService.require({
      message: 'Do you want to delete this soundboard?',
      header: 'Delete Soundboard',
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: () => {
        removeSoundBoard(id)
      },
      reject: () => {
      }
    })

    function openSidebar() {
      context.emit('openSideBar')
    }

    return {
      dragging,
      confirmDelete,
      soundBoardList, addSoundBoard,
      openSidebar
    }
  }
}
</script>

<style scoped>
.title {
  padding: 0px 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  line-height: 2rem;
  letter-spacing: .4px;
  font-family: Roboto Mono, monospace;
  font-weight: 500;
  letter-spacing: .0125em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  
  cursor: default;
  background-color: unset;
  border: none;
  color: inherit;
  border-radius: 4px;
  min-width: unset;
  max-width: unset;
  width: unset;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: [row-start] repeat(auto-fill, minmax(160px, 1fr)) [row-end];
  justify-content: center;
}

.grid-row-full {
  grid-column-start: row-start;
  grid-column-end: row-end;
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

.not-dragging > .soundboard-list-item:hover {
  background-color: hsl(
    var(--md-color-surface-h),
    var(--md-color-surface-s),
    calc( var(--md-color-surface-l) + 12% )
  );
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>
