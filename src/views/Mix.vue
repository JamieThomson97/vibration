<template>
    <div>
        <div v-if='trackData'>
            {{trackData.title}}
            {{trackData.producer}}
            {{likeCount}}
        </div>
        <div>
            <v-btn v-if='!doesLike' @click='likeMix(clickedMixID, true)'>like</v-btn>
            <v-btn v-if='doesLike' @click='likeMix(clickedMixID, false)'>unlike</v-btn>
        </div>
    </div>
    
</template>

<script>

//like count - with users showing
//plays
//like button
//producer part of page
//comment count
//Comments - with users showing

import {
    mapGetters
} from 'vuex'


import firebase from 'firebase'

export default {

    data(){
        return{
            likeCount : 0,
            doesLike : null,
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
        }),
        
        
    },

    watch: {
        clickedMixID: function(newValue) {
            firebase.firestore().collection('users').doc(this.uID).collection('likedMixes').doc(newValue).get().then(doc=> {
                if(doc.exists){
                    this.doesLike = true
                }else{
                     this.doesLike = false
                }
            })
            this.$store.dispatch('getTrackData', newValue)
            firebase.firestore().collection('mixes').doc(newValue).get().then(response => {
                console.log(response.data().likeCount)
                this.likeCount = response.data().likeCount
            })
            
        }
  },

  created: function(){
      
      
  },

  methods: {
      likeMix(mID, like) {
          if(like){
              this.likeCount = this.likeCount + 1
          }else{
              this.likeCount = this.likeCount - 1
          }
          this.doesLike = !this.doesLike
          var callFunction = firebase.functions().httpsCallable('likeMix')
          callFunction({
              mID: mID,
              likeruID : this.uID,
              produceruID : this.trackData.uID,
              likerName : this.name, 
              mixName : this.trackData.title,
              liked : like,
          }).then((response) => {
              console.log(response)
          }).catch(error => {
              console.log(error)
          })
      }
  }

}
</script>

<style>



</style>
