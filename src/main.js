import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import $ from 'jquery'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/bootstrap.css'
import './css/bootstrap-theme.css'
// 引入插件
import VueSweetalert2 from './plugins/vue-sweetalert2'
import params from "webgazer/src/params";
Vue.prototype.params = params;
// 使用插件
Vue.use(VueSweetalert2);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
import './plugins/element'
window.jQuery = $;
Vue.prototype.$ = $;
window.$ = $;
import { MessageBox } from 'element-ui'

import localforage from "localforage";
localforage.config({
  name: 'test'
});
Vue.prototype.$localForage = localforage;

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
