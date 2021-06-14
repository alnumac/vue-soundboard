<template>
  <Sidebar>
    <div class="sidebar-menu">
      <Menu :model="menuItems">
        <!-- <template #item="{item}">
          <router-link :to="item.to || ''" class="p-menuitem-link" role="menuitem" @click="item.command || function() {}">
            <span class="p-menuitem-icon" :class="item.icon"></span>
            <span class="p-menuitem-text">{{ item.label }}</span>
          </router-link>
        </template> -->
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

.sidebar-menu::v-deep(.p-menu) {
  background-color: unset;
  border:unset;
  width: 100%;
}

</style>