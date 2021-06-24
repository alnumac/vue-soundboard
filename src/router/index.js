import { createWebHistory, createRouter } from "vue-router";
import Home from "@/pages/Home.vue";
import SoundBoard from "@/pages/SoundBoard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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