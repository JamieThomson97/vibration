<template>
<div class="searchContainer" v-if='showSearch' >
     <div class="mixSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="searchResults">
              
               <div class="titleResults">
                 <div class="header">Mixes</div>
                 
                 
                <ais-hits > 
                  <template slot="item" slot-scope="{ item }">
                    <v-card color="cyan darken-2" class="white--text titleResultsCard" elevation='10'>
                      <v-layout>
                        <v-flex xs5>
                          <v-img 
                            class = 'searchTitleImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            contain
                          ></v-img>
                        </v-flex>
                        <v-flex xs7>
                          <v-card-title primary-title>
                            <div>
                              <!-- :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`" -->
                              <div class="headline" @click='clickedTitle(item.objectID , item.producer , item.title)' ><ais-highlight :hit="item" attribute="title" /></div>
                              <div  class="headline" @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div  class='subInfo'><ais-highlight :hit="item" attribute="dateUploaded"/></div>
                              <div class='subInfo'><ais-highlight :hit="item" attribute="series" /></div>
                               <div class='subInfo'><ais-highlight :hit="item" attribute="uID" /></div>
                            </div>
                          </v-card-title>
                            <div class="searchIcons"><v-icon>watch_later</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>playlist_add</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>favorite_border</v-icon>
                            </div>
                          
                        </v-flex>
                      </v-layout>
                      <v-divider light></v-divider>
                      
                    </v-card>
                  </template>
                </ais-hits>
                
              </div>
            
            </div>
       </ais-instant-search>
     </div>
     <div class="producerSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="producerSearchResults">
              <div class="header">Producers</div>
               <div class="producerResults">
                 
                <ais-hits > 
                  <template slot="item" slot-scope="{ item }">
                    <v-card color="cyan darken-2" class="white--text titleResultsCard" elevation='10'>
                      <v-layout>
                        <v-flex xs5>
                          <v-img 
                            class = 'searchTitleImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            containzout
                          ></v-img>
                          
                        </v-flex>
                        <v-flex xs7>
                          <v-card-title primary-title>
                            <div>
                              <!-- :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`" -->
                              <div class="headline" @click='clickedTitle(item.objectID , item.producer , item.title)' ><ais-highlight :hit="item" attribute="title" /></div>
                              <div @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div><ais-highlight :hit="item" attribute="dateUploaded"/></div>
                              <div><ais-highlight :hit="item" attribute="event" /></div>
                              
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      <v-divider light></v-divider>
                      
                    </v-card>
                  </template>
                </ais-hits>
                
              </div>
            
            </div>
       </ais-instant-search>
     </div>
     <div class="seriesSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="searchResults">
              <div class="header">Series</div>
               <div class="titleResults">
                 
                <ais-hits > 
                  <template slot="item" slot-scope="{ item }">
                    <v-card color="cyan darken-2" class="white--text titleResultsCard" elevation='10'>
                      <v-layout>
                        <v-flex xs5>
                          <v-img 
                            class = 'searchTitleImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            contain
                          ></v-img>
                        </v-flex>
                        <v-flex xs7>
                          <v-card-title primary-title>
                            <div>
                              <!-- :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`" -->
                              <div class="headline" @click='clickedTitle(item.objectID , item.producer , item.title)' ><ais-highlight :hit="item" attribute="title" /></div>
                              <div @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div><ais-highlight :hit="item" attribute="dateUploaded"/></div>
                              <div><ais-highlight :hit="item" attribute="event" /></div>
                            </div>
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      <v-divider light></v-divider>
                      <v-card-actions class="pa-3">
                      <v-icon>watch_later</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>playlist_add</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>favorite_border</v-icon>
                      </v-card-actions>
                    </v-card>
                  </template>
                </ais-hits>
              </div>
            
            </div>
       </ais-instant-search>
     </div>
     <div class="eventSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="producerSearchResults">
              <div class="header">Event</div>
               <div class="producerResults">
                <ais-hits > 
                  <template slot="item" slot-scope="{ item }">
                    <v-card color="cyan darken-2" class="white--text titleResultsCard" elevation='10'>
                      <v-layout>
                        <v-flex xs5>
                          <v-img 
                            class = 'searchTitleImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            containzout
                          ></v-img>
                        </v-flex>
                        <v-flex xs7>
                          <v-card-title primary-title>
                            <div>
                              <!-- :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`" -->
                              <div class="headline" @click='clickedTitle(item.objectID , item.producer , item.title)' ><ais-highlight :hit="item" attribute="title" /></div>
                              <div @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div><ais-highlight :hit="item" attribute="dateUploaded"/></div>
                              <div><ais-highlight :hit="item" attribute="event" /></div>
                            </div>
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      <v-divider light></v-divider>
                      <v-card-actions class="pa-3">
                      <v-icon>watch_later</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>playlist_add</v-icon>
                        <v-spacer></v-spacer>
                        <v-icon>favorite_border</v-icon>
                      </v-card-actions>
                    </v-card>
                  </template>
                </ais-hits>
                
              </div>
            
            </div>
       </ais-instant-search>
     </div>

  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import userMixin from '../mixins/userMixin'
