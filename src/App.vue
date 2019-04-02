<template>
  <v-app>
    <Nav v-if="uID"/>
    <Search v-if="uID"/>
    <router-view class='windows'></router-view>
    <Player />
    
    
  </v-app>
</template>

<script>


import '@/components/firebaseConfig.js'
import Nav from '@/components/Nav.vue'
import Player from '@/components/Player.vue'
import Search from '@/components/Search.vue'

import {
    mapGetters
} from 'vuex'



export default {
  name: 'App',
  components: {
    Nav, 
    Player,
    Search,   
  },
  
  data () {
    return {
      
      drawer: true,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ],
      mini: false,
      right: null
            
    }
  },

   computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser: 'clickedUser',
            clickedMixID : 'clickedMixID',
            trackData : 'trackData',
            event : 'event' ,
        }),
   },

  methods:{
    
  },

     
}
</script>

<style>

.body{
   font-family: 'Play', sans-serif;
}

.element::-webkit-scrollbar { width: 0 !important } 


</style>
