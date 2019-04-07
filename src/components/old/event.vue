<template>
    <div class="userEventWrapper">
        <div class="header eventsHeader" style='width:100%;'>Events</div>
        <div class='userEventsResults' v-for="event in selectedUser.Events" :key="event.name">
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

import selectedUserMixin from '../mixins/selectedUserMixin'

export default {
    
props: [
        "XXX",        
    ],

      mixins: [
    selectedUserMixin
  ],

computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser : 'selectedUser',
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
    height:100%;
    grid-template-rows: 1fr 5fr;
    grid-template-columns : 1fr;
}

.userEventsResults{
    margin-left: 17px;
    display: flex;
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
