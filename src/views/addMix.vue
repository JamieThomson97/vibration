<template>
    <div class="wrapper">
        <form @submit.prevent="addMix" class="pt-3">
            <div class='fields'>
                <div>Title</div>
                <v-text-field outline type="text" v-model="title" placeholder=""></v-text-field>
                <v-btn @click='eventBool = false , showBool = true' class="btn">
                  Show
                </v-btn>
                <v-btn @click='eventBool = true , showBool = false' class="btn">
                  Event
                </v-btn>
                <v-btn @click='eventBool = false , showBool = false' class="btn">
                  None
                </v-btn>
                <div v-if='showBool'>
                  Show
                </div>
                <v-text-field outline type="text" v-if='showBool' v-model="show" placeholder=""></v-text-field>
                <div v-if='eventBool'>
                  Event
                </div>
                <v-text-field v-if='eventBool' outline type="text" v-model="event" placeholder=""></v-text-field>
                <div>Producers</div><v-btn @click='numberProducers++' class="btn">+</v-btn>
                <v-text-field v-for='x in numberProducers' :key='x'  outline type="text" v-model="firstProducers[x-1]" placeholder=""></v-text-field>
                <div>Description</div>
                <v-text-field outline type="text" v-model="description" placeholder=""></v-text-field>
            </div>
            <input type='file' @change='storeFile' placeholder="Audio File" class="btn"> Left Audio File
            <input type='file' @change='storeFile' accept="image/png, image/jpeg" placeholder="Artwork" class="btn"> Left Artwork
            <v-btn type=submit class="btn">Submit Mix</v-btn>
            
        </form>
    </div>
</template>

