<template>
    <div class="follWrapper">
        <v-list-tile class="card" router :to="`/users/${user.id}`" v-for="user in clickedUser[XXX]" :key="user.uID">
            {{user.name}}
            <img height='75px' width='75px' :src='user.profileURL'>
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
