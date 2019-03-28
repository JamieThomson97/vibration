<template>
    <div class="follWrapper">
        <v-list-tile class="card" @click='setClickeduID(user.id)' router :to="`/users/${(user.name).split(' ').join('_')}`" v-for="user in clickedUser[XXX]" :key="user.uID">
            {{user.name}}
            <img height='100%' :src='user.profileURL'>
        </v-list-tile>
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

.card{
    width: 100px;
    border:1px solid #333;
}

</style>
