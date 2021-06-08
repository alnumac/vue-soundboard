import { ref } from 'vue'

const state = {
  board: ref(null),
  sounds: ref([]),
  name: ref('World'),
  clicks: ref(0)
}

const stateActions = {
  'board/load' (boardRef, boardId) {
    boardRef.value = newName
  },
  'board/rename' (boardRef, newName) {
    nameRef.value = newName
  }
}

function useState (prop) {
  const collection = state[prop]
  const actions = Object.keys(stateActions).reduce((acc, key) => {
    if (key.startsWith(`${prop}/`)) {
      const newKey = key.slice(prop.length + 1) // extracts action name
      acc[newKey] = payload => stateActions[key](collection, payload)
    }
    return acc
  }, {})

  return { collection, actions }
}