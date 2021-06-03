<template>
  <hr>
  <div v-bind="$attrs" class="container">
    <slot name="title">Test</slot>
    <div class="actions">
      <Button
        icon="pi pi-arrow-up" 
        class="p-button-rounded p-button-text p-button-plain"
        @click="moveUp"/>
      <Button
        icon="pi pi-arrow-down"
        class="p-button-rounded p-button-text p-button-plain"
        @click="moveDown" />
      <Button
        icon="pi pi-times"
        class="p-button-rounded p-button-text p-button-danger"
        @click="remove" />
    </div>
  </div>
  
</template>

<script>
//ref, reactive, toRefs, computed, watch, onMounted, onUpdated, onUnmounted
import { ref } from 'vue'

import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  props: {
  },
  emits: [
    'moveUp',
    'moveDown',
    'delete'
  ],
  setup(props, context) {
    function moveUp() {
      context.emit('moveUp')
    }
    function moveDown() {
      context.emit('moveDown')
    }
    function remove() {
      context.emit('remove')
    }
    return {
      moveUp,
      moveDown,
      remove
    }
  },
}
</script>

<style scoped>
hr {
  opacity: 0;
}
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px;
}
.actions {
  opacity: 0;
  transition: opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)
}
.container:hover > .actions {
  opacity: 1;
}
</style>