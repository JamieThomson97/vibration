<template>
    <div class="wrapper">
        <form @submit.prevent="addMix" class="pt-3">
            <div class='fields' v-for="field in this.fields" :key="field.title">
                <div>{{field.name}}</div>
                <v-text-field outline type="text" v-model="field.input" placeholder=""></v-text-field>
            </div>
            <v-btn class="btn">Upload File</v-btn>
            <v-btn type=submit class="btn">Submit Mix</v-btn>
        </form>
    </div>
</template>

<script>

//add local function to calculate length of 
//mix when it is submitted then upload it with the file as metadata

//Or calc when it is downloaded from howler

import * as firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {

    data() {
        return{
            fields: [
                 { name : 'Title' , input: '' },
                 { name : 'Other Contributors' , input: '' },
                 { name : 'Tracklist' , input: '' },
                 { name: 'Series' , input: ''}
            ]
        }
    },

    computed: {

        ...mapGetters([
            'uID',
            'name',
            'profileURL',
            // ...
        ]),
      },

    methods: {
        addMix(){
            for ( var i in this.fields) {
                console.log(this.fields[i].input)
            }
            var callFunction = firebase.functions().httpsCallable('addMix');
              callFunction({title : this.fields[0].input , tracklist : this.fields[2].input , series : this.fields[3].input , producer : this.name}).then(function(result) {
                console.log(result)
            });


        }
    }
}

</script>

<style>

    .wrapper{
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 1em;
      height: 100%
    }
    
    .stream{
      
      grid-column:2/3;
      grid-row: 2/10;
      border:1px solid #333;
      
      
    }

    .listened{      
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:4/6;
      border:1px solid #333;
    }

    .recommended{
      margin-left: 1rem;
      grid-column:1/2;
      grid-row: 7/9;      
      border:1px solid #333;
    }

    .right{
      
      margin-right: 1rem;
      grid-column:3/4;
      grid-row :4/7;
      
      border:1px solid #333;
    }

    .player{
      
      margin  : 1rem;
      grid-column:1/-1;
      grid-row: 11/13;
      border:1px solid #333;
      
    }
  </style>

