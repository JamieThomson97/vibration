<template>
    <div class="userShowWrapper">
        
        <div class='userShowsResults' v-for="Show in selectedUser.Shows" :key="Show.name">
            <v-card color="cyan darken-2" class="userShowCard" elevation='10'>
                <v-layout column="true">
                <v-flex xs5>
                    <v-img 
                    class = 'userShowImage'
                    
                    :src='Show.imageURL'
                    height="125px"
                    contain
                    ></v-img>
                </v-flex>
                <v-card-title primary-title>
                    
                        <div class='userShowInfo' @click='clickedProducer(item.uID , item.producer)'>{{Show.name}}</div>
                    
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

.userShowWrapper{
    display: grid;
    grid-gap: 1em;
    height:23vh;
    grid-template-rows: 1fr 1fr;
    grid-template-columns : 1fr;
}

.userShowsResults{
    margin-top: 5vh;
    margin-left: 2vh;
    display: inline-flex;
    flex-wrap: wrap;
}

.userShowCard{
    width: 5vw;
    height: 11vh;
}


.userShowInfo{
    margin-top: 2px;
    text-align: center !important;
    color : white;
    font-weight: bold;
    width:100%;
}

</style>
