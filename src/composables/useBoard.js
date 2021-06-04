import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import db from '@/db'

export default function useBoard(boardId) {
  const id = ref(boardId)
  const title = ref('Default')
  const entries = reactive([])
  const sections = reactive([])

  async function loadBoard() {
    const loaded_board = await db.boards.getItem(id.value)
    if (loaded_board !== null) {
      title.value = loaded_board.title
      entries.push(...loadEntries(loaded_board.entries))
      sections.push(...loadSections(loaded_board.sections))
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
  const debouncedSaveBoard = debounce(saveBoard, 300)

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

  function prepareEntry({id = uuidv4(), value}) {
    return {
      id: id,
      value: value
    }
  }

  function addEntry(value) {
    entries.unshift(prepareEntry({value}))
  }

  function removeEntry(index, entries) {
    entries.splice(index, 1)
  }

  onMounted(loadBoard)
  watch([title, entries, sections], debouncedSaveBoard, { deep: true })

  return {
    title,
    entries,
    sections,
    addSection,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    addEntry,
    removeEntry
  }
}