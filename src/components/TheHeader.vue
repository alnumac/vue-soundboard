<template>
  <Toolbar>
    <template #left>
      <Button
        icon="pi pi-bars"
        class="p-button-rounded p-button-text p-button-plain menu-button"
        @click="openSidebar"
      />
      <div class="left-container">
        <slot name="left">App</slot>
      </div>
    </template>
    <template #right>
      <div class="right-container">
        <slot name="right"></slot>
      </div>
    </template>
  </Toolbar>
</template>

<script>
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

export default {
  components: {
    Toolbar,
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
.menu-button {
  margin-right: 8px;
}

.left-container, .right-container {
  display:grid;
  grid-auto-flow: column;
  grid-gap: 8px;
  align-items: center;
}

</style>