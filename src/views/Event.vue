<template>
    
<div class='eventWrapper'>

    <div class="eventInfo">
        {{event.name}} <br/> {{startDate}} -- {{endDate}} <br/>
        <div class='eventImage'>
            <img :src="event.imageURL" style="float:left;width:100%;height:100%;object-fit:cover;align:end;">
        </div>
    </div>
    <div class="eventOverlap">
        Event Overlap
    </div>

    <div class="eventStream">
        Stream
    </div>

    <div class="eventArtists">
        <v-list-tile style='background-color:red;width:30%;' class="artistCard" v-for="artist in event.artists" :key="artist.name" @click='pushtoUser(artist.name , artist.uID)'>
            {{artist.name}}
            <img style="float:left;width:20%;height:100%;object-fit:cover;align:end;"   :src='artist.profileURL'>
        </v-list-tile>
    </div>
        
</div>


</template>

<script>

import userMixin from '../mixins/userMixin.js'
import {
    mapGetters
} from 'vuex'

export default {

      mixins: [
    userMixin
  ],

    mounted() {
    // const { params: { eID } } = this.$route;
    const eID = 'TtjuzgP8TTY9JIFQEG3Y'
    this.$store.dispatch('getEventDetails', eID)
    },

    data(){
        return{
            options : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        }       
    },

    methods: {
        pushtoUser(name, uID){
            this.setClickeduID(uID)
            this.$router.push("/users/"+(name).split(' ').join('_'))
        }
    },

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
        }),

        startDate(){
            return new Date(this.event.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
        },
        endDate(){
            return new Date(this.event.endDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
        }
    },

    //  return new Date(this.event.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
    
}
</script>

<style>

    .eventWrapper{
        display: grid;
        grid-template-columns: 2.5fr 3.5fr 3fr;
        grid-template-rows: repeat(12, 1fr);
        grid-gap: 1em;
        height: 100%;
        background-color: #e0a99a
    }

    .eventInfo{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 1/2;
        grid-row: 1/12;
        background-color: blue;
        color:#e0a99a;
    }

    

    .eventOverlap{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 2/3;
        grid-row: 1/6;
        background-color: blue;
        color:#e0a99a;
    }

    .eventArtists{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 2/3;
        grid-row: 6/12;
        background-color: green;
        color:#e0a99a;
    }

    .eventStream{

        display: block;
        overflow: auto;
        border: 1px solid;
        grid-column: 3/4;
        grid-row: 1/12;
        background-color: black;
        color:#e0a99a;
    }

</style>
