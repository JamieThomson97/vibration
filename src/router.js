import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Home_Template from './views/Home_Template.vue'
import About from './views/About.vue'
import User from './views/User.vue'
import addMix from './views/addMix.vue'

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
      component: About,
      alias: '/minge'
            
    },
    {
      path: '/home',
      name: 'tHome',
      component: Home_Template
    },
    {
      path: '/users/:id',
      name: 'User',
      component: User,
      alias: 'users/:name'
    },
    {
      path: '/addMix',
      name: 'addMix',
      component: addMix
    },
  ]
})
