<template>

  
  <div class="wrapper">
    <div class="box stream">
      <div>
        <div>Timeline</div>
        
      </div>
    </div>
    <div class="box listened">
      <div>History</div>
      
    </div>
    <div class="box recommended">
      <div>Listen Later</div>
      
    </div>
    <div class="box right">Something on the Right (maybe list of playlists)</div>
    <div class="box player">Player</div>
  </div>
  

</template>

<script>


export default {

  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem('vuex')) {
      console.log("doesnt exist")
      next('/about')
    } else {
      if ((JSON.parse(localStorage.getItem('vuex')).user) == null) {
        next('/about')
        console.log("property is NULL")
      } else {
        next()
      }
    }

  },

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

    .wrapper{
      display: grid;
      grid-template-columns: 2.5fr 3.5fr 3fr;
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

