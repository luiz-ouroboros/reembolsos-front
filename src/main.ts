import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'; // Importe o router
import './assets/tailwind.css'; // Importe o arquivo CSS do Tailwind

createApp(App)
  .use(router)
  .mount('#app')
