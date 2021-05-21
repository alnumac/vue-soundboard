<template>
  <div class="container">
    <div class="song">
      <div class="play">
        <button :disabled="!ready" @click="audio.playPause()">
          <SvgIcon v-if="ready" class="icon" type="mdi" :size="42" :path="audio.isPlaying() ? mdiPauseCircle : mdiPlayCircle"></SvgIcon>
          <ProgressSpinner v-if="!ready" style="width:42px;height:42px"/>
        </button>
      </div>
      <div class="info">
        <div class="title" :title="title"> {{ title }} </div>
        <div class="length"> {{ formatTime(duration) }} </div>
        <div class="repeat">
          <button @click="toggleRepeat">
            <SvgIcon class="icon" type="mdi" :path="repeat ? mdiRepeat : mdiRepeatOff"></SvgIcon>
          </button>
        </div>
      </div>
      <div ref="progressElement" class="progress">
      </div>
    </div>
    <div class="volume">
      <Slider v-model="volume" orientation="vertical" :min="0" :max="100" :step="1" @change="setVolume" :disabled="!ready" />
      <SvgIcon class="icon" type="mdi" :path="mdiVolumeHigh" :size="16"></SvgIcon>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import SvgIcon from '@jamescoyle/vue-icon'
import Slider from 'primevue/slider'
import ProgressSpinner from 'primevue/progressspinner';
import { mdiPlayCircle, mdiPauseCircle, mdiRepeat, mdiRepeatOff, mdiVolumeHigh, mdiSignal, mdiSignalOff } from '@mdi/js'

export default {
  props: {
    file:Object
  },
  components: {
    SvgIcon,
    Slider,
    ProgressSpinner
  },

  setup(props) {
    const last_dot_index = props.file.name.lastIndexOf(".")
    const extension = ref(props.file.name.slice(last_dot_index + 1))
    const title = ref(props.file.name.slice(0, last_dot_index))
    const audio = ref(null)
    const ready = ref(false)
    const progressElement = ref(null)

    onMounted(() => {
      audio.value = WaveSurfer.create({
        container: progressElement.value,
        barWidth: 2,
        barHeight: 2,
        barMinHeight: 0.5,
        height: 60,
        cursorColor: "#FFFFFF",
        progressColor: "#FFFFFFCC",
        waveColor: "#ffffff66",
        responsive: true,
        hideScrollbar: true,

      })
      audio.value.on('ready', () => ready.value = true)
      audio.value.on('ready', () => duration.value = audio.value.getDuration())
      audio.value.on('finish', () => repeat.value ? audio.value.play() : audio.value.stop())
      audio.value.loadBlob(props.file)
    })

    function formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = Math.floor(secs - minutes * 60) || 0;
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function setVolume() {
      audio.value.setVolume(volume.value / 100)
    }

    const volume = ref(100)
    const duration = ref(0)
    const progress = ref(0)
    const percentage = computed(() => duration.value ? progress.value/duration.value * 100 : 0)

    const repeat = ref(false)
    function toggleRepeat() {
      repeat.value = !repeat.value
    }
    
    return {
      progressElement,
      ready,
      title,
      extension,
      volume,
      formatTime,
      setVolume,
      repeat,
      toggleRepeat,
      audio,
      duration,
      progress,
      percentage,
      mdiPlayCircle, mdiPauseCircle, mdiRepeat, mdiRepeatOff, mdiVolumeHigh, mdiSignal, mdiSignalOff,
    }
  }

}
</script>

<style scoped>

.container {
  --color-background: hsla(0, 100%, 100%, 0.15);
  --color-inactive: hsla(0, 100%, 100%, 0.5);
  --color-active: hsla(0, 100%, 100%, 0.9);
  --color-hover: hsla(0, 100%, 100%, 0.95);
}

.container {
  /* background: hsl(191, 35%, 41%);
  background: linear-gradient(215deg, hsl(191, 35%, 41%), hsl(257, 36%, 48%)); */
  /* margin: 1rem; */
  display: grid;
  grid-template-columns: 1fr 30px;
  /* width: 300px; */
  height: 100%;
  color: var(--color-active);
  /* box-shadow: 0px 3px 15px hsla(0, 0%, 0%, 0.2); */
}

.song {
  background-color: var(--color-background);
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "play info"
    "progress progress"
  ;
}

.play {
  grid-area: play;
  padding: 0.5rem;
}

.info {
  grid-area: info;
  padding-top: 0.5rem;
  overflow: hidden;
  user-select: none;
}

.title {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.length {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
}

.progress {
  grid-area: progress;
}

.play button {
  background-color: #FFFFFF00;
  border-style: none;
  padding: 0;
  border-radius: 50%;
}

.repeat button {
  background-color: #FFFFFF00;
  border-style: none;
  padding: 0;
}

.play button,
.repeat button {
  color: var(--color-active);
  transition: 0.1s;
}

.play button:hover,
.repeat button:hover {
  color: var(--color-hover);
}

.play button:hover .icon,
.repeat button:hover .icon{
  filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .15));
}

.volume {
  display: grid;
  row-gap: 0.4rem;
  padding-top: 0.75rem;
  padding-bottom: 0.5rem;
}

.volume .icon {
  margin: 0 auto;
}

.p-slider-vertical {
  margin: 0 auto;
  background-color: var(--color-inactive);
  border-radius: 3px;
}

.p-slider-vertical ::v-deep(.p-slider-range) {
  background-color: var(--color-active);
  border-radius: 3px;
}

.p-slider.p-slider-vertical ::v-deep(.p-slider-handle) {
  background-color: var(--color-active);
  height: 0.5rem;
  width: 0.5rem;
  margin-left: -0.25rem;
  margin-bottom: -0.25rem;
  border: none;
}

.progress {
  height: 100%;
}

.icon {
 user-select: none;
 text-align: center;
 display: block;
 filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .1));
}

</style>