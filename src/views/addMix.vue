<template>
    <div class="wrapper">
        <form @submit.prevent="addMix" class="pt-3">
            <div class='fields'>
                <div>Title</div>
                <v-text-field outline type="text" v-model="title" placeholder=""></v-text-field>
                <div>Series</div>
                <v-text-field outline type="text" v-model="series" placeholder=""></v-text-field>
            </div>
            <input type='file' @change='storeFile' placeholder="Choose your next " class="btn">
            <v-btn type=submit class="btn">Submit Mix</v-btn>
        </form>
    </div>
</template>

<script>

//add local function to calculate length of 
//mix when it is submitted then upload it with the file as metadata

//Or calc when it is downloaded from howler

import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import metadataPopulation from '../mixins/metadataPopulation.js'
const database = firebase.firestore()
const storage = firebase.storage()

export default {

  mixins: [
        metadataPopulation,
        
    ],

    data() {
        return{
            
            title : '',
            series : '',

            uploadedFile : null,
        }
    },

    computed: {

        ...mapGetters([
            'uID',
            'name',
            'profileURL',
            // ...
        ]),
      },

    methods: {
        addMix(){ 

                    
          var firstPromises = []
          var mixPromises = []
          // Receives data from request and puts into an object
          var mixData = {
            uID: this.uID,
            title: this.title,
            dateUploaded: new Date(),
            series: this.series,
            producer: this.name,
            likeCount : 0,
          }
          
          const followersProm = this.returnIDs(this.uID, 'followers', false)
          var mID = database.collection("mixes").add(mixData).then(response => {
            return response.id
          }).catch(error => {
            return error
          })
          

          firstPromises.push(followersProm)
          firstPromises.push(mID)
          

          return Promise.all(firstPromises).then(response => {
             var mIDs = response[0]
             var NmID = response[1]
             

            var storageRef = storage.ref('mixes/'+NmID+'.mp3')
            var put = storageRef.put(this.uploadedFile).then(() => {
                console.log('complete')      
                return storageRef.getDownloadURL().then(function(URL) {
                  mixData['streamURL'] = URL
                  return URL
              })
            })
            return put.then((response2) => {
                mixPromises.push(database.collection('mixes').doc(NmID).update({
                  streamURL : response2
                }))
                mixPromises.push(database.collection("users").doc(this.uID).collection('mixes').doc(NmID).set(mixData))
                  for (var follower in mIDs) {
                    console.log(follower)
                    mixPromises.push(database.collection("users").doc(mIDs[follower]).collection('timeline').doc(NmID).set(mixData))
                  }
                  return response
                }).then(() => {
                  return Promise.all(mixPromises)
                }).catch(error => {
                  console.log(error)
                })          
              
            
          })
        },

        storeFile(e){
          if(e.target.files[0].type == 'audio/mpeg'){
            this.uploadedFile = e.target.files[0]
          }else{
            console.log('please upload an mp3')
          }
        }
    }
}

</script>

<style>

    .wrapper{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 1em;
      height: 100%
    }
    
    .stream{
      
      grid-column:2/3;
      grid-row: 2/10;
      border:1px solid #333;
      
      
    }

    .listened{      
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:4/6;
      border:1px solid #333;
    }

    .recommended{
      margin-left: 1rem;
      grid-column:1/2;
      grid-row: 7/9;      
      border:1px solid #333;
    }

    .right{
      
      margin-right: 1rem;
      grid-column:3/4;
      grid-row :4/7;
      
      border:1px solid #333;
    }

    .player{
      
      margin  : 1rem;
      grid-column:1/-1;
      grid-row: 11/13;
      border:1px solid #333;
      
    }
  </style>

