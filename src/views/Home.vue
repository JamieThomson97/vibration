<template>

  <div class="homeWrapper" v-if='customer.playlists.history'>
    <div class='searchBox'>
      <v-text-field v-model='searchQuery'  box clearable type="text" v-on:keyup.enter="s"  placeholder="Search"></v-text-field>
    </div>
    <div class="outline timeline">
      <div>
        <div class='header'>Timeline</div>
        <div class="timelineTiles homeTiles" v-if='customer.playlists.timeline.length > 0'>
            <mixTile v-for='mix in customer.playlists.timeline' :key='mix.mID' :object='mix' playerTracksReference='customer.playlists.timeline'> </mixTile>
        </div>
        <div v-else style='margin-left:15px;'>
          Follow some producers to see mixes in your timeline
        </div>
      </div>
    </div>
    <div class="outline history">
      <div class='header'>History</div>
      <div class="historyTiles homeTiles" v-if='customer.playlists.history.length > 0'>
        <mixTile v-for='mix in customer.playlists.history' :key='mix.mID' :object='mix' deletable='1' collection='history' playerTracksReference='history'> </mixTile>
      </div>
      <div v-else style='margin-left:15px;'>
          Mixes you have listened to will appear here
        </div>     
    </div>
    <div class="outline listenLater">
      <div class='header'>Listen Later</div>
      <div class="listenLaterTiles homeTiles" v-if='customer.playlists.listenLater.length > 0'>
        <mixTile v-for='mix in customer.playlists.listenLater' :key='mix.mID' deletable='1' collection='listenLater' :object='mix' playerTracksReference='listenLater'> </mixTile>
      </div>
       <div v-else style='margin-left:15px;'>
          Here is a quick access playlist for easily recording mixes you want to listen to later
        </div>         
    </div>
    <div class="outline homePlaylists">
      <div v-if='customer.createdPlaylists.length > 0' >
        <playlists />
      </div> 
      <div v-else>
        <div class='header playlistHeader'>
          Playlists    
        </div>
        <div style='margin-left:15px;'>
          Create some playlists !
        </div> 
      </div>
    </div>
    <Player />    
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

import playlists from '@/components/playlists.vue'
import Player from '@/components/Player.vue'
import 'vuejs-noty/dist/vuejs-noty.css'
import mixTile from '@/components/mixTile.vue'


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
    
    Player,
    playlists,
    mixTile,
    
  },

  props: {
    pagePart: {
      type: String,
      required: false,
    },
    passedUser: {
      type: String,
      required: false,
    },
    deletable: {
      type: Number,
      required: false,
    },
    collection: {
      type: String,
      required: false,
    }
  },

  methods: {
    
  },

  data() {
    return {
      expand: false,
      searchQuery :'',
      history : null,
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
            selectedUser : 'selectedUser',
            customer: 'customer',
        }),


        allPlaylists(){
          return this.customer.prePlaylists.concat(this.customer.createdPlaylists)
        }
            
    },

  mounted: function () {
    //Fetch timeline 
    const timeline = this.getTimeline()

    timeline.then(response => {
    //Dispatch to save in state
    this.$store.commit("setPlaylist", {
              object: response,
              name: 'timeline'
            })  
    })
    console.log(this.allPlaylists)
    this.allPlaylists.forEach(component => {
      if(component !== 'timeline'){
        if(component == 'Listen Later'){
          component = 'listenLater'
        }
        console.log(component)

        var mixes = this.getPlaylist(component , 4) //for is limit for db return 
        mixes.then(response => {
            //Dispatch to save in state
            this.$store.commit("setPlaylist", {
                      object: response,
                      name: component
                    })  
            })
      }
      })

      this.mixesHistory = this.customer.playlists.History
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
      grid-template-rows: repeat(13, 1fr);
      grid-gap: 1em;
      height: 100vh;
      background-color:rgb(232, 225, 225);
      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 96%;
    }

    .homeTiles{
      margin-top: 15px;
      margin-left: 15px;
      display:inline-flex;
      flex-wrap : wrap;
      grid-gap: 1rem;
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



