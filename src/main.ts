import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axiosSetup from './plugins/axios';

import App from './App.vue';
// import router from './router'

const app = createApp(App);
axiosSetup();

app.use(createPinia());
// app.use(router)

app.mount('#app');
