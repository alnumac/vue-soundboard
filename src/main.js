import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import SoundBoard from './pages/SoundBoard.vue'

import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes: [{path: '/', component: SoundBoard}], // short for `routes: routes`
})

const app = createApp(App)
app.mount('#app')
app.use(router);
app.use(PrimeVue);