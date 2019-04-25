<template>
    <v-hover>
        <div class='mixTileWrapper' slot-scope="{ hover }">
            
            <v-card color="purple darken-1" class="mixTileCard" :class="`elevation-${hover ? 15 : 8}`" >
                <v-layout column="true">
                <v-flex xs5>
                    <v-img 
                    class = 'mixTileImage'
                    @click='navigateEvent(object.eID, object.name)'
                    :src="object.imageURL"
                    height="125px"
                    containzout
                    >
                        <v-fade-transition>
                            <div
                                v-if="hover"
                                class="d-flex artworkHover transition-fast-in-fast-out v-card--reveal"
                                style="height: 100%;"
                            >
                                
                            </div>
                        </v-fade-transition>
                    </v-img>
                </v-flex>
                <v-card-title 
                :class="`${hover? 'mixTileInfoHover': 'mixTileInfo'}`"
                primary-title
                >
                    <div class='mixTileProducer' @click='navigateEvent(object.eID, object.name)'>{{object.name}}</div>
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
                            
                        
                    </div>
                </v-card>
            </v-fade-transition>
            
          

        </div>
    </v-hover>

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

            var seconds = this.object.dateUploaded.seconds
            var date = new Date(seconds * 1000).toLocaleDateString('en-UK', this.options)
            return date
        },

    playlistOptions(){
            return this.customer.createdPlaylists.concat(['Listen Later'])
        },
    },

}
</script>

<style>

.mixTileWrapper{
    width: 11vh;
}

.mixTileInfo{
    
    color:white;
}

.mixTileInfoHover{
    width:100%;
    
    color:white;
    background-color: rgba(255, 255, 255, 0.4);
}

.mixTileTitle{
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

.mixTileImage{
    
    cursor:pointer;
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
