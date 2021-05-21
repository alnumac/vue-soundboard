import localforage from 'localforage';

const dbName = 'Soundboard App';

const boards = localforage.createInstance({
  driver      : localforage.INDEXEDDB,
  name        : dbName,
  storeName   : 'boards',
  description : ''
})

const entries = localforage.createInstance({
  driver      : localforage.INDEXEDDB,
  name        : dbName,
  storeName   : 'entries',
  description : ''
})

const files = localforage.createInstance({
  driver      : localforage.INDEXEDDB,
  name        : dbName,
  storeName   : 'files',
  description : ''
})

export default {
  boards,
  entries,
  files
}