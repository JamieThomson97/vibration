<template>

  <div class="homeWrapper">
    <div class="outline timeline">
      <div>
        <div>Timeline</div>
        <Stream pagePart="timeline" passedUser = 'customer'/>
      </div>
    </div>
    <div class="outline history">
      <div>History</div>
      <Stream pagePart="History"  passedUser = 'customer'/>      
    </div>
    <div class="outline recommended">
      <div>Listen Later</div>
      <Stream pagePart="Listen Later"  passedUser = 'customer'/>      
    </div>
    <div class="outline playlists">
      <div>Playlists</div>
      <div>
        <playlists />
      </div>

    </div>
  </div>

  
  <!-- <div class="wrapper">

    27/03/19 Notes
    
    - Listen later playlist is tempremental and needs fixing
    - Need to add delete functionality for mixes in playlists also (massive cunt ache)
    - Add general "add to playlist button" , that expands to a youtube style list showing the available playlists to add to and an option to create a new playlist 
    - Work out saving the customer object to state and the effect this has on updating playlist behaivour

  </div> -->
  

</template>

<script>

import createPlaylistMixin from '../mixins/createPlaylistMixin'
//import createStreamMixin from '../mixins/createStreamMixin'
import { mapGetters } from 'vuex'
import Stream from '@/components/Stream.vue'
import playlists from '@/components/playlists.vue'
import 'vuejs-noty/dist/vuejs-noty.css'

export default {

  beforeRouteEnter(to, from, next) {
    var storage  = (JSON.parse(localStorage.getItem('vuex')))
    if(!storage) {
      
      next('/about')
    } else {
      if ((storage.customer.uID) == null) {
        next('/about')
        
      } else {
        next()
      }
    }

  },

  components: {
    Stream,
    playlists,
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
    }
  },

  mixins: [
    createPlaylistMixin
  ],

  computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
            customer: 'customer',
        }),

        allPlaylists(){
          return this.customer.prePlaylists.concat(this.customer.createdPlaylists)
        }
            
    },

  created: function () {
    //Fetch timeline 
    const timeline = this.getTimeline()

    timeline.then(response => {
    //Dispatch to save in state
    this.$store.commit("setPlaylist", {
              object: response,
              name: 'timeline'
            })  
    })
    
    this.allPlaylists.forEach(component => {
      var mixes = this.getPlaylist(component , 4) //for is limit for db return 
      mixes.then(response => {
          //Dispatch to save in state
          this.$store.commit("setPlaylist", {
                    object: response,
                    name: component
                  })  
          })
      })
  },


}

</script>

<style>

    .homeWrapper{
      display: grid;
      grid-template-columns: 2.5fr 3.5fr 3fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 1em;
      height: 100%
    }
    
    .timeline{
      
      grid-column:2/3;
      grid-row: 2/10;
      border:1px solid #333;
      
      
    }

    .history{      
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:3/6;
      border:1px solid #333;
    }

    .recommended{
      margin-left: 1rem;
      grid-column:1/2;
      grid-row: 7/10;      
      border:1px solid #333;
    }

    .playlists{
      
      margin-right: 1rem;
      grid-column:3/4;
      grid-row :4/7;
      
      border:1px solid #333;
    }
    
  </style>



