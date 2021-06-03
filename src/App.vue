<template>
  <SoundBoard />
</template>

<script>
// import { ref } from 'vue'
// import TheHeader from '@/components/TheHeader.vue'
import SoundBoard from '@/pages/SoundBoard.vue'

//mdiHeadphones, mdiMusic, mdiMusicNote, mdiWaveform

export default {
  name: 'App',
  components: {
    // TheHeader,
    SoundBoard
  },
  setup() {
    return {
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import 'style.css';

:root {

}

body {
  margin: 0;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  scroll-padding-top: 64px;
  margin: 24px auto;
  max-width: 1040px;
}

section {
  border-radius: 4px;
  padding: 8px 16px 16px 16px;
}

.ambience {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
}

.ambience > div {
  height: 160px;
  grid-column-end: span 4;
}

.sounds {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
}

.sounds > div {
  height: 160px;
  grid-column-end: span 2;
}

.md-elevation-card {
  border-radius: 4px;
  /* padding: 1rem 1rem 0.5rem 1rem; */
  overflow: hidden;
}

h2.category {
  opacity: var(--md-text-high-emphasis);
  font-weight: 100;
  font-size: 34px;
  letter-spacing: 0.25px;
}

hr {
  opacity: var(--md-text-medium-emphasis);
  margin-top: 2rem;
}

button.p-button, div.p-slider .p-slider-range {
  background: var(--md-color-primary);
}

button.p-button:enabled:hover {
  background: var(--md-color-primary);
}

button.p-button:enabled:active {
  background: var(--md-color-primary);
}

button.p-button:enabled:focus {
  background: var(--md-color-primary);
}

div.p-slider .p-slider-handle {
  background: #ffffff;
  border: 2px solid var(--md-color-primary);
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
}

div.p-slider:not(.p-disabled) .p-slider-handle:hover {
  background: var(--md-color-primary);
  border-color: var(--md-color-primary);
}

</style>
