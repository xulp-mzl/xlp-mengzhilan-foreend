import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/css/public.css'
import '@/css/common.less'
import '@/css/platform.css'

import '@/js/extVue.js'
import '@/permission'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
