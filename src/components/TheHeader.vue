<template>
  <header class="md-elevation-app-bar md-color-surface">
    <div class="left">
      <Button
        icon="pi pi-bars"
        class="p-button-rounded p-button-text p-button-plain"
        @click="openSidebar"
      />
      <slot name="title">App</slot>
    </div>
    <div class="center">
      <slot name="center">
      </slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
// import { ref, watch } from 'vue'
import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  emits: [
    'openSidebar'
  ],
  setup(props, context) {
    function openSidebar() {
      context.emit('openSidebar')
    }
    return {
      openSidebar
    }
  }
}
</script>

<style scoped>
header {
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  height: 64px;
  width:100%;
}
header>div {
  display: flex;
  align-items: center;
}

.icon {
  width: 48px;
  height: 48px;
  padding: 12px;
}

.center {
  display: flex;
  justify-content:center;
}
.center {
  display: flex;
  justify-content:center;
}
</style>