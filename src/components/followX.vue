<template>
    <div class="follWrapper">
        <v-list-tile class="card" @click='setClickeduID(user.id)' router :to="`/users/${user.name}`" v-for="user in clickedUser[XXX]" :key="user.uID">
            {{user.name}}
            <img height='100%' :src='user.profileURL'>
        </v-list-tile>
    </div>
</template>

<script>

import {
    mapGetters
} from 'vuex'

export default {
    
props: [
        "XXX",        
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
         setClickeduID(uID){
            console.log('in set clickeduid')
            console.log(uID)
            this.$store.dispatch('actionSetClickeduID', uID)
        },
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
