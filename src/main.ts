import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axiosSetup from './plugins/axios';
import { i18n } from './i18n';

import App from './App.vue';
import './assets/main.css';

const app = createApp(App);
axiosSetup();

app.use(createPinia());
app.use(i18n);

app.mount('#app');
