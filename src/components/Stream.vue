<template>
    <div class="streamWrapper">
        <div class='header'>
            {{pagePart}}
            <v-combobox class='streamVComb'
            v-if='showPlaylistInput'
            clearable
            allow-overflow
            v-model="playlistChoice"    
            :items="playlistOptions"
            attach
            label="Choose a playlist"
            multiple
            chips
            small
            selected
            deletable-chips
            loading
            small-chips
            v-on:keyup.enter='newPlaylistMethodSelector(mixChoice , playlistChoice)'
          >
          </v-combobox>
        </div>
        
        <div class="nothing" v-if="!stream">No mixes found</div>
         <div class="entry" 
         v-for='x in streamLength'
          :key='Object.keys(stream)[x-1]'
          > 
            <div class="artworkContainer" >
                <img class='itemArtwork' @click="handleClickTrack(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1])" style="height: 100%; width: 100%; object-fit: contain" :src="stream[Object.keys(stream)[x-1]].artworkURL">
                <i class="material-icons" style='position:absolute; top:0;right:0;' v-if='!showDeleteFromPlaylist' @click="removeFromPlaylist(Object.keys(stream)[x-1])">clear</i>
            </div>
            <div class="streamTitle mixText">{{stream[Object.keys(stream)[x-1]].title}}</div>
            <div class="streamArtist mixText">{{stream[Object.keys(stream)[x-1]].producer}}</div>
            <div v-if='!playlist_toggle[x-1]' class="streamDate mixText">{{streamDates[x-1]}}</div>
            <div class='' small v-if="uID == stream[Object.keys(stream)[x-1]].uID" @click="deleteMix(Object.keys(stream)[x-1])"></div>
            <div class=' addtoListen' @click="addToPlaylist(stream[Object.keys(stream)[x-1]], Object.keys(stream)[x-1] , ['Listen Later'])"><i v-if='pagePart !== "Listen Later" && !playlist_toggle[x-1]' class="material-icons">watch_later</i></div>
            <div class='' v-if='!showDeleteFromPlaylist' @click="removeFromPlaylist(Object.keys(stream)[x-1])"></div>
            <!-- <div class='' v-if='stream[Object.keys(stream)[x-1]].event' router :to="`/event/${(stream[Object.keys(stream)[x-1]].event.eID)}`" >{{stream[Object.keys(stream)[x-1]].event.name}}</div> -->
            <div class=' addtoPlaylist' v-if='!clickedAddToPlaylist' @click='mixChoice[Object.keys(stream)[x-1]] = stream[Object.keys(stream)[x-1]] , togglePlaylist(x)' icon dark><i class="material-icons">playlist_add</i></div>
            <div v-if='!playlist_toggle[x-1]' class=' favourite' icon dark><i class="material-icons">favorite_border</i></div>
            <i  v-if='playlist_toggle[x-1]' @click='newPlaylistMethodSelector(mixChoice , playlistChoice)' class="material-icons addtoListen">
                done
            </i>
            <div class='' v-if='playlist_toggle[x-1]' @click='newPlaylist()' icon dark></div>
            
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
            a: 0,
            playlistChoice : null,
            mixChoice : {},
            clickedAddToPlaylist : false,
            showPlaylists : false,
            newPlaylistField : false,
            newPlaylistName : '',
            options : { year: 'numeric', month: 'numeric', day: 'numeric' },
            playlist_toggle : [false,false,false,false,false],
            showPlaylistInput : false,
            reset : false,
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
            
            if(!this.reset){
                this.showPlaylistInput = !this.showPlaylistInput
                this.reset = true
            }
            Vue.set((this.playlist_toggle) , x-1 , !this.playlist_toggle[x-1])    
            
        },

        newPlaylistMethodSelector(mixChoice, playlist){
            const keys = Object.keys(mixChoice)
            const values = Object.values(mixChoice)
            console.log(values.length)
            if(keys.length > 0){
                console.log('in if')
                keys.forEach(key => {
                    console.log(key)
                    const mixData = mixChoice[key]
                    console.log(mixData)
                    this.addToPlaylist(mixData, key, playlist)
                })
            }
            for(var b in this.playlist_toggle){
                Vue.set((this.playlist_toggle) , b, false)    
            }
            this.playlistChoice = null
            this.reset = false
            
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

    .streamWrapper{
        display: flex;
        flex-wrap: wrap;
        grid-template-columns: repeat(auto-fit, minmax(
            180px, 1fr
        ));
         grid-gap: 2rem;  
         margin-left: 1em;
         
    }

    .mixTextTimeline{
        color : rgb(112, 85, 85)
    }

    .material-icons{
        cursor:pointer;
    }

    .entry{
        display: grid;
        grid-template-rows: 5fr 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        background-color : rgba(255, 255, 255, 0.3);
        max-height : 249px;
        max-width : 118px;
        
    }
    .entry:hover{
        -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);
        background-color : rgba(255, 255, 255, 0.5);
    }
        
    
    .favourite{
        grid-row : 4/4;
    }

    img{
        max-height: 150px;
    }

    .artworkContainer {
        grid-row: 1/1;
        grid-column: 1/5;
        position: relative;
        cursor:pointer;

        
    }

    .streamArtist{
        padding-left: 4px;
        grid-row : 3/3;
        grid-column: 1/4;
        font-weight: bold;
        
    }
    
    .streamTitle{
        padding-left: 4px;
        grid-row : 2/2;
        grid-column: 1/4;
        
    }

    .streamDate{
        padding-left: 4px;
        grid-column: 1/4;
        grid-row : 4/4;
    }

    .addtoPlaylist{
        grid-row: 3/3;
        grid-column: 4/5;
    }

    .addtoListen{
        grid-row: 2/2;
        grid-column: 4/5;
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