<template>
  <v-app>
    <v-container fluid class="aboutDiv">
      <v-layout fill-height="true" row>
        <v-flex xs12>
          
          <v-card height=95vh flat color="rgb(255, 0, 0, 0.0)">
            <v-card-text> Why Vibby</v-card-text>
            <v-btn  @click="show = !show" success>Login</v-btn>
            <v-btn  @click="gCloudTest" success>gCloud</v-btn>
            <v-btn  @click="signInUser" success>Log Out</v-btn>
          </v-card>
        </v-flex>
        <v-slide-x-transition>
          <v-flex xs4>
            <v-card v-if='show' color="rgb(26, 50, 91,0.1)">
              <SignIn />
            </v-card>
          </v-flex>
        </v-slide-x-transition>
      </v-layout>
    </v-container>
  </v-app>
</template>


<script>
import 'intersection-observer'
//import Scrollama from 'vue-scrollama'
//import Scroll from '@/components/Scroll.vue'

import Axios from 'axios'

//import Register from '../components/Register.vue'
import SignIn from '../components/SignIn.vue'
export default {

  beforeRouteEnter (to, from, next) {
    const user = JSON.parse(localStorage.getItem('vuex')).user
    console.log(user)
    /*if(user){
    return next ({path: '/'})
    }else{
    next()
    }*/
    next()

  },

components: {
    //Register,
    SignIn,
   // Scrollama,
  //  Scroll,
  },

  data () {
    return{
      show: false
      }
  },
  
  computed:{
    user(){
      return this.$store.getters.user
    },
    
  },

  watch:{
    user(value){
      if (value !== null && value !== undefined){
        this.$router.push('/')
      }
    }
  },

  methods:{
    gCloudTest(){
      Axios.get('https://us-central1-vibration-401b4.cloudfunctions.net/helloWorld').then((response) => {
        console.log(response.data)
      })
    },

    signInUser(){
            this.$store.dispatch('logUserOut')
        },
    
  },

}

</script>

<style>

.aboutDiv{
  background-color: #f7b9b9e0;
  height: 100vh;
  width: 100vw;
  
}

</style>
