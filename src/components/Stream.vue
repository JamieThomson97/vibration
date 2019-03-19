<template>
    <div class="streamWrapper">
        <div class="nothing" v-if="!stream">Something</div>
         <div class="flat tile entry" 
         @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])"
         v-for='x in streamLength'
          :key='Object.keys(stream)[x-1]'
          >
            <v-img class='artwork' :aspect-ratio="1/1" contain height='100%' width='100%' :src="stream[Object.keys(stream)[x-1]].artworkURL"></v-img>
            <div class="artist caption grey--text">{{stream[Object.keys(stream)[x-1]].title}}</div>
            <div class="title caption grey--text">{{stream[Object.keys(stream)[x-1]].producer}}</div>
            <v-btn v-if="pagePart == 'mixes'" @click="deleteMix(Object.keys(stream)[x-1])">Delete</v-btn>
        </div>
    </div>
 </template>

<script>

import { mapGetters } from 'vuex';
import firebase from 'firebase'

// import { Howl } from 'howler';
// import _ from 'lodash';
// import secondsToTime from '@/utils/secondsToTime';

export default {



    data(){
        return {
            i: 0,
        }
    },

    props: [
        "pagePart",
    ],

    created(){
        console.log('stream')
        console.log(this.stream)
        
    },

    computed:{
        ...mapGetters({
            uID : 'uID',
            name : 'name',
            profileURL : 'profileURL',
            playerCurrentTrack : 'playerCurrentTrack',
            
            // ...
        }),
    
        stream(){
            if(this.$store.getters.playlists(this.pagePart)){
                return this.$store.getters.playlists(this.pagePart)
            }else{
                return false
            }
        },

        streamLength(){
            if(this.$store.getters.playlists(this.pagePart)){
                return Object.keys(this.$store.getters.playlists(this.pagePart)).length;
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
                return "null"
            }
        }
    },

    watch:{
        
    },

    methods: {

        deleteMix(ID){
            console.log(ID)
            var deleteMix = firebase.functions().httpsCallable('deleteMix')
            deleteMix({mID : ID , uID : this.uID}).then((response) => {
                console.log(response) 
                //Delete Locally
                this.$store.dispatch('actionDeleteMix', {'pName' : this.pagePart , 'mID' : ID} )
            }).catch((error) => {
                console.log(error)
            })
        },

        handleClickTrack(trackData, trackID) {
            console.log(trackData)
            if (this.playerCurrentTrack && this.playerCurrentTrack.title === trackData.title) {
                this.$store.dispatch('setPlayerCurrentTrack', null);
            } else {
                this.$store.dispatch('setPlayerCurrentTrack', trackData);
                // var passTracks = this.stream    
                // console.log('pass tracks 1')
                // console.log(this.stream)
                // delete passTracks[trackID]
                // console.log('pass tracks 2')
                // console.log(passTracks)
                this.$store.dispatch('setPlayerTracks', this.stream)
            }
        },
        
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
    

</style>