<script>


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
            
            title : '1',
            show : '',
            event: 'Glastonbury : ',
            showBool : true,
            eventBool: false,
            firstProducers: ['Perfect User'],
            audio : null,
            artwork : null,
            numberProducers : 1,
            description : 'meh',
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

    watch:{
      numberProducers: function(newValue, oldValue){
        console.log(newValue, oldValue)
        if(newValue > oldValue){
          this.firstProducers.push('')
        }else{
          this.firstProducers.pop()
        }
      },
    },

    methods: {

      storeFile(e){
        
          if(e.target.files[0].type == 'audio/mpeg'){
           
            this.audio = e.target.files[0]
          }else if(e.target.files[0].type == 'image/jpeg' | e.target.files[0].type == 'image/png'){
            
            this.artwork = e.target.files[0]
          }else{
          this.$noty.error("please upload an MP3")
          }
      },

      
      
      addMix(){ 

                  
        var firstPromises = []
        var mixPromises = []
        
        //Define part of the object that will be set

        var mixData = {
          
          title: this.title,
          dateUploaded: new Date(),
          show: this.show,
          likeCount : 0,
          playCount : 0,
        }
        var producers = []
        
        //If the mix was set with a show, find out if already exists, 
        //If so, get the id of the doc within the 'shows' collection 

        var isShow = false
        var isEvent = false

        if(this.show.length > 1){
          isShow = true
          //Check to see if show already exists

          var doesShowExist = database.collection('shows').where('name' , '==' , this.show).get().then(response => {
            var responses = response.docs
           
            
            if(responses.length < 1){
              return false
            }else{
              
              return responses[0].id
            }
          })  
          firstPromises[0] = doesShowExist              
        }

        if(this.event.length > 1){
          isEvent = true

          //same for event

          var doesEventExist = database.collection('events').where('name' , '==' , this.event).get().then(response => {
            var responses = response.docs
            if(responses.length < 1){
              console.log('event does not exist')
              return false
              
            }else{
              console.log('event exists')
              return responses[0].id
            }
          })
                
          firstPromises[0] = doesEventExist    
        }

        //mID is a promise, that sets the intial mix data to the mixes collection, and returns the ID,
        // to be used for update the new mix document with the artwork and audio urls               
        
        var mID = database.collection("mixes").add(mixData).then(response => {
          return response.id
        }).catch(error => {
          return error
        })
        
        firstPromises[1] = mID

        var produceruIDPromise = []

        // populates an array with promises to return the uIDs of all of the producers passed contributing to this mix

        this.firstProducers.forEach(producer => {
          
          produceruIDPromise.push(database.collection('users').where('name'  , '==' , producer).get())
          
        })

        Promise.all(produceruIDPromise).then(responses => {
          for(var x in responses){
            
            var name = this.firstProducers[x]
            var uID = responses[x].docs[0].id
            var object = {
              name : name,
              uID : uID
            }
            
            producers.push(object)  
          }
        }).then(() => {

          
          mixData['producers'] = producers
          const uIDsOfFollowers = this.returnIDs(producers, 'followers', false)
          firstPromises[1] = mID
          firstPromises[2] = uIDsOfFollowers
          
          
          
          return Promise.all(firstPromises).then(response => {
            var isXCreated = response[0]
            var NmID = response[1]
            var followeruIDs = response[2]
            
               
            var audioStorageRef = storage.ref('mixesAudio/'+NmID+'.mp3')
            var artworkStorageRef = storage.ref('mixesArtwork/'+NmID+'.jpeg')

            var putAudio = audioStorageRef.put(this.audio).then(() => {
                
                return audioStorageRef.getDownloadURL().then(function(URL) {
                  // mixData['audioURL'] = URL
                  return URL
              })
            })

            var putArtwork = artworkStorageRef.put(this.artwork).then(() => {
                
                return artworkStorageRef.getDownloadURL().then(function(URL) {
                  // mixData['audioURL'] = URL
                  return URL
              })
            })

            var showData = {
              name : this.show,
              producers : producers,
              mixCount : 1,
              playCount : 0,
              dateCreated : new Date()
            }
            var eventData = {
              name : this.event,
              producers : producers,
              mixCount : 1,
              dateCreated : new Date()
            }

            var storagePromises = [ putAudio,  putArtwork ]

           

            return Promise.all(storagePromises).then((storagePromisesResponse) => {
              mixData['audioURL'] = storagePromisesResponse[0]
              mixData['artworkURL'] = storagePromisesResponse[1]
              console.log('in promise')
              if(isShow){
                if(isXCreated){
                  console.log('in created')
                  mixPromises.push(database.collection('shows').doc(isXCreated).collection('mixes').doc(NmID).set(mixData))
                  producers.forEach(producer=> {                    
                    mixPromises.push(database.collection("users").doc(producer.uID).collection('shows').doc(isXCreated).collection('mixes').doc(NmID).set(mixData))
                  })
                }else{
                  mixPromises.push(database.collection('shows').add(showData))
                  
                }
              }
              if(isEvent){
                if(isXCreated){
                  mixPromises.push(database.collection('events').doc(isXCreated).collection('mixes').doc(NmID).set(mixData))
                  producers.forEach(producer=> {                    
                    mixPromises.push(database.collection("users").doc(producer.uID).collection('events').doc(isXCreated).collection('mixes').doc(NmID).set(mixData))
                  })
                }else{
                  
                  mixPromises.push(database.collection('events').add(eventData))
                }
              }

              mixPromises.push(database.collection('mixes').doc(NmID).update({
                audioURL : storagePromisesResponse[0],
                artworkURL : storagePromisesResponse[1],
                producers : producers,
              }))
                
               for (var follower in followeruIDs) {
                  mixPromises.push(database.collection("users").doc(followeruIDs[follower]).collection('timeline').doc(NmID).set(mixData))
                }
                producers.forEach(producer=> {                    
                  mixPromises.push(database.collection("users").doc(producer.uID).collection('mixes').doc(NmID).set(mixData))
                })
                console.log('above indexMix')
                const indexFunction = firebase.functions().httpsCallable('indexMix')
                
                mixPromises.push(indexFunction({ mixData : mixData , NmID : NmID }))
                console.log(mixPromises.length)
                return Promise.all(mixPromises)
                
              }).then((mixPromisesResponses) => {
                console.log(mixPromisesResponses.length)
                if(!isXCreated){
                  const newID = mixPromisesResponses[0].id
                  var finalPromises = []
                  if(isShow){
                    const indexShowFunction = firebase.functions().httpsCallable('indexShow')
                    finalPromises.push(indexShowFunction({ showData : showData , eID : newID }))
                    producers.forEach(producer=> {
                      finalPromises.push(database.collection("users").doc(producer.uID).collection('shows').doc(newID).set(showData))
                      finalPromises.push(database.collection("users").doc(producer.uID).collection('shows').doc(newID).collection('mixes').doc(NmID).set(mixData))
                    })
                    finalPromises.push(database.collection('shows').doc(newID).collection('mixes').doc(NmID).set(mixData))
                    console.log(finalPromises.length)
                    return Promise.all(finalPromises)
                  }
                  if(isEvent){
                    const indexEventFunction = firebase.functions().httpsCallable('indexEvent')
                    finalPromises.push(indexEventFunction({ eventData : eventData , eID : newID }))
                    
                    producers.forEach(producer=> {
                      finalPromises.push(database.collection("users").doc(producer.uID).collection('events').doc(newID).set(eventData))
                      finalPromises.push(database.collection("users").doc(producer.uID).collection('events').doc(newID).collection('mixes').doc(NmID).set(mixData))
                    })
                    finalPromises.push(database.collection('events').doc(newID).collection('mixes').doc(NmID).set(mixData))
                    return Promise.all(finalPromises)
                  }
                }
              }).catch(error => {
                console.log(error)
                this.$noty.error(error)
              })          
          })
        })
      },

        
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

