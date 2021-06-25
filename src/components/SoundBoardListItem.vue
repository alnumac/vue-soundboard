<template>
  <div class="container">
    <div class="handle">
      <SvgIcon type="mdi" :size="24" :path="mdiDrag" />
    </div>
    <RouterLink :to="link" class="title">
      {{ title }}
    </RouterLink>
    <div class="more">
      <Button type="button" class="p-button-text p-button-rounded p-button-plain" icon="pi pi-ellipsis-v" @click="toggleMenu" />
      <Menu ref="menu" :model="menuItems" :popup="true" />
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDrag } from '@mdi/js'
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { RouterLink } from 'vue-router'

export default {
  components: {
    SvgIcon,
    Button,
    Menu,
    RouterLink
  },
  props: {
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  emits: [
    'delete'
  ],
  setup(props, context) {
    const menu = ref(null)
    const link = ref(`/${props.id}`)
    function toggleMenu(event) {
      menu.value.toggle(event)
    }
    const menuItems = reactive([
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          context.emit('delete')
        }
      },
    ])
    return {
      link,
      mdiDrag,
      menu,
      toggleMenu,
      menuItems
    }
  },
}
</script>

<style scoped>
.container {
  padding-right: 8px;
  display: grid;
  grid-template-columns: [row-start] auto 1fr auto [row-end];;
  align-items: center;
  cursor: pointer;
  border-style: solid;
  border-width: 2px;
  border-color: hsla(0, 100%, 100%, 0%);
}

.handle {
  cursor: grab;
  padding: 16px;
}

.title {
  color:unset;
  text-decoration: unset;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>