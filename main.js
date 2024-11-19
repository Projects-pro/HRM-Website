import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faFileExcel, faFilePdf, faPrint } from '@fortawesome/free-solid-svg-icons';
import router from './router/index';

const vueApp = createApp(App);
vueApp.component('fa',FontAwesomeIcon)
library.add(fas, faFileExcel, faFilePdf, faPrint);

vueApp.use(router).mount("#app");
