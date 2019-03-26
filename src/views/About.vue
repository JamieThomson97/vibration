<template>
  <v-app>
    <div fluid class="aboutDiv">
      <v-layout fill-height="true" row>
        <v-flex xs12>
          
          <v-card height=95vh flat color="rgb(255, 0, 0, 0.0)">
            <v-card-text> Why Vibby</v-card-text>
            <v-btn  @click="show = !show" success>Login</v-btn>
            <v-btn  @click="signOutUser" success>Log Out</v-btn>
            <v-btn  @click="createStream" success>Create Stream</v-btn>
            <v-btn  @click="getTimeline" success>Get Timeline</v-btn>
            <v-btn  @click="onSnapshotTest" success>Snapshot Test</v-btn>
          </v-card>
         
        </v-flex>
         <div class="testSearch">
            <Search />
          </div>
        <v-slide-x-transition>
          <v-flex xs4>
            <v-card v-if='show' color="rgb(26, 50, 91,0.1)">
              <SignIn />
            </v-card>
          </v-flex>
        </v-slide-x-transition>
      </v-layout>
    </div>
  </v-app>
</template>


<script>

import 'intersection-observer'
//import Register from '../components/Register.vue'
import SignIn from '../components/SignIn.vue'
import Search from '../components/Search.vue'
import * as firebase from 'firebase'

export default {


components: {
    //Register,
    SignIn,
    Search,
   // Scrollama,
  //  Scroll,
  },

  data () {
    return{
      show: false,
      
      userArray : [
        
        {
          uID: "S7LAgSzfr8QIGls6vgwXiXxfxjB2",
          name: "User1"
        },

        {
          uID: "vmzZESZ6sqZGdDn34EwxhUPHS5H3",
          name: "User2"
        },

        {
          uID: "yr5kKT8D7DW8oqVToOYzitrhDWg1",
          name: "User3"
        },

        {
          uID: "dpgTmumbFLaw4shaKBLJfymiZCv1",
          name: "Producer1"
        },

        {
          uID: "m9neT7uGxRVXXLkT7Gyf7lzGwXb2",
          name: "Producer2"
        },

        {
          uID: "wOhegUQfy8PB0wMphhlsQy5gmwv1",
          name: "Producer3"
        },
      ],

    

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


    //Returns all of the data for each mix found in the timeline of mIDs, which can be mounted and displayed

    createStream(){
      const callFunction = firebase.functions().httpsCallable('createStream')
      const mIDs =[]
      this.$store.getters.timeline.forEach(item =>{
        mIDs.push(item.mID)
      })
      callFunction({mIDs : mIDs}).then((response) => {
        const stream = response.data.data
        console.log(stream)
        this.$store.dispatch('actionSetStream', {stream : stream})
      }).catch((error) => {
        console.log(error)
      }) 
    },

    //Returns an array of mIDs and saves them in state / storage, sorted in choronological order

    getTimeline(){
      if(!this.user){
        return console.log("not logged in")
      }
      const callFunction = firebase.functions().httpsCallable('getmID')
      callFunction({uID : this.user.id}).then((response) => {
        const redactedResponse = response.data.data
        this.$store.dispatch('actionSetTimeline', {array : redactedResponse})
        console.log("completed")
      }).catch((error) => {
        console.log(error)
      }) 
    },

    frontEndTimeline(){
      firebase.firestore().doc('users/S7LAgSzfr8QIGls6vgwXiXxfxjB2').get().then((snapshot) => {
        const timeline = snapshot.data().timeline
        for(const item in timeline){
          timeline[item].dateRecorded = timeline[item].dateRecorded.seconds
        }
        this.$store.dispatch('actionSetTimeline', {array : timeline})        
      }).catch(error =>{
        console.log(error)  
      })
      
    },

    onSnapshotTest(){
      firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', 'S7LAgSzfr8QIGls6vgwXiXxfxjB2').onSnapshot(function(res) {
        const changes = res.docChanges()      
        changes.forEach(change => {
          // if(change.type === 'added'){
          console.log(change.doc.data().timeline)
          // }
        })
      })
    }

  },

  created(){

    firebase.firestore().collection('users').where(firebase.firestore.FieldPath.documentId(), '==', 'S7LAgSzfr8QIGls6vgwXiXxfxjB2').onSnapshot(function(res) {
      const changes = res.docChanges()      
      changes.forEach(change => {
        if(change.type === 'added'){
         console.log(change.doc.data().timeline)
        }
      })
    })
  }

}

</script>

<style>

.aboutDiv{
  background-color: #f7b9b9e0;
  height: 30%;
  width: 100vw;
  
}

</style>
