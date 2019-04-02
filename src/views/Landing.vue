<template>
  <v-app>
    <div fluid class="aboutDiv">
      <div class="backgroundImage">
        
      </div>
      <div class="headText">
         <v-card color="rgb(26, 50, 91,0.1)">
              <SignIn />
            </v-card>
        </div>
      <!-- <div class="headingConent">
        A service designed to make listening to the mixes you love easier <br />
        Vibration
      </div> -->
      <!-- <v-layout fill-height="true" row>
        <v-flex xs12>
          
          <v-card height=95vh flat color="rgb(255, 0, 0, 0.0)">
            <v-card-text> Why Vibby</v-card-text>
            <v-btn  @click="show = !show" success>Login</v-btn>
            <v-btn  @click="signOutUser" success>Log Out</v-btn>
            <v-btn  @click="createStream" success>Create Stream</v-btn>
            <v-btn  @click="getTimeline" success>Get Timeline</v-btn>
            <v-btn  @click="deleteFromPlst2()">Delete from playlist</v-btn>
          </v-card>
         
        </v-flex>
         <div class="testSearch">
            <Search />
          </div>
        <v-slide-x-transition>
          <v-flex xs4>
            
          </v-flex>
        </v-slide-x-transition>
      </v-layout> -->
    </div>
  </v-app>
</template>


<script>

import 'intersection-observer'
import SignIn from '../components/SignIn.vue'
// import Search from '../components/Search.vue'



export default {


components: {
    //Register,
    SignIn,
    // Search,
   // Scrollama,
  //  Scroll,
  },

  data () {
    return{
      show: false,
      
     

    

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
       // this.$router.push('/')
      }
    },
  },

  methods:{

   signOutUser(){
          this.$store.dispatch('logUserOut')
        },
  }

}

</script>

<style> 

* {
  box-sizing: border-box;
}

.backgroundImage {
  /* The image used */
  background-image: url("../../testAssets/flume-red-rocks-new-stage.jpg");
  
  /* Add the blur effect */
  filter: blur(7px);
  -webkit-filter: blur(7px);
  
  /* Full height */
  height: 100vh; 
  width: 100%;
  
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* Position text in the middle of the page/image */
.headText {
  /* background-color: rgb(0,0,0); Fallback color */
  background-color: rgb(324,3,46, 0.4); /*Black w/opacity/see-through */
  color: rgb(116, 0, 0);
  font-weight: bold;
  /* border: 2px solid #f1f1f1; */
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 95%;
  height: 18%;
  padding: 20px;
  font-size: 50px; 
}

</style>
