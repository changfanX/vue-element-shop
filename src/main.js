import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import './assets/css/base.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element'

Vue.config.productionTip = false
Vue.prototype.$api = api
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
