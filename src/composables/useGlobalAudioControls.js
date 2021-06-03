import { ref, watch } from 'vue'
import { Howler } from 'howler';

export default function useGlobalAudioControls() {
  // const globalVolume = computed({
  //   get: () => Howler.volume() * 100,
  //   set: (value) => Howler.volume(value * 0.01)
  // })
  const globalVolume = ref(Howler.volume() * 100)
  watch(globalVolume, (value) => Howler.volume(value * 0.01))


  function stopAll() {
    Howler.stop()
  }

  return {
    globalVolume,
    stopAll
  }
}