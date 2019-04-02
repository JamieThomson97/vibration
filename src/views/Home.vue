<template>

  <div class="homeWrapper">
    <div class='searchBox'>
      <v-text-field v-model='searchQuery'  box clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
    </div>
    <div class="outline timeline">
      <div>
        <Stream pagePart="timeline" passedUser = 'customer'/>
      </div>
    </div>
    <div class="outline history">
      <Stream pagePart="History"  passedUser = 'customer'/>      
    </div>
    <div class="outline listenLater">
      <Stream pagePart="Listen Later"  passedUser = 'customer'/>      
    </div>
    <div class="outline homePlaylists">
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
      
      next('/landing')
    } else {
      if ((storage.customer.uID) == null) {
        next('/landing')
        
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
      searchQuery :''
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

  watch: {
    searchQuery: function (newValue) {
      if(newValue == null){
        this.$store.commit( 'setShowSearch' , false)
      }else{
        this.$store.dispatch('actionSetSearchQuery', newValue)
      }
    },
  },


}

</script>

<style> 

    .homeWrapper{
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1.5fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap: 4em;
      height: 100vh;
      background-color:rgb(232, 225, 225);
      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 97%;
    }

    .header{
      margin-left: 15px;
      font-size: 50px;
      color:rgb(252, 250, 250);
      flex-basis: 100%;
    }
    
    .timeline{
      
      grid-column:1/2;
      grid-row: 2/12;
      background-color : rgba(229, 192, 192, 0.8);
      -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);
      
    }

    .history{      

      background-color : rgb(192, 222, 229);
      grid-column:3/4;
      grid-row:7/12;
      padding-right: 1rem;
      -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);
    }

    .listenLater{
      
      grid-column: 2/3;
      grid-row: 7/12;
      background-color : rgb(192, 222, 229);
      -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);      
    }

    .homePlaylists{
      padding-right: 1rem;
      grid-column:2/4;
      grid-row :2/7;
      background-color : rgb(192, 222, 229);
      -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .45);
    }
    
  </style>



