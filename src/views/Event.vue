<template>
    
<div class='eventWrapper'>
    <div class="eventImage" vi>
            
             <v-img 
                width='100%'
                height='100%'
                :src="selectedEvent.imageURL"
                ></v-img>
            
    </div>
    <div class="eventInfo">
        <!-- <div class='header'>{{selectedEvent.name}} </div><br/> 
        <div class="dateHeader">{{startDate}} - {{endDate}} <br/></div> -->
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
                <mixTile v-for='mix in fitleredMixes' :object='mix' playerTracksReference='selectedUser.artists' :key='mix.mID'></mixTile>
            </div>
        </div>
    </v-hover> 
    <v-hover>   
    <div class="eventArtists" slot-scope="{hover }">
        
        <div class='eventProducersCards'>
            <div class="headerandSearch" style='min-height:100px;'>
                <div class='header' >Producers</div>
                <div class='userMixSearch'>
                    <v-fade-transition>
                        <v-text-field v-if='hover' height='50%' color='red' v-model='artistSearch' class='eventMixSearchbox' box clearable type="text"  placeholder="Search"></v-text-field>
                    </v-fade-transition>
                </div>
            </div>
            <div class="eventsGrid">
                <producerTile v-for='artist in filteredArtists' :object='artist' playerTracksReference='selectedUser.artists' :key='artist.uID'></producerTile>
            </div>
        </div>
    </div>
    </v-hover>
        
</div>
<!-- <div class="temp">
    temp
</div> -->

</template>


<script>

import selectedUserMixin from '../mixins/selectedUserMixin.js'
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
    selectedUserMixin
  ],

    mounted() {
        
        const eID = this.selectedEvent.eID
        console.log(eID)
        this.$store.dispatch('getEventDetailsID', eID).then(() => {
        var mixes = this.getEventMixes(eID) 
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
            this.navigateUser(uID , name)
        }
    },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser: 'selectedUser',
            selectedMix : 'selectedMix',
            trackData : 'trackData',
            selectedEvent : 'selectedEvent' ,
        }),

        // inEvent(){
            
        //     if(this.selectedEvent.mixes){
        //         console.log('in')
        //         var inEvent = false
        //         console.log('in event')
        //         console.log()
        //         this.selectedEvent.mixes[0].producers.forEach(producer => {
        //             console.log('producer')
        //             console.log(producer)
        //             if(producer.uID == this.uID){
        //                 return true
        //             }
        //         })
        //         return isEvent
        //     }else{
                
        //         return 'waiting'
        //     }
        // },

        startDate(){
            return new Date(this.selectedEvent.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
        },
        endDate(){
            return new Date(this.selectedEvent.endDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
        },

        fitleredMixes() {
            if(this.selectedEvent.mixes){
                if(this.selectedEvent.mixes.constructor == Array){
                    if(this.mixSearch != null){
                        return this.selectedEvent.mixes.filter(mix => {
                            return mix.title.toLowerCase().includes(this.mixSearch.toLowerCase())
                        })
                    }else{
                        return this.event.mixes
                    }
                }else{
                    return ''
                }
            }else{
                return ''
            }
        },

        filteredArtists() {
            if(this.selectedEvent.producers){
                if(this.artistSearch != null){
                    return this.selectedEvent.producers.filter(artist => {
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
