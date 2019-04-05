<template>
    
<div class='eventWrapper'>
    <div class="eventImage">
            
             <v-img 
                width='100%'
                height='100%'
                :src="event.imageURL"
                ></v-img>
            
    </div>
    <div class="eventInfo">
        <div class='header'>{{event.name}} </div><br/> 
        <div class="dateHeader">{{startDate}} - {{endDate}} <br/></div>
        <div class="dateHeader"> Knebworth Fields <br/></div>
        
    </div>
    <v-hover>   
        <div class="eventStream" slot-scope="{ hover }">
            <div class="headerandSearch">
                <div class='header' >Mixes</div>
                <div class='userMixSearch'>
                    <v-fade-transition>
                        <v-text-field v-if='hover' height='50%' color='red' v-model='mixSearch' class='eventMixSearchbox' solo-inverted clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
                    </v-fade-transition>
                </div>
            </div>
            <div class="eventsGrid">
                <mixTile v-for='mix in event.mixes' :object='mix' playerTracksReference='clickedUser.artists' :key='mix.mID'></mixTile>
            </div>
        </div>
    </v-hover> 
    <v-hover>   
    <div class="eventArtists" slot-scope="{hover }">
        
        <div class='eventProducersCards'>
            <div class="headerandSearch">
                <div class='header' >Artist</div>
                <div class='userMixSearch'>
                    <v-fade-transition>
                        <v-text-field v-if='hover' height='50%' color='red' v-model='artistSearch' class='eventMixSearchbox' box clearable type="text"  placeholder="Search"></v-text-field>
                    </v-fade-transition>
                </div>
            </div>
            <div class="eventsGrid">
                <producerTile v-for='artist in filteredArtists' :object='artist' playerTracksReference='clickedUser.artists' :key='artist.uID'></producerTile>
            </div>
        </div>
    </div>
    </v-hover>
        
</div>


</template>


<script>

import userMixin from '../mixins/userMixin.js'
import {
    mapGetters
} from 'vuex'
import mixTile from '@/components/mixTile.vue'
import producerTile from '@/components/producerTile.vue'

export default {

    components:{
       
        mixTile,
        producerTile,
    },

      mixins: [
    userMixin
  ],

    mounted() {
    // const { params: { eID } } = this.$route;
    const eID = 'TtjuzgP8TTY9JIFQEG3Y'
    this.$store.dispatch('getEventDetails', eID).then(() => {
    var mixes = this.getEventMixes('TtjuzgP8TTY9JIFQEG3Y') 
        mixes.then(response => {
          //Dispatch to save in state
          this.$store.commit("setEventMixes", response)  
          })
    })
    },

    data(){
        return{
            options : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            mixSearch : '',
            artistSearch : '',
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
        },

        fitleredMixes() {
            if(this.event.mixes){
                if(this.mixSearch != null){
                    return this.event.mixes.filter(mix => {
                        return mix.title.toLowerCase().includes(this.mixSearch.toLowerCase())
                    })
                }else{
                    return this.event.mixes
                }
            }else{
                return ''
            }
        },

        filteredArtists() {
            if(this.event.artists){
                if(this.artistSearch != null){
                    return this.event.artists.filter(artist => {
                        return artist.name.toLowerCase().includes(this.artistSearch.toLowerCase())
                    })
                }else{
                    return this.event.artists
                }
            }else{
                return ''
            }
        },
    },

    created: function(){
        
        
      
    }

    //  return new Date(this.event.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
    
}
</script>

<style>

    .eventWrapper{
        display: grid;
        grid-template-columns: 2.5fr 3.5fr 3fr;
        grid-template-rows: 1fr 1fr;
        height: 100%;
        width:96.2vw;
        background-color: #e0a99a
    }

    .eventInfo{

        display: block;
        overflow: auto;
        grid-column: 2/3;
        grid-row: 2/3;
        background-color: blue;
        color:#e0a99a;
        margin-bottom:5px;
    }

    .eventImage{
        margin-top:5px;
        
        grid-column: 2/3;
        grid-row: 1/2;
    }

    .{
        background-color: white;
    }

    .eventProducersCards{
        margin-left:15px;
        display: inline-flex;
        flex-wrap: wrap;
        grid-gap:10px;
    }

    .eventProducersCard{
        width: 5vw;
        height: 11vh;
    }

    .eventProducerInfo{
    margin-top: 2px;
    text-align: center !important;
    color : white;
    font-weight: bold;
    width:100%;
}   

    .eventStream{

        margin-top:5px;
        margin-bottom:5px;
        margin-left:5px;
        margin-right:3px;
        display: block;
        overflow: auto;
        grid-column: 1/2;
        grid-row: 1/3;
        background-color: black;
        color:#e0a99a;
    }

    .eventArtists{
        margin-top:5px;
        margin-bottom:5px;
        margin-left:3px;
        margin-right:5px;
        display: block;
        overflow: auto;
        grid-column: 3/4;
        grid-row: 1/3;
        background-color: green;
        color:#e0a99a;
    }

    .dateHeader{
        margin-left: 20px;
        color: white;
        font-size: 35px;
    }

    

</style>
