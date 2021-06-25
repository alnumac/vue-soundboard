import { reactive, watch, toRaw, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

import db from '@/db'

const DB_ENTRY_KEY = 'soundBoardList'
const NEW_SOUNDBOARD_TITLE = 'New soundboard'

const soundBoardList = reactive([])

export default function useSoundBoardList() {

  function createListEntry({id, title}) {
    return {id, title}
  }

  function addSoundBoard({id=uuidv4(), title=NEW_SOUNDBOARD_TITLE}) {
    soundBoardList.push(createListEntry({id, title}))
    const soundBoard = {
      title,
      entries: [],
      sections: [],
    }
    db.boards.setItem(id, soundBoard)
  }

  function soundBoardRenamed(id, title) {
    soundBoardList.forEach( (soundBoard) => {
      if (soundBoard.id === id) {
        soundBoard.title = title
      }
    })
  }

  async function removeSoundBoard(id) {
    soundBoardList.splice(getSoundBoardListIndex(id), 1)
    await db.boards.removeItem(id)
  }

  function getSoundBoardListIndex(id) {
    return soundBoardList.findIndex((soundBoard) => soundBoard.id === id)
  }

  async function loadSoundBoardList() {
    let dbSoundBoardList = await db.app.getItem(DB_ENTRY_KEY)
    if (!Array.isArray(dbSoundBoardList)) {
      dbSoundBoardList = await loadFromSoundBoardsTable()
    }
    soundBoardList.splice(0, soundBoardList.length, ...dbSoundBoardList)
  }

  async function loadFromSoundBoardsTable() {
    const dbSoundBoardList = []
    await db.boards.iterate(({title}, id) => {dbSoundBoardList.push(createListEntry({title, id}))})
    return dbSoundBoardList
  }

  async function saveSoundBoardList() {
    await db.app.setItem(DB_ENTRY_KEY, toRaw(soundBoardList))
  }

  onMounted(loadSoundBoardList)
  watch(soundBoardList, debounce(saveSoundBoardList, 500), { deep: true })

  return {
    soundBoardList,
    addSoundBoard,
    removeSoundBoard,
    soundBoardRenamed,
  }
}