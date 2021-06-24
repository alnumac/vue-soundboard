import localforage from 'localforage';

const dbName = 'Soundboard App';

const app = localforage.createInstance({
  driver      : localforage.INDEXEDDB,
  name        : dbName,
  storeName   : 'app',
  description : ''
})

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
  app,
  boards,
  entries,
  files
}