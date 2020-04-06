import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import "./assets/css/gloab.css"
// 导入字体图标
import "./assets/fonts/iconfont.css"
// 导入表格
import tableTree from "vue-table-with-tree-grid"

// 导入网络请求axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
// 请求拦截器（添加toke）
axios.interceptors.request.use(config=>{
  // console.log(config);
  
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.component("table-tree", tableTree)

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
