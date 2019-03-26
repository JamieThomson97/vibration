<template>

  
  <div class="tempWrapper">
    <div class="tempbox tempstream">
      <div>
        <div>Timeline</div>
        
      </div>
    </div>
    <div class="tempbox templistened">
      <div>History</div>
      
    </div>
    <div class="tempbox temprecommended">
      <div>Listen Later</div>
      
    </div>
    <div class="tempbox playlists">Playlists</div>
    <div class="tempbox tempplayer">Player</div>
  </div>
  

</template>

<script>


export default {


  components: {
    

  },

  props: {
    pagePart: {
      type: String,
      required: false,
      
    }
  },

  methods: {

  },

  data() {
    return {
      expand: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    },
  },

  created: function () {

      
  }


}

</script>

<style>

    .tempWrapper{
      display: grid;
      grid-template-columns: 2.5fr 3.5fr 3fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 1em;
      height: 100%
    }
    
    .tempstream{
      
      grid-column:2/3;
      grid-row: 2/10;
      border:1px solid #333;
      
      
    }

    .templistened{      
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:4/6;
      border:1px solid #333;
    }

    .temprecommended{
      margin-left: 1rem;
      grid-column:1/2;
      grid-row: 7/9;      
      border:1px solid #333;
    }

    .playlists{
      
      margin-right: 1rem;
      grid-column:3/4;
      grid-row :4/7;
      
      border:1px solid #333;
    }

    .tempplayer{
      
      margin  : 1rem;
      grid-column:1/-1;
      grid-row: 11/13;
      border:1px solid #333;
      
    }
  </style>

