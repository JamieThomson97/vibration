<template>
    <div>
        <div class="mixWrapper" v-if='trackData'>    
            <div>
                {{trackData.title}}
                {{trackData.producer}}
                Likes
                {{likeCount}}
                Plays
                {{trackData.plays}}
            </div>
            <div class="artwork">
                <img :src="trackData.artworkURL" width="150px">
            </div>
            <div>
                <v-btn v-if='!doesLike' @click='likeMix(clickedMixID, true)'>like</v-btn>
                <v-btn v-if='doesLike' @click='likeMix(clickedMixID, false)'>unlike</v-btn>
            </div>
            <div v-if='trackData.likers' class="liker">
                Likes
                <v-list-tile class="user" @click='setClickeduID(x.uID)' router :to="`/users/${x.name}`" v-for='x in trackData.likers' :key='x.uID'> 
                    {{x.name}}
                    <div>
                        <img height='40px' width='60px' :src='x.profileURL'>
                    </div>
                </v-list-tile>
            </div>
            <div class="">
                Producer Stuff
            </div>
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

import mixMixin from '../mixins/mixMixin'

import {
    mapGetters
} from 'vuex'


import firebase from 'firebase'

export default {

    data(){
        return{
            likeCount : 0,
            doesLike : null,
            x : 0,
            inLiked: -1,
        }
    },

    mixins: [
        mixMixin
    ],

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
            this.fetchMixInfo(newValue)
        }
  },

  created: function(){
    const storage = JSON.parse(localStorage.getItem('vuex'))
    if(storage.clickedMixID){
        
        this.fetchMixInfo(storage.clickedMixID)
    }

  },

  methods: {
      likeMix(mID, like) {
          const likersObj = {
                      'name' : this.name,
                      'uID' : this.uID, 
                      'profileURL' : this.profileURL,
                  }
          if(like){
              this.likeCount = this.likeCount + 1
              if(this.trackData.likers.length < 10){
                  
                  (this.trackData.likers).push(likersObj)
                  this.inLiked = this.trackData.likers.length - 1
                  
              }
          }else{
              if(this.inLiked > -1){
                
                  (this.trackData.likers).splice(this.inLiked, 1)
              }
              this.likeCount = this.likeCount - 1
          }
          this.trackData.likers.push()
          this.doesLike = !this.doesLike
          var callFunction = firebase.functions().httpsCallable('likeMix')
          callFunction({
              mID: mID,
              likeruID : this.uID,
              produceruID : this.trackData.uID,
              likerName : this.name, 
              mixName : this.trackData.title,
              liked : like,
              profileURL : this.profileURL,
              producerName : this.trackData.producer,
              artworkURL : this.trackData.artworkURL,
              likes: this.likeCount,
              plays: this.trackData.plays 
          }).catch(error => {
              this.$noty.warning(error)
          })
      },

      methods:{
         setClickeduID(uID){
            
            
            this.$store.dispatch('actionSetClickeduID', uID)
        },
    }
  }

}
</script>

<style>

.mixWrapper{
    display: flex;
    border: 1px solid
}


.user {
    border: 1px solid fuchsia;
    width: 250px;
}


</style>
