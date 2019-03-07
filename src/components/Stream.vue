<template>
    <div class="streamWrapper">
        <div class="nothing" v-if="!stream">Something</div>
        <div class="flat tile entry" v-for='mix in stream.stream' v-bind:key='mix.mID'>
            <v-img class='artwork' :aspect-ratio="1/1" contain height='100%' width='100%' :src="mix.artworkURL"></v-img>
            <div class="title caption grey--text">{{mix.title}}</div>
            <div class="artist  grey--text">{{mix.artist}}</div>
            <div class="length  grey--text">{{name}}</div>
            <v-btn v-if="mix.artist == name" @click="deleteMix(mix.mID)">Delete</v-btn>
        </div>
    </div>
 </template>

<script>

import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {



    data(){
        return {
            i: 0,
        }
    },

    props: [
        "pagePart",
    ],

    created(){
        console.log(this.stream)
    },

    computed:{


        ...mapGetters([
            'uID',
            'name',
            'profileURL',
            // ...
        ]),
    
        stream(){
            return this.$store.getters.playlist(this.pagePart)          
        },

        message(){
            if(this.pagePart == "timeline"){
                return "Follow some artists to populate your stream"
             }else if(this.pagePart == "history"){
                return "This area will populate after you have listened to some mixes"
            }else if(this.pagePart == "listenLater"){
                return "Add some mixes to 'Listen Later', and they will appear here for easy access"
            }else{
                return "null"
            }
        }
        
    },

    methods: {

        deleteMix(ID){
            console.log(ID)
            var deleteMix = firebase.functions().httpsCallable('deleteMix')
            deleteMix({mID : ID , uID : this.uID}).then((response) => {
                console.log(response) 
                //Delete Locally
            }).catch((error) => {
                console.log(error)
            })
        }
        
    },

}
</script>

<style>

    .streamWrapper{
        display: grid;
        height: 10px;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fit, minmax(
            180px, 1fr
        ));
         grid-gap:0.5rem;    
    }

    .entry{
        display: grid;
    }

    .entry:nth-child(3n+1) {
        
        grid-row: auto;
        
    }
    .entry:nth-child(3n+2) {
        
        grid-row: auto;

    }
    .entry:nth-child(3n+3) {
     
        grid-row: auto;     
    }    

    .tile{
        background-color: black;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        max-height: 80px;
    }

    .artwork{
        grid-column: 1/2;
        grid-row: 1/5
    }

    .artist{
        grid-column: 2/3;
        grid-row: 2/3
    }
    
    .title{
        grid-column: 2/3;
        grid-row: 1/2
    }

    .date{
        grid-column: 2/3;
        grid-row: 3/4
    }

    .length{
        grid-column: 2/3;
        grid-row: 4/5;
    }
    

</style>