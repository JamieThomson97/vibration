import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Home_Template from './views/Home_Template.vue'
import About from './views/About.vue'
import User from './views/User.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
            
    },
    {
      path: '/home',
      name: 'tHome',
      component: Home_Template
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
  ]
})
