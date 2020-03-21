import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from "../views/login/Login"
import Home from '../views/home/Home'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next)=>{
  if(to.path == '/login') return next();
  const tokenStr = window.sessionStorage.getItem("token")
  if(!tokenStr)return next('/login');
  next()
})

export default router
