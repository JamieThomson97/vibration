<template>
    <div class="streamWrapper">
        <div class="nothing" v-if="!stream">Something</div>
         <div class="entry" 
         v-for='x in streamLength'
          :key='Object.keys(stream)[x-1]'
          > 
            <div class="itemArtwork"></div>
            <!-- <v-img class='artwork' @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])" :aspect-ratio="1/1" contain height='100%' width='100%' :src="stream[Object.keys(stream)[x-1]].artworkURL"></v-img> -->
            <div class="artist caption grey--text">{{stream[Object.keys(stream)[x-1]].title}}</div>
            <div class="title caption grey--text">{{stream[Object.keys(stream)[x-1]].producer}}</div>
            <div class="date"></div>
            <div class='' small v-if="uID == stream[Object.keys(stream)[x-1]].uID" @click="deleteMix(Object.keys(stream)[x-1])"></div>
            <div class=' addtoListen' @click="addToPlaylist(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1] , ['Listen Later'])"></div>
            <div class='' v-if='!showDeleteFromPlaylist' @click="removeFromPlaylist(Object.keys(stream)[x-1])"></div>
            <!-- <div class='' v-if='stream[Object.keys(stream)[x-1]].event' router :to="`/event/${(stream[Object.keys(stream)[x-1]].event.eID)}`" >{{stream[Object.keys(stream)[x-1]].event.name}}</div> -->
            <div class=' addtoPlaylist' v-if='!clickedAddToPlaylist' @click='togglePlaylist()' icon dark></div>
            <div class=' favourite' icon dark></div>
            <div class=' ' v-if='clickedAddToPlaylist & showPlaylists' @click='newPlaylistMethodSelector(stream[Object.keys(stream)[x-1]] , Object.keys(stream)[x-1] , playlistChoice)' icon dark></div>
            <div class='' v-if='clickedAddToPlaylist & showPlaylists' @click='newPlaylist()' icon dark></div>
            <v-text-field v-if='newPlaylistField' v-model='playlistChoice' outline type="text" placeholder=""></v-text-field>
            <v-select
            v-if='showPlaylists & !newPlaylistField'
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
import 'vuejs-noty/dist/vuejs-noty.css'



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

        togglePlaylist(){
            this.showPlaylists = true
            this.clickedAddToPlaylist = true            
        },

        newPlaylistMethodSelector(mixData, mID, playlist){
            if(this.newPlaylistField){
                
                this.addToPlaylist(mixData , mID , [playlist])
                
            }else if(this.clickedAddToPlaylist & this.showPlaylists){
                
                this.addToPlaylist(mixData , mID , playlist)
            }
            
        },
    

        removeFromPlaylist(mID){
            database.collection('users').doc(this.uID).collection(this.pagePart).doc(mID).delete().then(() => {
                this.$store.commit('deleteFromPlaylist' , {mID : mID , playlist : this.pagePart})
                this.$noty.success('Mix removed from : '+this.pagePart)
            })
        }
    },

}
</script>

<style>

    .streamWrapper{
        display: flex;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, minmax(
            180px, 1fr
        ));
         grid-gap: 1.5rem;  
         
    }

    .entry{
        display: grid;
        height : 200px;
        width: 150px;
        grid-template-areas: 
            "itemArtwork itemArtwork itemArtwork"
            "itemArtwork itemArtwork itemArtwork"
            "itemArtwork itemArtwork itemArtwork"
            "title title addtoListen"
            "artist artist addtoPlaylist"
            "date date favourite";
    }

    .entry:nth-child(3n+1) {
        
        grid-row: auto;
        margin-left: 1em;
        
    }
    
    .favourite{
        grid-area : favourite;
        background-color: aliceblue;
    }
    .itemArtwork{
        grid-area : itemArtwork;
        background-color: blue;
    }

    .artist{
        grid-area : artist;
        background-color: darkolivegreen;
    }
    
    .title{
        grid-area : title;
        background-color: darkgoldenrod;
    }

    .date{
        background-color: red;
        grid-area : date;
    }

    .length{
        grid-column: 2/3;
        grid-row: 4/5;
    }

    .addtoPlaylist{
        grid-area: addtoPlaylist;
        background-color: black;
    }

    .addtoListen{
        grid-area: addtoListen;
        background-color: purple;
    }

    .smallButton{
        width: 50px;
        font-size: 9px;
        color: purple !important;
    }

</style>