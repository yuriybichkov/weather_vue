import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axiosSetup from './plugins/axios';
import { i18n } from './i18n';
import './assets/main.css';

import App from './App.vue';

const app = createApp(App);
axiosSetup();

app.use(i18n);
app.use(createPinia());

app.mount('#app');
