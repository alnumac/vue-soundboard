import { createWebHistory, createRouter } from "vue-router";
import SoundBoard from "@/pages/SoundBoard.vue";

const routes = [
  {
    path: "/",
    name: "Default",
    component: SoundBoard,
  },
  {
    path: "/:id",
    name: "SoundBoard",
    component: SoundBoard,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;