<template>
  <v-app>
    <Nav />
    <v-content>
      <router-view></router-view>
      <Player />
    </v-content>
    
  </v-app>
</template>

<script>


import '@/components/firebaseConfig.js'
import Nav from '@/components/Nav.vue'
import Player from '@/components/Player.vue'

import firebase from 'firebase'


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
    
    logOutUser(){
      this.$store.dispatch('logUserOut')
    },

    signInCheck(){       
      if(firebase.auth().currentUser){
        console.log("In")
        this.signedIn = true
      }else{
        this.signedIn = false
        console.log("Out")
      }
    },

    
    
  },

  created: function(){    
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
      //  console.log("User signed in -- from created function")
      //  console.log(user.uid)
      }else{
        
      // console.log("not signed in -- from created function")
      }
    });
  }

     
}
</script>

<style>



</style>
