import 'ant-design-vue/dist/antd.css';
import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import AntDesign from 'ant-design-vue';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(AntDesign);

pinia.use(piniaPluginPersistedState);

app.mount('#app');
