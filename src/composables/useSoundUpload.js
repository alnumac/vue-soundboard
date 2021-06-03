import { ref } from 'vue'
import sha1 from 'js-sha1'
import db from '@/db'

export default function useSoundUpload(entries) {

  const uploadElement = ref(null)

  function showUploadPrompt() {
    uploadElement.value.click()
  }

  async function addToFileDb(id, file) {
    const value = await db.files.getItem(id)
    if (value === null)
      await db.files.setItem(id, file)
  }

  function splitFileNameAndExtension(fileNameWithExtension) {
    const parts = fileNameWithExtension.split('.')
    const extension = parts.pop()
    const fileName = parts.join('.')
    return {fileName, extension}
  }

  function prettyName(name) {
    return name.replaceAll('_', ' ')
  }

  async function addToSoundDb(id, file) {
    const value = await db.entries.getItem(id)
    if (value === null) {
      const { fileName, extension } = splitFileNameAndExtension(file.name)
      const soundTitle = prettyName(fileName)
      await db.entries.setItem(id, {
        icon: 'default',
        title: soundTitle,
        extension: extension,
        repeat: true,
        volume: 1
      })
    }
  }

  function addToBoardEntries(id) {
    entries.unshift(id)
  }

  async function onFileUpload (event) {
    event.target.files.forEach( async (file) => {
      let buffer = await file.arrayBuffer()
      let file_sha1 = await sha1(buffer)
      await addToFileDb(file_sha1, file)
      await addToSoundDb(file_sha1, file)
      addToBoardEntries(file_sha1)
    })
  }

  return {
    uploadElement,
    showUploadPrompt,
    onFileUpload
  }
}