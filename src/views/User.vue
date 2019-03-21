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
            <v-btn @click='follow(profileName ,uID , name, true)'>Follow</v-btn>
            <v-btn @click='follow(profileName ,uID , name, false)'>Un-Follow</v-btn>
            <div class="followers">
                <span>Following Count : {{clickedUser.followingCount}} </span>
                <followX XXX='followers'/>    
            </div> 
            <div class="following">
                <span>Follower Count : {{clickedUser.followerCount}} </span>
                <followX XXX='following'/>    
            </div>        
        </div>
        <div class="userPlayer">User Player</div>
    </div>
        
   
</template>

<script>

    import firebase from 'firebase'
    import createPlaylistMixin from '../mixins/createPlaylistMixin'
    import userMixin from '../mixins/userMixin'

    
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
            profileName: 'Test Producer',
            profileuID: null,
            followingCount: 0,
            followerCount: 0,
        }
    },

    watch: {
        clickeduID: function(newValue) {
        
            this.fetchUserDetails(newValue)

        }
  },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
        }),
    },


    mixins: [
        createPlaylistMixin,
        userMixin
    ],



    created: function () {
        
        const storage = JSON.parse(localStorage.getItem('vuex'))
        console.log(storage)
        if(storage.clickedUseruID){
            console.log(storage.clickedUseruID)
            this.fetchUserDetails(storage.clickedUseruID)
        }
    },
    
    methods:{

        follow(followingName, followeruID, followerName, follow){
            const callFunctions = firebase.functions().httpsCallable('followUser')
            
            callFunctions({
                'followingName' : followingName,
                'followeruID' : followeruID,
                'followerName' : followerName,
                'follow' : follow
                }).then(response => {
                    console.log(response)
                })
                
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

</style>


