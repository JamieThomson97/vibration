<template>
    
<div class='showWrapper' v-if='selectedShow.producers'>
    <v-hover> 
        <div class="showArtwork" slot-scope="{ hover }">
                
                <v-img 
                    max-width='100%'
                    max-height='100%'
                    contain
                    :src="selectedShow.imageURL"
                    >
                    <v-expand-transition>
                            <div
                                v-if="hover"
                                class="d-flex transition-fast-in-fast-out cyan darken-2 v-card--reveal display-3 white--text"
                                style="height: 100%;opacity: .4;"
                            >
                            <div class="updateText">
                                Update Profile Picture   <br />           
                                <input type='file' @change='changeProfilePicture' style="width:100%; height:100%;" accept="image/png, image/jpeg" placeholder="Upload" class="btn">
                            </div>
                            </div>
                        </v-expand-transition></v-img>
                
        </div>
    </v-hover> 
    <div class="showInfo">

        <div class='header'>{{selectedShow.name}} </div><br/>
        <div class="userFollowNumbers">
                <!-- <v-btn v-if='!doesFollow & (uID !== clickeduID)' @click='follow(selectedUser.name ,uID , name, true)'>Follow</v-btn> -->
                <!-- <v-btn v-if='doesFollow & (uID !== clickeduID)' @click='follow(selectedUser.name ,uID , name, false)'>Un-Follow</v-btn> -->
                <div class='userFollowingCount'>
                    <div class="userPatronHeader">
                        Number of episodes
                    </div>
                    <div @click='trueFollowing = true' class="userPatronCount">
                        
                        {{selectedShow.mixes.length}}
                        
                    </div>
                </div>
                <div class='userFollowerCount'>
                    <div class="userPatronHeader">
                        Number of plays 
                    </div>
                    <div class="userPatronCount">
                        
                        
                        {{selectedShow.playCount}}
                                                
                    </div>
                    
                </div>
            </div>
        <div class="showDesc">
            {{selectedShow.description}}    
        </div>        
    </div>
   
    <div class="showStream">
        <div class='header'>Other episodes</div>
        <div class="episodeTiles">
            <mixTile v-for='mix in selectedShow.mixes' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
        </div>
        
    </div>

    <div class="showArtists">
        <div class='header'>Producers</div>
        <div class='showProducersCards'>
            <producerTile v-for="artist in selectedShow.producers" :key="artist.uID" :object='artist'></producerTile>
             
        </div>
    </div>
    <div class="artistSuggestions">
        <div v-if='selectedShow.producers.length > 1' class='header'>Mixes from this artist</div>
        <div v-else class='header'>Mixes from these producers</div>
        <div class="suggestionTiles">
            <mixTile v-for='mix in selectedShow.suggestedMixes' :key='mix.mID' :object='mix' playerTracksReference='show.suggestedMixes'> </mixTile>
        </div>
        
    </div>
</div>


</template>


<script>

import selectedUserMixin from '../mixins/selectedUserMixin.js'
import showMixin from '../mixins/showMixin.js'
import mixTile from '@/components/mixTile.vue'
import producerTile from '@/components/producerTile.vue'

import {
    mapGetters
} from 'vuex'

export default {

    components:{
        
        producerTile,
        mixTile,
    },

      mixins: [
            selectedUserMixin,
            showMixin,
        ],

  props: {
    object: {
      type: Object,
      required: false,
    },
    playerTracksReference : {
        type: String, 
        required: false
    }
  },

    mounted() {
        
        this.getShowPageData(this.selectedShow.sID)
        
    },

    data(){
        return{
            options : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            newProfilePicture : null,
        }       
    },

    methods: {
        pushtoUser(name, uID){
            this.navigateUser(uID, name)
        },
        changeProfilePicture(e){
        
          if(e.target.files[0].type == 'image/jpeg' | e.target.files[0].type == 'image/png'){
            
            this.newProfilePicture = e.target.files[0]
            this.updateShowImage(this.selectedShow.dID , this.newProfilePicture)
          }else{
          this.$noty.error("please upload an image")
          }
      },
    },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser: 'selectedUser',
            selectedMix : 'selectedMix',
            trackData : 'trackData',
            event : 'event' ,
            show : 'show' ,
            selectedShow: 'selectedShow'
        }),

    },

    watch:{
    },

    created: function(){
        
        
      
    }

    //  return new Date(this.event.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
    
}
</script>

<style>

    .showWrapper{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        height: 100%;
        width:96.2vw;
        background-color: #e0a99a
    }

    .showInfo{

        display: block;
        overflow: auto;
        grid-column: 2/3;
        grid-row: 1/2;
        background-color: blue;
        color:#e0a99a;
        margin-bottom:5px;
    }

    .showImage{
        margin-top:5px;
        
        grid-column: 1/2;
        grid-row: 1/2;
    }

    .showProducersCards{
        margin-left:15px;
        display: inline-flex;
        flex-wrap: wrap;
        grid-gap:10px;
    }

    .showProducersCard{
        width: 5vw;
        height: 11vh;
    }

    .showProducerInfo{
    margin-top: 2px;
    text-align: center !important;
    color : white;
    font-weight: bold;
    width:100%;
    }   

    .showStream{
        margin-top:5px;
        margin-bottom:5px;
        margin-left:5px;
        margin-right:3px;
        display: block;
        overflow: auto;
        grid-column: 3/4;
        grid-row: 1/3;
        background-color: rgb(126, 85, 85);
        color:#e0a99a;
    }

    .episodeTiles{
        padding-top: 16px;
        padding-left: 20px;
        display: inline-flex;
        grid-gap: 1rem;
    }

    .showArtists{
        margin-top:5px;
        margin-bottom:5px;
        margin-left:3px;
        margin-right:5px;
        display: block;
        overflow: auto;
        grid-column: 1/2;
        grid-row: 2/3;
        background-color: green;
        
        color:#e0a99a;
    }

    .showDesc{
        margin-top: 15px;
        margin-left: 15px;
        font-size:25px;
        color : white;
    }

    .artistSuggestions{
        padding-top: 15px;
        padding-left: 15px;
        width: 100%;
        grid-column: 2/4;
        grid-row: 2/3;
        background-color:rgb(85, 2, 2)
        
    }

    .suggestionTiles{
        display: inline-flex;
        padding-top: 15px;
        width: 100%;
        padding-left: 15px;
        flex-wrap: wrap;
        grid-gap: 1.5rem;
    }

    .dateHeader{
        margin-left: 20px;
        color: white;
        font-size: 35px;
    }

    

</style>
