<template>
    <div class="playlistsWrapper">
        <div class="playlistNames" style='background-color:red;' v-for='x in customer.createdPlaylists' :key='x'>
            {{x}}
            <i class="material-icons" @click='deletePlaylist(x)'>
                clear
            </i>
            <Stream :pagePart='x' passedUser = 'customer'/>
        </div>
        <div class="newPlaylist">
            <!-- <v-text-field v-model='newPlaylist' outline type="text" placeholder="Quick New Playlist"></v-text-field> -->
            <v-text-field v-model='newPlaylistName' outline type="text" v-on:keyup.enter="newPlaylist(newPlaylistName)"  placeholder="Quick Add"></v-text-field>
        </div>
    </div>
</template>

<script>


import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import metadataPopulation from '../mixins/metadataPopulation.js'
import createPlaylistMixin from '../mixins/createPlaylistMixin.js'
import playlistMixin from '../mixins/playlistMixin.js'
import Stream from '@/components/Stream.vue'

const database = firebase.firestore()
//const storage = firebase.storage()

export default {

  mixins: [
        metadataPopulation,
        createPlaylistMixin,    
        playlistMixin,    
    ],

    data() {
        return{
            newPlaylistName : ''
        }
    },

    components:{
        Stream,
    },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
            customer: 'customer',
        }),
    },

    watch:{

        // customer: function(newValue){
        //     
        // }

    },

    methods: {
    },

    created(){

        database.collection('users').doc(this.uID).get().then(response => {
            const user = response.data() 
            
            if(!(user.playlistNames == this.customer.playlistNames)){
                
                this.customer.playlistNames = user.playlistNames
            }
        })

        var playlistNamesArray = this.customer.playlistNames
        
        // for(var a in playlistNamesArray){
        //     var playlistName = playlistNamesArray[a]
        //     
        //     this.createStream(playlistName)
        // }
        this.fetchPlaylists(playlistNamesArray)
        
    }

}

</script>

<style>

   
</style>

