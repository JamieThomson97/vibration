<template>
  <v-app>
    <Nav v-if="landing"/>
    
    <router-view class='windows'></router-view>
    <Player />
    
    
  </v-app>
</template>

<script>


import '@/components/firebaseConfig.js'
import Nav from '@/components/Nav.vue'
import Player from '@/components/Player.vue'


export default {
  name: 'App',
  components: {
    Nav, 
    Player,   
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

  computed:{
    uID(){
      return this.$store.getters.uID
    }
  },

  methods:{
    
  },

     
}
</script>

<style>
.element::-webkit-scrollbar { width: 0 !important }


</style>
