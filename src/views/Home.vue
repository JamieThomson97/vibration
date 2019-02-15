<template>

  <v-app>
    <div class="wrapper">
    <div class="box stream">
      <div>
        <Stream />
      </div>
      <div>
        Tracks
      </div> 
    </div>
    <div class="box history">History</div>
    <div class="box recommended">Recommended</div>
    <div class="box right">Something on the Right</div>
    <div class="box player">Player</div>
    </div>
  </v-app>

</template>

<script>

//import firebase from 'firebase'
  //import HelloWorld from '../components/HelloWorld'
  import Stream from '@/components/Stream.vue'

  export default {

    beforeRouteEnter (to, from, next) {
    const user = JSON.parse(localStorage.getItem('vuex')).user
    console.log(user.id)
    if(!user){
    return next ({path: '/about'})
    }else{
    next()
    }
  },

    components: {
      Stream
      //HelloWorld
    },

  data(){
    return{
      expand:false
    }
  },

  computed: {
  },

  
}

</script>

<style>
    .wrapper{
      display:grid;
      grid-template-columns: 3fr 4fr 3fr;
      grid-template-rows: repeat(1fr, 12);
      grid-gap:3em;
      justify-items:stretch;
      align-items:stretch;
      min-height: 100%;
    }

    .wrapper > div{
      background:#eee;
      padding:1em;
      
    }
    .wrapper > div:nth-child(odd){
      background:#ddd;
    }

    .stream{
      /*align-self:start;*/
      grid-column:2/3;
      grid-row:2/11;
      border:1px solid #333;
      
    }

    .history{
      /*align-self:end;*/
      grid-column:1/2;
      grid-row:3/6;
      border:1px solid #333;
    }

    .recommended{
      /*justify-self:end;*/
      grid-column:1/2;
      grid-row:6/10;
      border:1px solid #333;
    }

    .right{
      grid-column:3/4;
      grid-row:2/4;
      border:1px solid #333;
    }

    .player{
      
      grid-column:1/-1;
      grid-row:11/12;
      border:1px solid #333;
    }
  </style>

