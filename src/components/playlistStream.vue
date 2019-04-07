<template>
    <div class="playlistStreamWrapper">
        <div class="nothing" v-if="!stream">Something</div>
        <div class="playlistEntry" 
         v-for='x in streamLength'
          :key='Object.keys(stream)[x-1]'
          > 
            <div class="streamArtworkContainer" >
                
                <v-avatar
                size="60px"
                >
                    <img
                    @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])"
                    :src="stream[Object.keys(stream)[x-1]].artworkURL"
                    alt="Avatar"
                    class='streamPlayliistItemArtwork'
                    >
                </v-avatar>
                
                <!-- <img class='playliistItemArtwork' @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])" style="height: 100%; width: 100%; object-fit: contain" :src="stream[Object.keys(stream)[x-1]].artworkURL"> -->
                
            </div>
            
            <!-- <div class=' playlistaddtoListen' @click="addToPlaylist(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1] , ['Listen Later'])"><i v-if='pagePart !== "Listen Later" && !playlist_toggle[x-1]' class="material-icons">watch_later</i></div> -->
            <div class="playlistMixInfo">
                
                <div class="PlaylistStreamArtist mixText">{{stream[Object.keys(stream)[x-1]].title}}</div>
                <div class="PlaylistStreamTitle mixText">{{stream[Object.keys(stream)[x-1]].producer}}</div>
                <div v-if='!playlist_toggle[x-1]' class="streamDate">{{streamDates[x-1]}}</div>
                <div class='' small v-if="uID == stream[Object.keys(stream)[x-1]].uID" @click="deleteMix(Object.keys(stream)[x-1])"></div>
                
                <div class='' v-if='!showDeleteFromPlaylist' @click="removeFromPlaylist(Object.keys(stream)[x-1])"></div>
            </div>
            <div class="clear">
                <i class="material-icons" style='float: right' @click="removeFromPlaylist(Object.keys(stream)[x-1])">clear</i>
            </div>
        </div>
            
    </div>
 </template>

<script>

import { mapGetters } from 'vuex';
import firebase from 'firebase'
import mixMixin from '../mixins/mixMixin'
import playlistMixin from '../mixins/playlistMixin'
const database = firebase.firestore()
import 'vuejs-noty/dist/vuejs-noty.css'
import * as _ from 'underscore'
import Vue from 'vue'



export default {



    data(){
        return {
            i: 0,
            x: 0,
            playlistChoice : null,
            clickedAddToPlaylist : false,
            showPlaylists : false,
            newPlaylistField : false,
            newPlaylistName : '',
            options : { year: 'numeric', month: 'numeric', day: 'numeric' },
            playlist_toggle : [false,false,false,false,false],
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
        
    
    },

    computed:{
        ...mapGetters({
            uID : 'uID',
            name : 'name',
            profileURL : 'profileURL',
            playerCurrentTrack : 'playerCurrentTrack',
            customer : 'customer',
            // ...
        }),

        showDeleteFromPlaylist(){
            if (this.pagePart == 'mixes' | this.pagePart == 'timeline'){
                return true
            }else{
                return false
            }
        },        
    
        stream(){

            if(this.passedUser === 'selectedUser'){                
                return this.$store.getters[this.passedUser].playlists[this.pagePart]
            }else{
                if(this.$store.getters.playlists(this.pagePart , this.passedUser)){
                    return this.customer.playlists[this.pagePart]
                }else{
                    return false
                }
            }
        },

        playlistOptions(){
            return this.customer.createdPlaylists.concat(['Listen Later'])
        },

        streamLength(){
            if(this.$store.getters.playlists(this.pagePart , this.passedUser)){
                return Object.keys(this.$store.getters.playlists(this.pagePart , this.passedUser)).length;
            }else{
                return 0
            }          
        },

        streamDates(){

            var streamDates = []
            for(var a in this.stream){
                var seconds = this.stream[a].dateUploaded.seconds
                var date = new Date(seconds * 1000).toLocaleDateString('en-UK', this.options)
                streamDates.push(date)
            }
            return streamDates

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
        
    },

    methods: {

        deleteMix(ID){
            
            var deleteMix = firebase.functions().httpsCallable('deleteMix' , {mID : ID , uID : this.uID})
            var deleteFromPlaylists = firebase.functions().httpsCallable('deleteFromPlaylists' , {mID : ID})
            var promises = [deleteMix , deleteFromPlaylists]
            Promise.all(promises).then(() => {
                //Delete Locally
                this.$store.dispatch('actionDeleteMix', {'pName' : this.pagePart , 'mID' : ID} )
            }).catch((error) => {
                this.$noty.warning(error)
            })
        },

        newPlaylist(){
            this.newPlaylistField = !this.newPlaylistField
            this.playlistChoice = null
        },

        togglePlaylist(x){
            
            Vue.set((this.playlist_toggle) , x-1 , !this.playlist_toggle[x-1])    
            
        },

        newPlaylistMethodSelector(mixData, mID, playlist){
            this.addToPlaylist(mixData , mID , playlist)
            this.playlistChoice = null
        },
    

        removeFromPlaylist(mID){
            database.collection('users').doc(this.uID).collection(this.pagePart).doc(mID).delete().then(() => {
                this.$store.commit('deleteFromPlaylist' , {mID : mID , playlist : this.pagePart})
                this.$noty.success('Mix removed from : '+this.pagePart)
            })
        },

        sortbyDate(object){
            if(this.pagePart !== 'timeline'){
                return _.sortBy(object, 'dateAdded');
            }else{
                return _.sortBy(object, 'dateUploaded');
            }
        }
    },

}
</script>

<style>

    .playlistStreamWrapper{
        display: flex;       
        grid-gap: .5rem;  
        margin-left: 1em;
        background-color : rgba(255, 255, 255, 0.3);
         
    }

    .streamArtworkContainer{

        padding-top: 5px;
        padding-left: 3px;
        grid-row: 1/6;
        grid-column: 1/1;
        position: relative;

    }

    .playliistItemArtwork{

    }

    .playlistMixInfo{
        margin-left: 15px;
        padding-inline-start: 4px;
    }

    .playlistEntry{
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        background-color : rgba(255, 255, 255, 0.3);
        width:300px;
        height: 70px;
    }

    .playlistAvatar{
        background-color : rgba(255, 255, 255, 0.3);
    }
        
    
    .favourite{
    }

    .playlistItemArtwork{
        max-height: 60px;
    }
    
    .playlistStreamTitle{
        grid-column: 2/2;
        grid-row: 1/1   
    }

    .playlistStreamArtist{
        padding-left: 4px;
        grid-column: 2/2;
        grid-row: 2/2
        
        
    }    
    

    .playlistStreamDate{
        padding-left: 4px;
        grid-column: 3/3;
        grid-row: 3/3; 
        
    }

    .addtoPlaylist{
               
    }

    .addtoListen{
               
    }

    .smallButton{
        width: 50px;
        font-size: 9px;
        color: purple !important;
    }

    .streamVComb{
        padding-left: 4px;
        grid-column: 1/5;
        grid-row : 4/4;
    }

</style>