import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Home_Template from './views/Home_Template.vue'
import About from './views/About.vue'
import User from './views/User.vue'
import addMix from './views/addMix.vue'
import mix from './views/Mix.vue'

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
      path: '/users/:name',
      name: 'User',
      component: User,
    },
    {
      path: '/addMix',
      name: 'addMix',
      component: addMix
    },
    {
      path: '/users/:name/mixes/:mID',
      name: 'mix',
      component: mix
    },
  ]
})
