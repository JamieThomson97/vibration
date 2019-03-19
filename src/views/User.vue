<template>
    <div class="userWrapper">
        <div class="image">
            <div>
              Name of profile currently on 
              {{profileName}}
                
            </div>
        </div>
        <div class="mixes">
            <div>
                <Stream pagePart='mixes'></Stream>
            </div>
        </div>
        <div class="currentInfo">
            <div>Information</div>
        </div>
        <div class="follow">
            <v-btn @click='follow(profileName ,uID , name, true)'>Follow</v-btn>
            <v-btn @click='follow(profileName ,uID , name, false)'>Un-Follow</v-btn>
            <span>Following Count : {{followingCount}} </span>
            <span>Follower Count : {{followerCount}} </span>   
            {{uID}}         
        </div>
        <div class="userPlayer">User Player</div>
    </div>
        
   
</template>

<script>

    import firebase from 'firebase'
    import createPlaylistMixin from '../mixins/createPlaylistMixin'
    
import {
    mapGetters
} from 'vuex'
import Stream from '@/components/Stream.vue'

export default {


    beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem('vuex')) {
      console.log("doesnt exist")
      next('/about')
    } else {
      if ((JSON.parse(localStorage.getItem('vuex')).customer.uID) == null) {
        next('/about')
        console.log("property is NULL")
      } else {
        next()
      }
    }
},

    components: {
        Stream,
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

    computed: {
        ...mapGetters([
            'profileURL',
            'uID',
            'name',
        ]),
    },


    mixins: [
        createPlaylistMixin
    ],



    created: function () {
        this.createStream(this.streamComponents)
        firebase.firestore().collection('users').where('name', '==', this.profileName).onSnapshot(response => {
            this.profileuID = response.docs[0].id
            console.log(response.docs[0].data())
            this.followingCount = response.docs[0].data().followingCount
            this.followerCount = response.docs[0].data().followerCount
            console.log(this.followerCount)
        })

        
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


