import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import "./assets/css/gloab.css"
// 导入字体图标
import "./assets/fonts/iconfont.css"

// 导入网络请求axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
