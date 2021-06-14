import { ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { Howler } from 'howler';

export default function useGlobalAudioControls() {
  const globalVolume = ref(Howler.volume() * 100)
  watch(globalVolume, (value) => Howler.volume(value * 0.01))


  function stopAll() {
    Howler.stop()
  }

  function destroyAll() {
    Howler.unload()
  }

  onBeforeRouteLeave(destroyAll)
  onBeforeRouteUpdate(destroyAll)

  return {
    globalVolume,
    stopAll,
    destroyAll
  }
}