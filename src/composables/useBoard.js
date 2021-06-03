import { ref, reactive, computed, watch, onMounted, toRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import db from '@/db'

const TYPES = {
  AUDIO: 'audio'
}

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

  function removeSection(section) {
    const index = sections.indexOf(section)
    entries.push(...loadEntries(section.entries))
    sections.splice(index, 1)
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

  function prepareEntry({id = uuidv4(), type = TYPES.AUDIO, value}) {
    return {
      id: id,
      type: type,
      value: value
    }
  }

  function addEntry(value, type) {
    entries.unshift(prepareEntry({value, type}))
  }

  function addAudioEntry(value) {
    entries.unshift(prepareEntry({value, type: 'audio'}))
  }

  function addSeparatorEntry(value = 'New section') {
    entries.push(prepareEntry({value, type: 'separator'}))
  }

  function removeEntry(entry) {
    const index = entries.indexOf(entry)
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
    addEntry,
    addAudioEntry,
    addSeparatorEntry,
    removeEntry
  }
}