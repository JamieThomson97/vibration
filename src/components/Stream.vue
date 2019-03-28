<template>
    <div class="streamWrapper">
        <div class="nothing" v-if="!stream">Something</div>
         <div class="flat tile entry" 
         v-for='x in streamLength'
          :key='Object.keys(stream)[x-1]'
          >
            <v-img class='artwork' @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])" :aspect-ratio="1/1" contain height='100%' width='100%' :src="stream[Object.keys(stream)[x-1]].artworkURL"></v-img>
            <div class="artist caption grey--text">{{stream[Object.keys(stream)[x-1]].title}}</div>
            <div class="title caption grey--text">{{stream[Object.keys(stream)[x-1]].producer}}</div>
            <v-btn class='smallButton' small v-if="uID == stream[Object.keys(stream)[x-1]].uID" @click="deleteMix(Object.keys(stream)[x-1])">Delete</v-btn>
            <v-btn class='smallButton' @click="addToPlaylist(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1] , ['Listen Later'])">Listen Later</v-btn>
            <v-btn class='smallButton' v-if='pagePart !== "mixes"' @click="removeFromPlaylist(Object.keys(stream)[x-1])">Remove from playlist</v-btn>
            <v-btn class='smallButton' v-if='!clickedAddToPlaylist' @click='togglePlaylist()' icon dark>Add to Playlist</v-btn>
            <v-btn class='smallButton' v-if='clickedAddToPlaylist & showPlaylists' @click='addToPlaylist(stream[Object.keys(stream)[x-1]] , Object.keys(stream)[x-1] , playlistChoice)' icon dark>Submit</v-btn>
            <v-btn class='smallButton' v-if='clickedAddToPlaylist & showPlaylists' @click='createPlaylist("HELLO")' icon dark>Create Playlist</v-btn>
            <v-select
            v-if='showPlaylists'
            v-model="playlistChoice"
            :items="playlistOptions"
            attach
            chips
            label="Choose a playlist"
            multiple
          ></v-select>
        </div>
    </div>
 </template>

<script>

import { mapGetters } from 'vuex';
import firebase from 'firebase'
import mixMixin from '../mixins/mixMixin'
import playlistMixin from '../mixins/playlistMixin'
const database = firebase.firestore()
// import { Howl } from 'howler';
// import _ from 'lodash';
// import secondsToTime from '@/utils/secondsToTime';

export default {



    data(){
        return {
            i: 0,
            x: 0,
            playlistOptions : ['Listen Later' , 'FIFA Songs'],
            playlistChoice : null,
            clickedAddToPlaylist : false,
            showPlaylists : false,
        }
    },

    mixins: [
        playlistMixin,
        mixMixin
    ],

    props: [
        "pagePart",
        "passedUser"
    ],

    created(){
        console.log('this.pagePart')
        console.log(this.passedUser)
    },

    computed:{
        ...mapGetters({
            uID : 'uID',
            name : 'name',
            profileURL : 'profileURL',
            playerCurrentTrack : 'playerCurrentTrack',
            customer : 'customer'
            // ...
        }),
    
        stream(){

            if(this.passedUser === 'clickedUser'){                
                return this.$store.getters[this.passedUser].playlists[this.pagePart]
            }else{
                if(this.$store.getters.playlists(this.pagePart , this.passedUser)){
                    return this.customer.playlists[this.pagePart]
                }else{
                    return false
                }
            }
        },

        streamLength(){
            if(this.$store.getters.playlists(this.pagePart , this.passedUser)){
                return Object.keys(this.$store.getters.playlists(this.pagePart , this.passedUser)).length;
            }else{
                return 0
            }          
        },

        message(){
            if(this.pagePart == "timeline"){
                return "Follow some artists to populate your stream"
             }else if(this.pagePart == "history"){
                return "This area will populate after you have listened to some mixes"
            }else if(this.pagePart == "listenLater"){
                return "Add some mixes to 'Listen Later', and they will appear here for easy access"
            }else{
                return null
            }
        }
    },

    watch:{

        stream: function(newValue){
            console.log('watch')
            console.log(newValue)
        }
        
    },

    methods: {

        deleteMix(ID){
            console.log(ID)
            var deleteMix = firebase.functions().httpsCallable('deleteMix' , {mID : ID , uID : this.uID})
            var deleteFromPlaylists = firebase.functions().httpsCallable('deleteFromPlaylists' , {mID : ID})
            var promises = [deleteMix , deleteFromPlaylists]
            Promise.all(promises).then((response) => {
                console.log(response) 
                //Delete Locally
                this.$store.dispatch('actionDeleteMix', {'pName' : this.pagePart , 'mID' : ID} )
            }).catch((error) => {
                console.log(error)
            })
        },

        togglePlaylist(){
            this.showPlaylists = true
            this.clickedAddToPlaylist = true
        },
    

        removeFromPlaylist(mID){

            //Remove from playlist in DB

            console.log(mID)

            database.collection('users').doc(this.uID).collection(this.pagePart).doc(mID).delete().then((response) => {
                console.log(response)

                //Remove from playlist in state

                this.$store.commit('deleteFromPlaylist' , {mID : mID , playlist : this.pagePart})

            })
            

        }
    },

}
</script>

<style>

    .streamWrapper{
        display: grid;
        height: 10px;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fit, minmax(
            180px, 1fr
        ));
         grid-gap:0.5rem;    
    }

    .entry{
        display: grid;
    }

    .entry:nth-child(3n+1) {
        
        grid-row: auto;
        
    }
    .entry:nth-child(3n+2) {
        
        grid-row: auto;

    }
    .entry:nth-child(3n+3) {
     
        grid-row: auto;     
    }    

    .tile{
        background-color: black;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        max-height: 80px;
    }

    .artwork{
        grid-column: 1/2;
        grid-row: 1/5
    }

    .artist{
        grid-column: 2/3;
        grid-row: 2/3
    }
    
    .title{
        grid-column: 2/3;
        grid-row: 1/2
    }

    .date{
        grid-column: 2/3;
        grid-row: 3/4
    }

    .length{
        grid-column: 2/3;
        grid-row: 4/5;
    }

    .smallButton{
        width: 50px;
        font-size: 9px;
        color: purple !important;
    }

</style>