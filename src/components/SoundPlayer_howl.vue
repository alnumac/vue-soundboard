<template>
  <div class="container" v-if="audio.howl">
    <div class="song">
      <div class="play">
        <button @click="audio.howl.playing() ? audio.howl.pause() : audio.howl.play()">
          <SvgIcon class="icon" type="mdi" :size="42" :path="audio.howl.playing() ? mdiPauseCircle : mdiPlayCircle"></SvgIcon>
        </button>
      </div>
      <div class="info">
        <div class="title"> {{ audio.name }} </div>
        <div class="length"> {{ formatTime(duration) }} </div>
        <div class="repeat">
          <button @click="audio.howl.loop(!audio.howl.loop())">
            <SvgIcon class="icon" type="mdi" :path="audio.howl.loop() ? mdiRepeat : mdiRepeatOff"></SvgIcon>
          </button>
        </div>
      </div>
      <div class="progress" @click="clickProgressBar">
        <div class="bar" :style="{ width: percentage + '%'}"></div>
      </div>
    </div>
    <div class="volume">
      <Slider v-model="volume" orientation="vertical" :min="0" :max="100" :step="1" @change="setVolume" />
      <SvgIcon class="icon" type="mdi" :path="mdiVolumeHigh" :size="16"></SvgIcon>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { Howl } from 'howler';
import SvgIcon from '@jamescoyle/vue-icon'
import Slider from 'primevue/slider';
import { mdiPlayCircle, mdiPauseCircle, mdiRepeat, mdiRepeatOff, mdiVolumeHigh, mdiSignal, mdiSignalOff } from '@mdi/js'

export default {
  props: {
    file:Object
  },
  components: {
    SvgIcon,
    Slider
  },

  setup(props) {
    const last_dot_index = props.file.name.lastIndexOf(".")
    const file_extension = props.file.name.slice(last_dot_index + 1)
    const file_name = props.file.name.slice(0, last_dot_index)

    const audio = reactive({
      name: file_name,
      extension: file_extension,
      howl: null
    })

    function formatTime(secs) {
      var minutes = Math.floor(secs / 60) || 0;
      var seconds = Math.floor(secs - minutes * 60) || 0;
      return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function setVolume() {
      audio.howl.volume(volume.value / 100)
    }

    const volume = ref(100)
    const duration = ref(0)
    const progress = ref(0)
    const percentage = computed(() => duration.value ? progress.value/duration.value * 100 : 0)

    function step() {
      progress.value = audio.howl.seek() || 0;
      if (audio.howl.playing()) {
        requestAnimationFrame(step)
      }
    }

    function clickProgressBar(event) {
      const click_coordinates_x = event.offsetX
      const progress_bar_width = event.currentTarget.clientWidth
      const percentage_clicked = click_coordinates_x / progress_bar_width
      const seek_location = duration.value * percentage_clicked
      audio.howl.seek(seek_location)
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      console.log(event.target)
      audio.howl = new Howl({
        src: [event.target.result],
        onplay: function() {
          requestAnimationFrame(step)
        },
        onload: function(){
          duration.value = audio.howl.duration()
        },
        onseek: function(){
          requestAnimationFrame(step)
        },
      })
      console.log(audio.howl)
    }
    reader.readAsDataURL(props.file);
    
    return {
      volume,
      formatTime,
      setVolume,
      audio,
      duration,
      progress,
      percentage,
      clickProgressBar,
      mdiPlayCircle, mdiPauseCircle, mdiRepeat, mdiRepeatOff, mdiVolumeHigh, mdiSignal, mdiSignalOff,
    }
  }

}
</script>

<style scoped>

.container {
  background: hsl(191deg 35% 41%);
  background: linear-gradient(215deg, hsl(191deg 35% 41%), hsl(257deg 36% 48%));
  margin: 1rem;
  display: grid;
  grid-template-columns: 270px 30px;
  width: 300px;
  color:#ffffff;
}

.song {
  background-color: #ffffff33;
  display: grid;
  grid-template-rows: auto 40px;
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
}

.progress {
  grid-area: progress;
}

.play button {
  background-color: #FFFFFF00;
  border-style: none;
  padding: 0;
}

.repeat button {
  background-color: #FFFFFF00;
  border-style: none;
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
  background-color: #ffffff66;
  border-radius: 3px;
}

.p-slider-vertical >>> .p-slider-range {
  background-color: #ffffff;
  border-radius: 3px;
}

.p-slider.p-slider-vertical >>> .p-slider-handle {
  background-color: #ffffff;
  height: 0.5rem;
  width: 0.5rem;
  margin-left: -0.25rem;
  margin-bottom: -0.25rem;
  border: none;
}

.progress {
  height: 100%;
}

.progress .bar {
  background: hsl(0deg 100% 100% / 50%);
  height: 100%;
}

.icon {
 color: white;
 user-select: none;
 text-align: center;
 display: block;
}

</style>