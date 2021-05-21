import localforage from 'localforage';

export default function createBoardTable(database) {

  const table = localforage.createInstance({
    name        : database,
    storeName   : 'boards',
    description : ''
  })

  function getAll() {
    const boards = {}
    await table.iterate(
      (value, key) => boards[key, value]
    )
    return boards
  }

  function get(id) {
    const board = await table.getItem(id)
    return board
  }

  function set(id, value) {
    await table.setItem(id, value)
  }

  return {
    getAll,
    get,
    set
  }
}

