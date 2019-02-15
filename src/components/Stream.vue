<template>
    <v-app>
        <div class="streamWrapper">
            <v-container class="my-5">
                <div class='entry'>
                    <v-card class="flat mt-2 pa-3" v-for='mix in mixStream' v-bind:key='mix.id'>
                        <v-layout class="row">    
                            
                                <v-img class='artwork' :aspect-ratio="1/1" contain max-height='70px' max-width='70px' :src="mix.artworkURL">
                                    <div class=" title caption grey--text">{{mix.Title}}</div>
                                </v-img>
                            
                            
                                <div class="caption grey--text">{{mix.Artist}}</div>
                            
                            
                                <div class="caption grey--text">{{mix.readabaleDate}}</div>
                            
                        </v-layout>
                    </v-card>
                </div>
            </v-container>
        </div>
    </v-app>
</template>

<script>

import firebase from 'firebase'

export default {



    data(){
        return {
            mixStream: [],
            i: 0,
        }
    },

    created(){

    firebase.firestore().collection('mixes').onSnapshot((response) => {
      const changes = response.docChanges()
      changes.forEach(change => {
          
          if(change.type === 'added'){
            console.log(change.doc.data().artworkURL)
            const d = new Date(change.doc.data().dateRecorded.seconds*1000);
            const n = d.toLocaleDateString('en-GB', { timeZone: 'UTC' });
              this.mixStream.push({
                  ...change.doc.data(),
                  id: change.doc.id,
                  readabaleDate: n
              })
          }
      })
    })
    console.log("Stream Created")
    
  },

  computed:{
     
    },

    methods: {
      
    },

}
</script>

<style>
    .streamWrapper{
      display:grid;
      grid-template-rows: repeat(1fr, 4);
      grid-template-columns: repeat(1fr, 3);
      grid-gap:2em;
      justify-items:stretch;
      align-items:stretch;
      
    }

    .entry{
        display: flex;
    }

    .artwork{
        border: 1px solid salmon;
    }

    .title{
        background-color: rgb(83, 152, 172);
    }


</style>