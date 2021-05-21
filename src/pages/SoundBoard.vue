<template>
  <main>
    <BoardEntry v-for="entry in entries" :key="entry" class="" :id="entry" />
    <div class="md-color-surface md-elevation-card add">
      <SoundUpload  @upload="addSound"/>
    </div>
  </main>
</template>

<script>
import { ref, reactive, watch, toRefs, onMounted, toRaw } from 'vue'
import BoardEntry from '@/components/BoardEntry.vue'
import SoundUpload from '@/components/SoundUpload.vue'
import db from '@/db'

export default {
  name: 'SoundBoard',
  components: {
    BoardEntry,
    SoundUpload
  },

  props: {
    id: {
      type: String,
      default: 'default'
    }
  },

  setup(props) {
    const { id } = toRefs(props)

    const title = ref('Default')
    let entries = reactive([])

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

    onMounted(loadBoard)
    watch([title, entries], saveBoard, { deep: true })

    function addSound(soundId) {
      entries.unshift(soundId)
    }

    return {
      title,
      entries,
      addSound
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

.add {
  grid-column-end: span 2;
}
</style>
