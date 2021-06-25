import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import db from '@/db'

export default function useSoundBoard(boardId) {
  const id = ref(boardId)
  const title = ref('New board')
  const entries = reactive([])
  const sections = reactive([])

  const largestId = ref(0)

  async function loadBoard() {
    const loaded_board = await db.boards.getItem(id.value)
    if (loaded_board !== null) {
      title.value = loaded_board.title
      entries.splice(0, entries.length, ...loadEntries(loaded_board.entries))
      sections.splice(0, sections.length, ...loadSections(loaded_board.sections))
    }
  }

  async function saveBoard() {
    const new_board = {
      title: title.value,
      entries: toRaw(entries),
      sections: toRaw(sections),
    }
    await db.boards.setItem(id.value, new_board)
  }

  async function deleteBoard() {
    await db.boards.removeItem(id.value)
  }

  function loadSections(sections_in_db) {
    const loaded_sections = []
    sections_in_db.forEach(section => {
      loaded_sections.push(prepareSection(section))
    })
    return loaded_sections
  }

  function prepareSection({id = uuidv4(), title = "New section", entries = []}) {
    return {
      id,
      title,
      entries: loadEntries(entries)
    }
  }

  function addSection(params = {}) {
    sections.push(prepareSection(params))
  }

  function removeSection(index) {
    const section = sections.splice(index, 1)
    entries.push(...loadEntries(section.entries))
  }

  function moveSection(from, to) {
    const section = sections.splice(from, 1)[0]
    sections.splice(to, 0, section)
  }

  function moveSectionUp(index) {
    moveSection(index, index - 1)
  }

  function moveSectionDown(index) {
    moveSection(index, index + 1)
  }

  function loadEntries(entries_in_db) {
    const loaded_entries = []
    entries_in_db.forEach(entry => {
      if (typeof entry === "string")
        entry = {value: entry}
      loaded_entries.push(prepareEntry(entry))
    })
    return loaded_entries
  }

  function prepareEntry({id = uuidv4(), value, volume = 1.0}) {
    return {
      id,
      value,
      volume
    }
  }

  function addEntry(value) {
    entries.push(prepareEntry({value}))
  }

  function removeEntry(index, entries) {
    entries.splice(index, 1)
  }

  onMounted(loadBoard)
  onBeforeRouteUpdate((to) => {id.value = to.params.id})
  watch(id, loadBoard)
  watch([title, entries, sections], debounce(saveBoard, 500), { deep: true })

  return {
    title,
    entries,
    sections,
    addSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    addEntry,
    removeEntry,
    deleteBoard
  }
}