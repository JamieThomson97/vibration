<template>
    <div class="userEventWrapper">
        <div class='userEventsResults' v-for="event in clickedUser.Events" :key="event.name">
            <v-card color="cyan darken-2" class="userEventCard" elevation='10'>
                <v-layout column="true">
                <v-flex xs5>
                    <v-img 
                    class = 'userEventImage'
                    
                    :src='event.imageURL'
                    height="125px"
                    contain
                    ></v-img>
                </v-flex>
                <v-card-title primary-title>
                    
                        <div class='userEventInfo' @click='clickedProducer(item.uID , item.producer)'>{{event.name}}</div>
                    
                    </v-card-title>
                
                </v-layout>
                
            </v-card>
        </div>
    </div>
</template>

<script>

import {
    mapGetters
} from 'vuex'

import userMixin from '../mixins/userMixin'

export default {
    
props: [
        "XXX",        
    ],

      mixins: [
    userMixin
  ],

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
    methods:{
      
    }
}


</script>

<style>

.userEventWrapper{
    display: grid;
    grid-gap: 1em;
    height:23vh;
    grid-template-rows: 1fr 1fr;
    grid-template-columns : 1fr;
}

.userEventsResults{
    margin-top: 5vh;
    margin-left: 2vh;
    display: inline-flex;
    flex-wrap: wrap;
}

.userEventCard{
    width: 5vw;
    height: 11vh;
}


.userEventInfo{
    margin-top: 2px;
    text-align: center !important;
    color : white;
    font-weight: bold;
    width:100%;
}

</style>