import mixMixin from '../mixins/mixMixin'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      searchClient: algoliasearch(
        'P37603ZCU7',
        '77a30f217b5763c36e99ed23dcf0e555'
      ),
      stream : [],
      localsearchQuery : '',
    };
  },

  mixins: [
        createPlaylistMixin,
        userMixin,
        mixMixin
    ],

    methods: {

      clickedTitle(mID , producer, title){
        
        this.setClickedmID(mID)
        this.$router.push(`/users/${(producer).split(' ').join('_')}/mixes/${(title).split(' ').join('_')}`)
        this.localsearchQuery = ''
      },

      clickedProducer(uID, name){
        this.setClickeduID(uID)
        this.$router.push(`/users/${(name).split(' ').join('_')}`)
        this.localsearchQuery = ''
      }
      
      
    },

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
            customer: 'customer',
            searchQuery: 'searchQuery',
            showSearch : 'showSearch'
        }),
    },
}
</script>



<style>

.searchContainer{
  background-color: red;
  height: 100vh; 
  width : 94.55vw;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns : 1fr 1fr;
  grid-template-rows : 1fr 1fr;
}  

.ais-Hits{
  
  width: 100%;
  height: 100%;
  contain:content;
  
}

.ais-Hits-item{
  margin-left: 5px;
  width: 45%;
  height: 100px!important;
  margin-bottom: 5px;
}
.ais-Hits-item:hover{
  -webkit-box-shadow: 0 3px 8px rgba(255, 255, 255, 0.65);
}

.ais-Hits-list{
  display: inline-flex;
  flex-wrap: wrap;
  /* gap: 1rem; */
  max-height: 100% !important;
  width: 100%;
}

.mixSearch{
  margin-left: 3px;
  margin-top: 35px;
  background-color: rgba(43,77,147, 0.9);
  grid-row: 1/2;
  grid-column: 1/2;
  max-height: 100%;
  /* display: flex;
  flex-direction: row; */
}
.producerSearch{
  margin-right: 30px;
  margin-top: 35px;
  background-color: green;
  grid-row: 1/2;
  grid-column: 2/3;
}
.eventSearch{
  margin-top: 5px;
  margin-left: 3px;
  background-color: grey;
  grid-row: 2/3;
  grid-column: 1/2;
}
.seriesSearch{
  margin-top: 5px;
  margin-right: 30px;
  background-color: purple;
  grid-row: 2/3;
  grid-column: 2/3;
}

.searchIcons{
  display: inline-flex;
  width: 100%;
}

body,
h1 {
  margin: 0;
  padding: 0;
  background-color:rgb(232, 225, 225);
}

.headline {
  font-size:15px!important;
  line-height: 15px !important;
  
}

.subInfo{
  font-size:10px!important;
}

.searchTitleImage{
  max-height: 100px !important;
}

.v-image__image--contain {
    background-size: cover;
}


.titleResultsCard{
  max-height: 100%;
  width: 100%;
}

.v-card__title--primary {
    padding-top: 0px!important;
}

.v-card__title {
    padding:0px!important;
}


element.style {
    max-height: 100px!important;
}

/* .header {
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 0.5rem 1rem;
  background-image: linear-gradient(to right, #4dba87, #2f9088);
  color: #fff;
  margin-bottom: 1rem;
}

.header a {
  color: #fff;
  text-decoration: none;
}

.header-title {
  font-size: 1.2rem;
  font-weight: normal;
}

.header-title::after {
  content: ' ▸ ';
  padding: 0 0.5rem;
}

.header-subtitle {
  font-size: 1.2rem;
} */



.search-panel {
  background-color:rgb(232, 225, 225);
  display: flex;
}

.search-panel__filters {
  flex: 1;
  margin-right: 1em;
}

.search-panel__results {
  flex: 3;
}

.searchbox {
  
  padding-left: 25px;
  position:absolute;
  top:0;
  left:0;
  width: 100vw;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
