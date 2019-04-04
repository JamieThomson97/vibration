<template>
    
        <div class="mixWrapper" v-if='trackData'>
            <div class="mixTracklist">
                <v-img :src="trackData.artworkURL" height=100% width=100%>
                    <div class="mixImageOverlay">
                        <div class="header mixTracklistHeader">Tracklist</div>
                            <div class="mixTracklistTable">
                                <tr class="mixTrackistTableRow" v-for='x in 5' :key='x'>  
                                    <td class="mixTrackistTableColumn mixTracklistNumber">
                                        {{x}}.
                                    </td>
                                    <td style='padding-left:10px;' class="mixTrackistTableColumn mixTracklistSong">
                                        Leaving - Illenium
                                    </td>
                                </tr>
                            </div>
                        
                    </div>
                </v-img>
            </div>
            <div class="mixInfo">
                
                <div class="header mixInfoTitle">{{trackData.title}} - Girl Trapz</div>
                <div class="mixLikeButton">
                    <v-btn v-if='!doesLike' @click='likeMix(clickedMixID, true)'>like</v-btn>
                    <v-btn v-if='doesLike' @click='likeMix(clickedMixID, false)'>unlike</v-btn>
                </div>
                <div class="mixPlays">
                    <div class="smallPlays">Plays</div>
                    <div class="largePlays">{{trackData.plays}}0</div>
                </div>
                <div class="mixLikes">
                    <div class="smallPlays">Likes</div>
                    <div class="largePlays">{{likeCount}}</div>
                </div>
                <div class="mixLikers"  v-if='trackData.likers' >
                    <v-avatar
                    class="user" v-for='x in trackData.likers' :key='x.uID'
                    size="70"
                    style='cursor:pointer;'
                    >
                        <img
                        class = 'playlistImages'
                        @click='setClickeduID(x.uID , x.name)'
                        :src="x.profileURL"
                        alt="Avatar"
                        >
                    </v-avatar>
                   
                </div>
            </div>
            <div class="mixProducerInfo">
                <div class="header mixProducerName">
                    {{trackData.producer}}
                </div>
                
                <div class="mixFollowNumbers">
                    <!-- <v-btn v-if='!doesFollow & (uID !== clickeduID)' @click='follow(clickedmix.name ,uID , name, true)'>Follow</v-btn> -->
                    <!-- <v-btn v-if='doesFollow & (uID !== clickeduID)' @click='follow(clickedmix.name ,uID , name, false)'>Un-Follow</v-btn> -->
                    <div class='mixFollowingCount'>
                        <div class="userPatronHeader">
                            Following
                        </div>
                        <div  class="userPatronCount">
                            
                            <div >
                                {{clickedUser.followingCount}}
                            </div>
                        </div>
                    </div>
                    
                    <div class='mixFollowerCount'>
                        <div class="userPatronHeader">
                            Followers
                        </div>
                        <div class="userPatronCount">
                            
                            <div >
                                {{clickedUser.followerCount}}
                            </div>                        
                        </div>
                        
                    </div>
                </div>
                <div class="mixUserShows">
                    <div class="mixSubHeader">Shows</div>
                    <div class="eventsGrid">
                        <showTile v-for='show in clickedUser.Shows' :object='show' playerTracksReference='clickedUser.events' :key='show.sID'></showTile>
                    </div>
                </div>
                <div class="mixUserEvents">
                    <div class="mixSubHeader">Events</div>
                    <div class="eventsGrid">
                        <eventTile v-for='event in clickedUser.Events' :object='event' playerTracksReference='clickedUser.events' :key='event.eID'></eventTile>
                    </div>
                </div>
            </div>
            <div class="mixEventorShowSuggested">
                <div class="mixEvent" v-if="event">
                    <div class='header'>From the same event</div>
                    <div class="mixTiles">
                        <mixTile v-for='mix in event.mixes' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
                    </div>   
                </div>
                <div class="mixShow" v-if="show">
                    <div class='header'>From the same show</div>
                    <div class="mixTiles">
                        <mixTile v-for='mix in show.mixes' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
                    </div>   
                </div>
                
            </div>
            <div class="mixProducerSuggested">
                <div class='header'>By the same producer</div>
                <div class="mixTiles">
                    <mixTile v-for='mix in clickedUser.playlists.mixes' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
                </div>
            </div>
        </div>
            
       
    
</template>

<script>

import mixMixin from '../mixins/mixMixin'
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import tileMixin from '../mixins/tileMixin'
import userMixin from '../mixins/userMixin'

import mixTile from '@/components/mixTile.vue'
import showTile from '@/components/showTile.vue'
import eventTile from '@/components/eventTile.vue'

import {
    mapGetters
} from 'vuex'


import firebase from 'firebase'

