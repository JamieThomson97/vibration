<template>
    <div class="follWrapper">
        <div class="card" @click='setClickeduID(user.id)' router :to="`/users/${(user.name).split(' ').join('_')}`" v-for="user in clickedUser[XXX]" :key="user.uID">
            <v-card color="cyan darken-2" class="userFollowXCard" elevation='10'>
                <v-layout column="true">
                <v-flex xs5>
                    <v-img 
                    class = 'searchProducerImage'
                    @click='clickedProducer(item.uID , item.producer)'
                    :src='user.profileURL'
                    height="125px"
                    contain
                    ></v-img>
                </v-flex>
                <v-card-title primary-title>
                    
                        <div class='userFollowXInfo' @click='clickedProducer(item.uID , item.producer)'>{{user.name}}</div>
                    
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

computed:{

    ...mapGetters([
            'profileURL',
            'uID',
            'name',
            'clickeduID',
            'clickedUser',
        ]),
    
    
},
    methods:{
      
    }
}


</script>

<style>

.follWrapper{
    display: flex;
    grid-gap: 1em;
}

.userFollowXCard{
    width: 5vw;
    height: 11vh;
}


.userFollowXInfo{
    text-align: center !important;
    color : white;
    font-weight: bold;
    width:100%;
}

</style>
