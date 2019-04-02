<template>
    <div class="playlistsWrapper">
        <div>
            <tr>
                <td>
                    <div class='header playlistHeader'>
                        {{headerText}}
                    </div>
                </td>
                <td>
                    <div class='newPlaylist'>
                        <v-text-field v-model='newPlaylistName'   v-if='!reset' box clearable type="text" v-on:keyup.enter="newPlaylist(newPlaylistName) ,newPlaylistName=''"  placeholder="Quick Add"></v-text-field>
                    </div>
                </td>
            </tr>
        </div>
        <div v-if='reset' class='showingPlaylist' >
                
                <i @click='playlistClicked(iteration)' class="material-icons">
                    arrow_back_ios
                </i>
        </div>
        <div class="streamLoopWrapper" v-if='!reset'>
            <div class="playlistNames" v-for='x in customer.createdPlaylists.length' :key='x'>
                <div >
                    <v-avatar
                    size="140px"
                    style='cursor:pointer;'
                    >
                        <img
                        class = 'playlistImages'
                        @click='playlistClicked(x-1)'
                        :src="profileURL"
                        alt="Avatar"
                        >
                    <i class="material-icons" style='position:absolute; top:0;right:0;' @click='deletePlaylist(customer.createdPlaylists[x-1])'>
                        clear
                    </i>
                    </v-avatar>
                    <div class="playlistTitle">
                        {{customer.createdPlaylists[x-1]}}
                    </div>                
                </div>
                <!-- <div  class="show">
                    <playlistStream :pagePart='customer.createdPlaylists[x-1]' passedUser = 'customer'/>
                </div> -->
            </div>
        </div> <br />  
        <div v-if='reset' class="show"> 
                <playlistStream :pagePart='customer.createdPlaylists[iteration]' passedUser = 'customer'/>
        </div>
            
    </div>
</template>

<script>


import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import metadataPopulation from '../mixins/metadataPopulation.js'
import createPlaylistMixin from '../mixins/createPlaylistMixin.js'
import playlistMixin from '../mixins/playlistMixin.js'
import playlistStream from '@/components/playlistStream.vue'
import Vue from 'vue'


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
            newPlaylistName : '',
            playlistClickedArray : [false,false,false,false, false, false, false],
            showAvatar : [true, true, true, true, true, true, true],
            x : 0,
            playlist : 0,
            reset : false,
            iteration: null,
            headerText: 'Playlists'
        }
    },

    components:{
        playlistStream,
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

        playlistClicked(x){
            Vue.set(this.playlistClickedArray , x , !this.playlistClickedArray[x])
            
            for(var a in this.showAvatar){                
                if(a!=x){
                    if(!this.reset){
                        Vue.set(this.showAvatar , a , false)
                        this.iteration = x
                        this.headerText = this.customer.createdPlaylists[x]
                    }else{
                        Vue.set(this.showAvatar , a , true)
                        this.iteration = null
                        this.headerText = 'Playlists'
                    }
                }
            }
            this.reset = !this.reset
        }

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

.playlistsWrapper{
        
    display: flex;
    flex-wrap: wrap;
    padding-left:10px;
    
}

.playlistTitle{

    background-color : rgb(192, 222, 229);
    text-align: center;
    font-weight:bold;
    color:rgb(252, 250, 250);
}

.showingPlaylist{
    
    position:relative; 
    padding-left: 14px;
    width:100%;
    
}

.streamLoopWrapper{
    width:100%;
}


.playlistNames{
   
    float: left;
    width: 160px;
}  

.playlistImages:hover{
        -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);
    }
        

.newPlaylist{
    padding-left: 35px;
    width: 300px;
}
</style>

