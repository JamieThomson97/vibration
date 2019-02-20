<template>
    <v-app>
        <div class="">
            <v-container class="my-5">
                <div class="streamWrapper">
                    <div class="flat tile entry" v-for='mix in stream' v-bind:key='mix.id'>
                        <v-img class='artwork' :aspect-ratio="1/1" contain height='100%' width='100%' :src="mix.artworkURL"></v-img>
                        <div class="title caption grey--text">{{mix.title}}</div>
                        <div class="artist  grey--text">{{mix.artist}}</div>
                        <div class="length  grey--text">{{mix.dateRecorded}}</div>
                    </div>
                </div>
            </v-container>
        </div>
    </v-app>
</template>

<script>

//import firebase from 'firebase'

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
    },

    computed:{
        stream(){
            if(this.pagePart == "timeline"){
                return this.$store.getters.Stream_Timeline
             }else if(this.pagePart == "history"){
                return this.$store.getters.Stream_History
            }else if(this.pagePart == "listenLater"){
                return this.$store.getters.Stream_ListenLater
            }else{
                return "null"
            }
        }  
        
    },

    methods: {
        
    },

}
</script>

<style>

    .streamWrapper{

        height: 100%;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(auto-fit, minmax(
            180px, 1fr
        ));
         grid-gap:2rem;    
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
        max-height: 150px;
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