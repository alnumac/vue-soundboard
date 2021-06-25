<template>
  <Sidebar>
    <div class="sidebar-menu">
      <Menu :model="soundBoardListMenuItems">
      </Menu>
    </div>
  </Sidebar>
</template>

<script>
import { computed, onBeforeUpdate } from 'vue'
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';

import { useRoute } from 'vue-router'
import useSoundBoardList from '@/composables/useSoundBoardList'

export default {
  components: {
    Sidebar,
    Menu
  },
  props: {
  },
  emits: [
  ],
  setup(props, context) {
    const currentRoute = useRoute()
    const { soundBoardList, addSoundBoard } = useSoundBoardList()



    function isCurrentRoute(route) {
      return route === currentRoute.path
    }

    function activeRouteClass(route) {
      return isCurrentRoute(route) ? 'active-route' : ''
    }

    const soundBoardListMenuItems = computed( () => {

      const homeItem = {
        label: 'All soundboards',
        icon: 'pi pi-home',
        to: '/',
        class: activeRouteClass('/'),
        disabled: isCurrentRoute('/')
      }
      const separatorItem = {
        separator: true
      }
      const soundBoardItems = soundBoardList.map(({title, id}) => ({
        label: title,
        to: `/${id}`,
        class: activeRouteClass(`/${id}`),
        disabled: isCurrentRoute(`/${id}`)
      }))
      const addSoundBoardItem = {
        label: 'Create board',
        icon: 'pi pi-plus',
        command: () => addSoundBoard({})
      }

      return [
        homeItem,
        separatorItem,
        ...soundBoardItems,
        separatorItem,
        addSoundBoardItem,
      ]
    })

    return {
      soundBoardListMenuItems
    }
  }
}
</script>

<style scoped>

.sidebar-menu::v-deep(.p-menu) {
  background-color: unset;
  border-style:unset;
  width: 100%;
}

.sidebar-menu::v-deep(.p-menuitem) {
  border-radius: 4px;
  overflow: hidden;
}

.sidebar-menu::v-deep(.active-route) {
  background-color: hsla(0, 100%, 100%, 89%);
  color: black;
  border:unset;
  width: 100%;
}

.sidebar-menu::v-deep(.active-route .p-menuitem-link),
.sidebar-menu::v-deep(.active-route .p-menuitem-icon),
.sidebar-menu::v-deep(.active-route .p-menuitem-text) {
  color: black;
}

.sidebar-menu::v-deep(.active-route .p-menuitem-link) {
  opacity: 1;
}

</style>