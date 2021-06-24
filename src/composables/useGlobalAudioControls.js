import { ref, reactive, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { Howler } from 'howler';

export default function useGlobalAudioControls() {
  const globalVolume = ref(Howler.volume() * 100)
  watch(globalVolume, (value) => Howler.volume(value * 0.01))

  const loadedSounds = reactive({})
  function onSoundLoad({ soundId, state }) {
    loadedSounds[soundId] = state
  }

  function stopAll() {
    Howler.stop()
  }

  function destroyAll() {
    Howler.unload()
    for(const property in loadedSounds){
      delete loadedSounds[property]
    }
  }

  onBeforeRouteLeave(destroyAll)
  onBeforeRouteUpdate(destroyAll)

  return {
    loadedSounds,
    onSoundLoad,
    globalVolume,
    stopAll,
    destroyAll
  }
}