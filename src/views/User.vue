<template>
    <div class="userWrapper">
        <div class="userImage">
            
             <v-img 
                width='100%'
                height='100%'
                :src="clickedUser.profileURL"
                ></v-img>
            
        </div>
            <v-hover>
                <div class="userStream" slot-scope="{ hover }">
                    <div class="headerandSearch">
                        <div class='header' >Producer's Mixes</div>
                        <div class='userMixSearch'>
                            <v-fade-transition>
                                <v-text-field v-if='hover' height='50%' v-model='mixSearch' class='userMixSearchbox' box clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
                            </v-fade-transition>
                        </div>
                    </div>
                    <div class="mixTiles">
                        <mixTile v-for='mix in fitleredMixes' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
                    </div>
               </div>
            </v-hover>
        <div class="currentUserInfo">
            <div class="userFollowNumbers">
                    <div class='userFollowingCount'>
                    <div class="userPatronHeader">
                        Following
                    </div>
                    <div @click='trueFollowing = true' class="userPatronCount">
                        <div v-if='trueFollowing' class="userEmphasis">
                            {{clickedUser.followingCount}}
                        </div>
                        <div v-if='!trueFollowing'>
                            {{clickedUser.followingCount}}
                        </div>
                    </div>
                </div>
                <div class='userFollowerCount'>
                    <div class="userPatronHeader">
                        Followers
                    </div>
                    <div @click='trueFollowing = false' class="userPatronCount">
                        <div v-if='!trueFollowing' class="userEmphasis">
                            {{clickedUser.followerCount}}
                        </div>
                        <div v-if='trueFollowing'>
                            {{clickedUser.followerCount}}
                        </div>                        
                    </div>
                    
                </div>
            </div>
            <div class="userPatrons">
                <div v-if='trueFollowing' class="following patronsGrid">
                    <producerTile v-for='user in clickedUser.following' :object='user' :key='user.uID'></producerTile>    
                </div>
                <div v-if='!trueFollowing' class="followers patronsGrid">
                    <producerTile v-for='user in clickedUser.followers' :object='user' :key='user.uID'></producerTile>
                    
                </div> 
                
            </div>        
        </div>
        <v-hover>   
            <div class="userEvents" slot-scope="{ hover }" >
                <div class="headerandSearch">
                    <div class='header' >Events</div>
                    <div class='userMixSearch'>
                        <v-fade-transition>
                            <v-text-field v-if='hover' height='50%' v-model='eventSearch' class='userMixSearchbox' box clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
                        </v-fade-transition>
                    </div>
                </div>
                <div class="eventsGrid">
                    <eventTile v-for='event in fitleredEvents' :object='event' playerTracksReference='clickedUser.events' :key='event.eID'></eventTile>
                </div>
            </div>
        </v-hover>   
        <v-hover>
            <div class="userShows" slot-scope="{ hover }" >
                <div class="headerandSearch">
                    <div class='header' >Shows</div>
                    <div class='userMixSearch'>
                        <v-fade-transition>
                            <v-text-field v-if='hover' height='50%' v-model='showSearch' class='userMixSearchbox' box clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
                        </v-fade-transition>
                    </div>
                </div>
                <div class="eventsGrid">
                    <showTile v-for='show in fitleredShows' :object='show' playerTracksReference='clickedUser.events' :key='show.sID'></showTile>
                </div>
            </div>
        </v-hover>
    </div>
        
   
</template>

<script>

import firebase from 'firebase'
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import userMixin from '../mixins/userMixin'

import mixTile from '@/components/mixTile.vue'
import showTile from '@/components/showTile.vue'
import eventTile from '@/components/eventTile.vue'
import producerTile from '@/components/producerTile.vue'
//const database = firebase.firestore()
const functions = firebase.functions()

    
import {
    mapGetters
} from 'vuex'



