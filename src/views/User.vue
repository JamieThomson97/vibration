<template>
    <div class="userWrapper" v-if='selectedUser.followers' >
        
        <v-hover> 
            <div class="userImage" slot-scope="{ hover }">
                
                <v-img 
                    width='100%'
                    height='100%'
                    :src="selectedUser.profileURL"
                    class='userVImage'
                    >
                    <v-expand-transition>
                        <div
                            v-if="hover && isUser"
                            class="transition-fast-in-fast-out cyan darken-2 display-3 white--text"
                            style="height:100%;opacity: .4;max-width:100%!important;"
                        >
                           <div class="updateText">
                            Update Profile Picture <br />           
                            <input type='file' @change='changeProfilePicture' style='width:100%;' accept="image/png, image/jpeg" placeholder="Upload" class="btn">
                           </div>
                        </div>
                    </v-expand-transition>
                </v-img>
                
            </div>
        </v-hover>
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
                        <mixTile v-for='mix in filteredMixes.slice(0,20)' :key='mix.mID' :object='mix' playerTracksReference='show.mixes'> </mixTile>
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
                            {{selectedUser.followingCount}}
                        </div>
                        <div v-if='!trueFollowing'>
                            {{selectedUser.followingCount}}
                        </div>
                    </div>
                </div>
                <div class="followButton" v-if='selectedUser.uID !== customer.uID '>
                    <v-btn v-if='doesFollow.does' @click='follow(selectedUser , customer , true)' >
                        Un-Follow
                    </v-btn>
                    <v-btn v-else @click='follow(selectedUser, customer ,false)'>
                        Follow
                    </v-btn>
                </div>
                <div class='userFollowerCount'>
                    <div class="userPatronHeader">
                        Followers
                    </div>
                    <div @click='trueFollowing = false' class="userPatronCount">
                        <div v-if='!trueFollowing' class="userEmphasis">
                            {{selectedUser.followerCount}}
                        </div>
                        <div v-if='trueFollowing'>
                            {{selectedUser.followerCount}}
                        </div>                        
                    </div>
                    
                </div>
            </div>
            <div class="userPatrons">
                <div v-if='trueFollowing' class="following patronsGrid">
                    <producerTile v-for='user in selectedUser.following' :object='user' :key='user.uID'></producerTile>    
                </div>
                <div v-if='!trueFollowing' class="followers patronsGrid">
                    <producerTile v-for='user in selectedUser.followers' :object='user' :key='user.uID'></producerTile>
                    
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
                    <eventTile v-for='event in filteredEvents.slice(0,8)' :object='event' playerTracksReference='selectedUser.events' :key='event.eID'></eventTile>
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
                    <showTile v-for='show in filteredShows.slice(0,8)' :object='show' playerTracksReference='selectedUser.events' :key='show.sID'></showTile>
                </div>
            </div>
        </v-hover>
    </div>
    <!-- <div class="temp">
        this is temp
    </div> -->
    
   
</template>

<script>

