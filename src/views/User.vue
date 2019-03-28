<template>
    <div class="userWrapper">
        <div class="image">
            <div>
             {{clickedUser.name}}
            </div>
        </div>
        <div class="mixes">
            <div>
                <Stream pagePart='mixes' passedUser='clickedUser'></Stream>
            </div>
        </div>
        <div class="currentInfo">
            <div>Information</div>
        </div>
        <div class="followWrapper">
            <v-btn v-if='!doesFollow & (uID !== clickeduID)' @click='follow(clickedUser.name ,uID , name, true)'>Follow</v-btn>
            <v-btn v-if='doesFollow & (uID !== clickeduID)' @click='follow(clickedUser.name ,uID , name, false)'>Un-Follow</v-btn>
            <div class="followers">
                <div>Following Count : {{clickedUser.followingCount}} </div>
                <followX XXX='following'/>    
            </div> 
            <div class="following">
                <div>Follower Count : {{clickedUser.followerCount}} </div>
                <followX XXX='followers'/>    
            </div>        
        </div>
        
    </div>
        
   
</template>

<script>

import firebase from 'firebase'
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import userMixin from '../mixins/userMixin'
//const database = firebase.firestore()
const functions = firebase.functions()

    
import {
    mapGetters
} from 'vuex'

import Stream from '@/components/Stream.vue'
import followX from '@/components/followX.vue'

export default {



    mounted() {
    
    },

    components: {
        Stream,
        followX
    },


    data() {
        return {
            streamComponents: ['mixes'],
            // profileName: 'Test Producer',
            profileuID: null,
            followingCount: 0,
            followerCount: 0,
        }
    },

    watch: {
        clickeduID: function(newValue) {
            this.fetchUserDetails(newValue)
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
            }
        }else{
            this.fetchUserDetails(passeduID)
        }
    },
    
    methods:{

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
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4,1fr);
        grid-gap: 1em;
        height: 100%
    }

    .followWrapper{
        display: flex;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4,1fr);
        grid-gap: 1em;
        height: 100%
    }

    .image{
        border: solid 1px;
        grid-column: 1/2;
        grid-row: 1/4
    }

    .mixes{
        border: solid 1px;
        grid-column: 2/5;
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

    .userPlayer{
        border: solid 1px;
        grid-row: 4/5;
        grid-column: 1/-1;        
    }

    .followers{
        color: red;
    }

</style>