export default {



    mounted() {
    
    },

    components: {
        
        mixTile,
        showTile,
        eventTile,
        producerTile,
    },


    data() {
        return {
            streamComponents: ['mixes'],
            // profileName: 'Test Producer',
            profileuID: null,
            followingCount: 0,
            followerCount: 0,
            trueFollowing : true,
            mixSearch : '',
            showSearch : '',
            eventSearch : '',
            followingSearch : '',
            followersSearch : '',
        }
    },

    watch: {
        clickeduID: function(newValue) {
            console.log('clickeduID watcher')
            this.fetchUserDetails(newValue)
            this.getUserShowsorEvents(newValue , 'events')
            this.getUserShowsorEvents(newValue , 'shows')
            
        },

        followingCount: function(){
            
            for(var a in this.clickedUser.followers){
                
                    if(this.clickedUser.followers[a].uID == this.uID){
                        this.doesFollow = true
                    }
                }
        }

  },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
            doesFollow: 'doesFollow',
            customer : 'customer',
        }),

        fitleredMixes() {
            if(this.clickedUser.playlists.mixes){
                if(this.mixSearch != null){
                    return this.clickedUser.playlists.mixes.filter(mix => {
                        return mix.title.toLowerCase().includes(this.mixSearch.toLowerCase())
                    })
                }else{
                    return this.clickedUser.playlists.mixes
                }
            }else{
                return 'waiting'
            }
        },

        fitleredEvents() {
            if(this.clickedUser.Events){
                if(this.clickedUser.Events.constructor == Array){
                    
                    if(this.eventSearch != null){
                        return this.clickedUser.Events.filter(event => {
                            return event.name.toLowerCase().includes(this.eventSearch.toLowerCase())
                        })
                    }else{
                        return this.clickedUser.Events
                    }
                }else{
                    return ''
                }
            }else{
                    return ''
                }
        },

        fitleredShows() {
            if(this.clickedUser.Shows){
                if(this.clickedUser.Shows.constructor == Array){
                    if(this.showSearch != null){
                        return this.clickedUser.Shows.filter(show => {
                            return show.name.toLowerCase().includes(this.showSearch.toLowerCase())
                        })
                    }else{
                        return this.clickedUser.Shows
                    }
                }else{
                    return ''
                }
            }{
                    return ''
                }
        },


    },


    mixins: [
        createPlaylistMixin,
        userMixin
    ],



    created: function () {

        const { params: { passeduID } } = this.$route;
        if(!(passeduID.length === 28)){
            const storage = JSON.parse(localStorage.getItem('vuex'))
            if(storage.clickeduID){
                
                this.fetchUserDetails(storage.clickeduID)
                this.getUserShowsorEvents(storage.clickeduID , 'events')
                this.getUserShowsorEvents(storage.clickeduID , 'shows')
            }
        }else{
            this.fetchUserDetails(passeduID)
        }
    },
    
    methods:{

        isArray (value) {
            return value && typeof value === 'object' && value.constructor === Array;
        },

        follow(followingName, followeruID, followerName, follow){
            this.$store.commit('doesFollow', !this.doesFollow)
            const callFunctions = functions.httpsCallable('followUser')
            
            callFunctions({
                'followingName' : followingName,
                'followeruID' : followeruID,
                'followerProfileURL' : this.customer.profileURL,
                'followingProfileURL' : this.clickedUser.profileURL,
                'followerName' : followerName,
                'follow' : follow
                }).then(() => {
                    this.$noty.success("User Followed")
                })

            this.$store.dispatch('actionDeletePlaylist' , 'timeline')
                
        }, 
        

    }
}

</script>

<style>



    .userWrapper{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2,1fr);
        grid-gap: .5em;
        height: 100%;
        width: 96vw;
    }

    .userEmphasis{
        margin: auto;
        width: 3vw;
        background-color: aquamarine;

    }

    .userEvents{

        
        background-color: blue;
        grid-row:2/3;
        grid-column:2/3;

    }

    .headerandSearch{
        display:inline-flex;
        width:100%;
        
        height:40%;
        max-height:100px;
    }

    .userMixSearch{

        float:left;
        margin-top: 15px;
        margin-left: 20px;
        width: 50%;
        height:100%;
    }

    .userMixSearchbox{
        
    }

    .eventsGrid{
        display: inline-flex;
        grid-gap: 1rem;
        margin-top: 15px;
        margin-left: 15px;
    }

    .userShows{

        background-color: red;
        grid-row:2/3;
        grid-column:3/4;
    }

    .mixTiles{
        height: 100%;
        width: 100%;
        margin-left: 18px;
        display: inline-flex;
        grid-gap: 1rem;
        
    }

    .currentUserInfo{
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 5fr;
        background-color: peru;
        grid-row:2/3;
        grid-column:1/2; 
    }

    .patronsGrid{
        display: inline-flex;
        grid-gap:1rem;
    }

    .userPatronHeader{
        margin-top: 10px;
        text-align: center;
        color : white;
        
    }

    .userPatronCount{
        text-align: center;
        color : white;
        font-size: 50px;
        font-weight: bold;
    }

    .userFollowNumbers{
    
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        background-color: red;
        grid-row:1/2;
        grid-column:1/3;

    }

    .userFollowingCount{
        grid-row:1/2;
        grid-column:1/2; 
    }

    .userFollowerCount{
        grid-row:1/2;
        grid-column:2/3; 
    }

    .userPatrons{
       
        padding-top:10px;
        padding-left:10px;
        background-color: green;
        grid-row:2/3;
        grid-column:1/3;
        display: flex;
        flex-wrap: wrap;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4,1fr);
        grid-gap: 1em;
        height: 100%
    }

    

    .userImage{
        
        grid-column: 1/2;
        grid-row: 1/2;
    }

    
    .follow{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 2/3;
    }

    .currentInfo{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 3/4;
    }

    .userStream{

        display: flex;
        background-color: greenyellow;
        grid-row:1/2;
        grid-column:2/4;
        flex-direction: column;

    }

    .forMargin{}

    .followers{
        color: red;
    }

</style>