import firebase from 'firebase'
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import selectedUserMixin from '../mixins/selectedUserMixin'

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



    mounted: function() {
    
        
        this.fetchUserDetails(this.selectedUser.uID)
        this.getUserShowsorEvents(this.selectedUser.uID , 'events')
        this.getUserShowsorEvents(this.selectedUser.uID , 'shows')
       
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
            newProfilePicture : null,
            followIndex : null,
            
                       
        }
    },

    watch: {
        
        // clickeduID: function(newValue) {
        //     console.log('clickeduID watcher')
        //     this.fetchUserDetails(newValue)
        //     this.getUserShowsorEvents(newValue , 'events')
        //     this.getUserShowsorEvents(newValue , 'shows')
            
        // },

        followingCount: function(){
            
            for(var a in this.selectedUser.followers){
                
                    if(this.selectedUser.followers[a].uID == this.uID){
                        this.doesFollow.index = a
                        this.doesFollow.does = true
                    }
                }
        },

        uIDWatcher : function(newValue){
            
            this.fetchUserDetails(newValue)
            this.getUserShowsorEvents(newValue , 'events')
            this.getUserShowsorEvents(newValue , 'shows')

        }



  },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            selectedUser : 'selectedUser',
            doesFollow: 'doesFollow',
            customer : 'customer',
            uIDWatcher : 'uIDWatcher' 
        }),

        isUser(){
            return (this.selectedUser.uID == this.customer.uID)
        },

        filteredMixes() {
            
            if(this.selectedUser.playlists){
                
                if(this.mixSearch != null){
                    return this.selectedUser.playlists.mixes.filter(mix => {
                        return mix.title.toLowerCase().includes(this.mixSearch.toLowerCase())
                    })
                }else{
                    return this.selectedUser.playlists.mixes
                }   
            }else{
                return ''
            }
        },

        filteredEvents() {
            if(this.selectedUser.Events){
                if(this.selectedUser.Events.constructor == Array){
                    
                    if(this.eventSearch != null){
                        return this.selectedUser.Events.filter(event => {
                            return event.name.toLowerCase().includes(this.eventSearch.toLowerCase())
                        })
                    }else{
                        return this.selectedUser.Events
                    }
                }else{
                    return ''
                }
            }else{
                    return ''
                }
        },

        filteredShows() {
            if(this.selectedUser.Shows){
                if(this.selectedUser.Shows.constructor == Array){
                    if(this.showSearch != null){
                        return this.selectedUser.Shows.filter(show => {
                            return show.name.toLowerCase().includes(this.showSearch.toLowerCase())
                        })
                    }else{
                        return this.selectedUser.Shows
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
        selectedUserMixin
    ],



    created: function () {

    },
    
    methods:{

        changeProfilePicture(e){
        
          if(e.target.files[0].type == 'image/jpeg' | e.target.files[0].type == 'image/png'){
            
            this.newProfilePicture = e.target.files[0]
            this.updateUserImage(this.uID , this.newProfilePicture)
          }else{
          this.$noty.error("please upload an image")
          }
      },

        isArray (value) {
            return value && typeof value === 'object' && value.constructor === Array;
        },

        follow(following, follower, follow){
            this.$store.commit('doesFollow', { does : (!this.doesFollow.does) , index : this.doesFollow.index})
            
            const callFunctions = functions.httpsCallable('followUser')
            if(follow){
                console.log('splicing')
                this.selectedUser.followers.splice(this.doesFollow.index , 1)
                this.selectedUser.followerCount --
            }
            
            callFunctions({
                'following' : following,
                'follower' : follower,
                'follow' : follow
                }).then(() => {
                    if(!follow){
                        this.$noty.success("User Followed")
                        this.selectedUser.followers.push(this.customer)
                        this.selectedUser.followerCount ++
                    }else{
                        this.$noty.success("User un-followed")
                        
                    }
                    
                })

            //this.$store.dispatch('actionDeletePlaylist' , 'timeline')
                
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
        height: 100vh;
        width: 97vw;
    }

    .userEmphasis{
        margin: auto;
        width: 3vw;
        background-color: aquamarine;

    }

    .userEvents{

        flex-wrap: wrap;
        background-color: blue;
        grid-row:2/3;
        grid-column:2/3;

    }

    .updateText{
        margin: auto;
        text-align: center;
        max-width:100%;
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
        flex-wrap: wrap;
    }

    .userShows{

        background-color: red;
        grid-row:2/3;
        grid-column:3/4;
        flex-wrap: wrap;
    }

    .mixTiles{
        height: 100%;
        width: 100%;
        margin-left: 18px;
        display: inline-flex;
        grid-gap: 1rem;
        flex-wrap: wrap;
        
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
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        background-color: red;
        grid-row:1/2;
        grid-column:1/3;

    }
    
    .userFollowingCount{
        grid-row:1/2;
        grid-column:1/2; 
    }
    
    .followButton{
        grid-row:1/1;
        grid-column:2/3; 
        margin: auto;
    }

    .userFollowerCount{
        grid-row:1/2;
        grid-column:3/4; 
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
        max-width:100%;
        max-height:100%;
        grid-column: 1/2;
        grid-row: 1/2;
    }
    .userVImage{
        max-width:100%;
        max-height:100%;
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


