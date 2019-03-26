<template>

  
  <div class="wrapper">
    <div class="box stream">
      <div>
        <div>Timeline</div>
        <Stream pagePart="timeline" passedUser = 'customer'/>
      </div>
    </div>
    <div class="box listened">
      <div>History</div>
      <Stream pagePart="history"  passedUser = 'customer'/>
    </div>
    <div class="box recommended">
      <div>Listen Later</div>
      <Stream pagePart="listenLater"  passedUser = 'customer'/>
    </div>
    <div class="box right">Something on the Right (maybe list of playlists)</div>
    
  </div>
  

</template>

<script>

import createPlaylistMixin from '../mixins/createPlaylistMixin'
//import createStreamMixin from '../mixins/createStreamMixin'

import Stream from '@/components/Stream.vue'

export default {

  beforeRouteEnter(to, from, next) {
    var storage  = (JSON.parse(localStorage.getItem('vuex')))
    if(!storage) {
      console.log("doesnt exist")
      next('/about')
    } else {
      if ((storage.customer.uID) == null) {
        next('/about')
        console.log("property is NULL")
      } else {
        next()
      }
    }

  },

  components: {
    Stream

  },

  props: {
    pagePart: {
      type: String,
      required: false,
    },
    passedUser: {
      type: String,
      required: false,
    }
  },

  methods: {
    
  },

  data() {
    return {
      expand: false,
      streamComponents: ['timeline' , 'history', 'listenLater']
    }
  },

  mixins: [
    createPlaylistMixin
  ],

  computed: {
    user() {
      return this.$store.getters.user
    },
  },

  created: function () {
    this.createStream(this.streamComponents)
    
  },


}

</script>

<style>

    .wrapper{
      display: flex;
      grid-template-columns: 2.5fr 3.5fr 3fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 1em;
      
    }
    
    .stream{
      
      grid-column:1/3;
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

