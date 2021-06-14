<template>
  <Sidebar>
    <div class="sidebar-menu">
      <Menu :model="menuItems">
      </Menu>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';

export default {
  components: {
    Sidebar,
    Menu
  },
  props: {
    menuItems: Object
  },
  emits: [
    'openSidebar',
    'update:menuItems'
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
/* header {
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
} */

/* .icon {
  width: 48px;
  height: 48px;
  padding: 12px;
} */

.sidebar-menu::v-deep(.p-menu) {
  background-color: unset;
  border:unset;
  width: 100%;
}

/* ::v-deep(.p-menu) {
  background-color: unset;
} */
</style>