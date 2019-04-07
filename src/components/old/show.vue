<template>
    <div class="userShowWrapper">
        <div class="header ShowsHeader" style='width:100%;'>Shows</div>
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
    height:100%;
    grid-template-rows: 1fr 5fr;
    grid-template-columns : 1fr;
}

.userShowsResults{
    margin-left: 17px;
    display: flex;
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
