import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Home_Template from './views/Home_Template.vue'

import Landing from './views/Landing.vue'
import User from './views/User.vue'
import addMix from './views/addMix.vue'
import mix from './views/Mix.vue'
import Event from './views/Event.vue'

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
      path: '/landing',
      name: 'landing',
      component: Landing,
            
    },
    
    {
      path: '/users/:passeduID',
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
    {
      path: '/homeTemp',
      name: 'homeTemp',
      component: Home_Template
    },
    {
      path: '/event/:eID',
      name: 'Event',
      component: Event
    },
  ]
})