export default {

    components: {
        
        mixTile,
        showTile,
        eventTile,
    },

    props: {
    pagePart: {
      type: String,
      required: false,
    },
    passedUser: {
      type: String,
      required: false,
    }
  },


    data(){
        return{
            likeCount : 0,
            doesLike : null,
            x : 0,
            inLiked: -1,
        }
    },

    mixins: [
        mixMixin,
        createPlaylistMixin,
        userMixin,
        tileMixin,
    ],

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser: 'clickedUser',
            clickedMixID : 'clickedMixID',
            trackData : 'trackData',
            event : 'event' ,
            show : 'show'
        }),
    },

    watch: {

        clickedMixID: function(newValue) {
            console.log('watcher')            
            this.fetchMixInfo(newValue)
        },

        trackData: function(newValue) {
            if(this.clickedUser.uID != newValue.uID){
                this.fetchUserDetails(newValue.uID)
            }
            console.log(newValue)
            if(newValue.event){
                console.log('event')
                var event = newValue.event
                console.log(event)
                this.$store.dispatch('getEventDetails', event).then(() => {
                var mixes = this.getEventMixes(event) 
                    mixes.then(response => {
                    //Dispatch to save in state
                    this.$store.commit("setEventMixes", response)  
                    })
                })
            }
            if(newValue.show){
                console.log('show')
                var show = newValue.show
                this.$store.dispatch('getShowDetails', show).then(() => {
                var mixes = this.getShowMixes(show) 
                    mixes.then(response => {
                    //Dispatch to save in state
                    this.$store.commit("setShowMixes", response)  
                    })
                })
            }
        },

        clickedUser: function(newValue) {
            if(newValue.uID){
                this.getUserShowsorEvents(newValue.uID , 'events')
                this.getUserShowsorEvents(newValue.uID  , 'shows')
            }
        }

        //If event or stream, set the event . mixes object in state to equal the mixes in that event or mix

  },

  created: function(){
    const storage = JSON.parse(localStorage.getItem('vuex'))
    console.log(storage.clickedMixID)
    if(storage.clickedMixID){
         
        this.fetchMixInfo(storage.clickedMixID)
    }

  },

  methods: {
    likeMix(mID, like) {
        const likersObj = {
                    'name' : this.name,
                    'uID' : this.uID, 
                    'profileURL' : this.profileURL,
                }
        if(like){
            this.likeCount = this.likeCount + 1
            if(this.trackData.likers.length < 10){
                
                (this.trackData.likers).push(likersObj)
                this.inLiked = this.trackData.likers.length - 1
                
            }
        }else{
            if(this.inLiked > -1){
            
                (this.trackData.likers).splice(this.inLiked, 1)
            }
            this.likeCount = this.likeCount - 1
        }
        this.trackData.likers.push()
        this.doesLike = !this.doesLike
        var callFunction = firebase.functions().httpsCallable('likeMix')
        callFunction({
            mID: mID,
            likeruID : this.uID,
            produceruID : this.trackData.uID,
            likerName : this.name, 
            mixName : this.trackData.title,
            liked : like,
            profileURL : this.profileURL,
            producerName : this.trackData.producer,
            artworkURL : this.trackData.artworkURL,
            likes: this.likeCount,
            plays: this.trackData.plays 
        }).catch(error => {
            this.$noty.warning(error)
        })
    },



  }

}
</script>

<style>

.mixWrapper{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-gap: 0.5rem;
    height:100vh;
    width:96.4vw;
}

.mixTracklist{
    grid-column: 1/2;
    grid-row:1/5;
    background-color: rgb(12, 35, 56);
}

.mixTracklistTable{
    margin-top:20px;
    margin-left:20px;
}

.mixTracklistNumber{

    color: rgb(40, 106, 168);
    font-size: 16px;
}

.mixTracklistSong{
    font-weight: bold;
    color: rgb(40, 106, 168);
    font-size: 26px;
}

.mixImageOverlay{
    height: 100%;
    background-color: rgba(0,0,0, 0.6);
}

.mixShow{
    margin-top: 15px;
}

.mixInfo{
    grid-column: 2/3;
    grid-row:1/2;
    background-color: darkblue;
    display:grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr;
}

.mixInfoTitle{

    grid-row:1/1;
    grid-column:1/2;

}
.mixLikeButton{

    margin: auto;
    grid-row:1/1;
    grid-column:2/3;

}
.mixPlays{

    grid-row:2/3;
    grid-column:1/2;

}

.smallPlays{

    font-size: 20px;
    color:white;
    text-align: center;
}

.largePlays{

    font-size: 60px;
    color:white;
    text-align: center;
}


.mixLikes{

    grid-row:2/3;
    grid-column:2/3;
}
.mixLikers{

    margin-top: 15px;
    margin-left: 15px;
    grid-gap:1rem;
    display: inline-flex;
    grid-row:3/4;
    grid-column:1/3;

}
    

.mixProducerInfo{
    display:grid;
    grid-column: 3/4;
    grid-row:1/3;
    background-color: salmon;
    grid-template-rows: 0.5fr 1fr 1fr;
    grid-template-columns: 1fr 1fr;

}

.mixFollowNumbers{

    display:inline-flex;
    grid-column: 2/3;
    grid-row:1/2;
}

.mixSubHeader{
    font-size:20px;
    margin-left: 15px;
    color:white;
}

.mixUserShows{
    display:grid;
    grid-column: 1/3;
    grid-row:2/3;
    grid-template-rows: 0.3fr 1fr;
    max-height:80%;
    
}
.mixUserEvents{
    max-height:80%;
    display:grid;
    grid-column: 1/3;
    grid-row:3/4;
    grid-template-rows: 0.3fr 1fr;
}


.mixFollowingCount{
    width:50%;
}

.mixFollowerCount{
    width:50%;
}



.mixEventorShowSuggested{
    grid-column: 2/3;
    grid-row:3/5;
    background-color: darkgreen;
}
    

.mixProducerSuggested{
    grid-column: 3/4;
    grid-row:3/5;
    background-color: powderblue;
}   




.user {
    border: 1px solid fuchsia;
    width: 250px;
}


</style>
