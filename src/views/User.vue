<template>
    <div class="userWrapper">
        <div class="image">
            <div>
              
              Profile Name
                
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
            <v-btn @click:='follow'>Follow</v-btn>
            <v-btn @click:='unFollow'>Follow</v-btn>
            <v-btn >Un-Follow</v-btn>
            <v-span>Following Count : {{followingCount}} </v-span>
            <v-span>Follower Count : {{followerCount}} </v-span>   
            {{uID}}         
        </div>
        <div class="userPlayer">User Player</div>
    </div>
        
   
</template>

<script>

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
            streamComponents: ['mixes']
        }
    },

    computed: {
        ...mapGetters([
            'profileURL',
            'followingCount',
            'followerCount',
            'uID',
        ]),
    },

    mixins: [
        createPlaylistMixin
    ],



    created: function () {
        this.createStream(this.streamComponents)
        },
    
    methods:{

        follow(uID){

        }

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


