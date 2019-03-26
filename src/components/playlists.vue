<template>
    <div class="playlistsWrapper">
        <div class="playlistNames" v-for='x in customer.playlistNames' :key='x'>
            {{x}}
            <Stream :pagePart='x' passedUser = 'customer'/>
        </div>
    </div>
</template>

<script>


import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import metadataPopulation from '../mixins/metadataPopulation.js'
import createPlaylistMixin from '../mixins/createPlaylistMixin.js'
import Stream from '@/components/Stream.vue'

const database = firebase.firestore()
const storage = firebase.storage()

export default {

  mixins: [
        metadataPopulation,
        createPlaylistMixin,        
    ],

    data() {
        return{
        
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

        customer: function(newValue){
            console.log(newValue.playlistNames)
        }

    },

    methods: {
    },

    created(){

        database.collection('users').doc(this.uID).get().then(response => {
            const user = response.data() 
            console.log(user)
            if(!(user.playlistNames == this.customer.playlistNames)){
                console.log('new and old playlistnames are equal')
                this.customer.playlistNames = user.playlistNames
            }
        })

        var playlistNamesArray = this.customer.playlistNames
        console.log(playlistNamesArray)
        // for(var a in playlistNamesArray){
        //     var playlistName = playlistNamesArray[a]
        //     console.log(playlistName)
        //     this.createStream(playlistName)
        // }
        this.fetchPlaylists(playlistNamesArray)
        
    }

}

</script>

<style>

   
</style>

