import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from "../views/login/Login"
import Home from '../views/home/Home'
import Welcome from '../views/home/child/Welcome'
import Users from '../views/home/child/Users'
import Rights from '../views/home/child/Rights'
import Roles from '../views/home/child/Roles'
import Category from '../views/category/category'

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
    component: Home,
    redirect: '/welcome',
    children:[{
      path:'/welcome',
      component: Welcome
    },
    {
      path:'/users',
      component: Users
    },
    {
      path:'/rights',
      component: Rights
    },
    {
      path:'/roles',
      component: Roles
    },
    {
      path:'/categories',
      component: Category
    },
    ]
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
