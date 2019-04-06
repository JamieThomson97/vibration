<template>
    <transition name="fade">
        <v-hover>
            <div class='mixTileWrapper' slot-scope="{ hover }">
                
                <v-card color="cyan darken-2" class="mixTileCard" :class="`elevation-${hover ? 15 : 8}`" >
                    <v-layout column="true">
                    <v-flex xs5>
                        <v-img 
                        class = 'mixTileImage'
                        
                        :src="object.artworkURL"
                        height="125px"
                        containzout
                        >
                            
                        
                            <v-fade-transition>
                                <div
                                    v-if="hover"
                                    class="d-flex artworkHover transition-fast-in-fast-out v-card--reveal"
                                    style="height: 100%;"
                                >   
                                    <v-icon color="white" style='margin-top:25px;' @click="handleClickTrack(object, playerTracksReference)" x-large>play_circle_outline</v-icon>
                                    <v-icon v-if='deletable' class="material-icons" style='position:absolute; top:0;right:0;' @click="removeFromPlaylist(object.mID , collection)">clear</v-icon>
                                </div>
                                

                            </v-fade-transition>
                        </v-img>
                    </v-flex>
                    <v-card-title  
                    :class="`${hover? 'mixTileInfoHover': 'mixTileInfo'}`"
                    primary-title
                    >
                            
                            <div class='mixTileTitle' @click='navigateMix(object.mID, object.title )'>{{object.title}}</div>
                            <div v-for='x in object.producers' :key='x.uID' class='mixTileProducer' @click='navigateUser(x.uID, x.name)'>{{x.name}}</div>
                            <div v-if='object.show' class='mixTileDate'>
                                {{readableDate}} - {{object.show.name}}
                                <v-icon 
                                style='position: absolute;   right: 0;   bottom: 0;' 
                                v-if='playlistSelector' 
                                class='tileActionsIcons' 
                                @click='addToPlaylist(object , playlistChoice)'>done</v-icon>
                            </div>
                            <div v-else-if='object.event' class='mixTileDate' @click='setClickedeID(object.event.eID, object.event.name )'>
                                {{readableDate}} - {{object.event.name}}
                                <v-icon 
                                style='position: absolute;   right: 0;   bottom: 0;' 
                                v-if='playlistSelector' 
                                class='tileActionsIcons' 
                                @click='addToPlaylist(object , playlistChoice)'>done</v-icon>
                            </div>
                            <div v-else class='mixTileDate'>
                                {{readableDate}}
                                <v-icon 
                                style='position: absolute;   right: 0;   bottom: 0;' 
                                v-if='playlistSelector' 
                                class='tileActionsIcons' 
                                @click='addToPlaylist(object , playlistChoice)'>done</v-icon>
                            </div>
                        </v-card-title>
                    
                    </v-layout>
                
                </v-card>
                <v-fade-transition>
                    <v-card color="cyan darken-2" v-if='hover' class="tileActions" :class="`elevation-${hover ? 15 : 8}`" >
                        <div
                        v-if="hover"
                        class="d-flex artworkHover transition-fast-in-fast-out v-card--reveal"
                        style="width: 100%;"
                        >
                                
                            <v-icon class='tileActionsIcons' @click='addToPlaylist(object , ["Liked Mixes"])'>favorite_border</v-icon>
                            <v-spacer></v-spacer>
                            <v-icon class='tileActionsIcons' @click='addToPlaylist(object , ["Listen Later"])'>watch_later</v-icon>
                            <v-spacer></v-spacer>
                            <v-icon class='tileActionsIcons' @click='playlistSelector = !playlistSelector'>playlist_add</v-icon>
                        </div>
                    </v-card>
                </v-fade-transition>
                <v-combobox class='streamVComb'
                v-if='playlistSelector'
                clearable
                allow-overflow
                v-model="playlistChoice"    
                :items="playlistOptions"
                loading
            
                label="Choose a playlist"
                multiple
                chips
                small
                
                deletable-chips
                
                
            >
            </v-combobox>
            

            </div>
        </v-hover>
     </transition>
</template>


<script>
 
 import tileMixin from '../mixins/tileMixin'

import {
    mapGetters
} from 'vuex'


export default {

    mixins:[
        tileMixin
    ],

    props:[
        'object',
        'playerTracksReference',
        'deletable',
        'collection',
    ],

    data(){
        return {
            
            options : { year: 'numeric', month: 'numeric', day: 'numeric' },
            playlistChoice : null,
            playlistSelector : false,
            
        }
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

    readableDate(){
            
            if(this.object.dateUploaded){
                var seconds = this.object.dateUploaded.seconds
                var date = new Date(seconds * 1000).toLocaleDateString('en-UK', this.options)
                return date
            }else{
                return 'not sure'
            }
                
            
        },

    playlistOptions(){
            return this.customer.createdPlaylists.concat(['Listen Later'])
        },
    },

    created: function (){

        if(this.object.objectID){
            
            this.object['mID'] = this.object.objectID
        }
        
    }

}
</script>

<style>

.mixTileWrapper{
    width: 11vh;
    height: 15vh;
}

.mixTileInfo{
    
    color:white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .9s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.4;
}

.mixTileInfoHover{
    width:100%;
    color:white;
    background-color: rgba(255, 255, 255, 0.4);
}

.mixTileTitle{
    width:100%;
    font-weight: bold;
    margin-left: 8px;
    cursor:pointer;
}

.tileActions{
    background-color: rgb(34, 177, 177);
    display: flex;
    
}

.tileActionsIcons{

    
}

.mixTileProducer{
    margin-left: 8px;
    cursor:pointer;
}

.mixTileDate{
    margin-left: 8px;
    width:100%;
    cursor:pointer;
}

.artworkHover{
    background-color: rgba(255,255,255, 0.4)
}

</style>
