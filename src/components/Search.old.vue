<template>
<transition name = 'fade'>
<div class="searchContainer" v-if='showSearch' >
     <div class="mixSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="searchResults">
              
               <div class="titleResults">
                 <div class="header" style='padding-left:15px;'>Mixes <v-icon >
                expand_more
                </v-icon></div>
                 
                 
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
                          <v-divider></v-divider>
                        <div class="searchIcons">
                          <v-icon>watch_later</v-icon>
                          <v-spacer></v-spacer>
                          <v-icon>playlist_add</v-icon>
                          <v-spacer></v-spacer>
                          <v-icon>favorite_border</v-icon>
                        </div>
                        </v-flex>
                        <v-flex xs7>
                          <v-card-title primary-title>
                            <div class='searchMixInfo'>
                              <!-- :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`" -->
                              <div class="headline" style='color:black;' @click='clickedTitle(item.objectID , item.producer , item.title)' ><ais-highlight :hit="item" attribute="title" /></div>
                              <v-divider light></v-divider>
                              <div  class="headline" style='color:black;' @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div  class='subInfo' style='color:black;'><ais-highlight :hit="item" attribute="dateUploaded"/></div>
                              <div class='subInfo' style='color:black;'><ais-highlight :hit="item" attribute="series" /></div>
                              <div class='subInfo' style='color:black;'><ais-highlight :hit="item" attribute="uID" /></div>
                            </div>
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

     <div class="producerSearch">
      <ais-instant-search
        :search-client="searchClient"
        index-name="producers"
      >
            <!-- <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/> -->
            <div class="producerSearchResults">
              <div class="header" style='padding-left:30px;'>Producers<v-icon >
                expand_more
                </v-icon></div>
               <div class="producerResults">
                 
                <ais-hits class='producerAISResults' > 
                  <template slot="item" slot-scope="{ item }">
                    
                    <v-card color="cyan darken-2" class="producerResultsCard" elevation='10'>
                      <v-layout column="true">
                        <v-flex xs5>
                          <v-img 
                            class = 'searchProducerImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            containzout
                          ></v-img>
                        </v-flex>
                       <v-card-title primary-title>
                            <div>
                              <div class='producerResultsInfo' @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div class='producerResultsInfo'>Followers : <ais-highlight :hit="item" attribute="followerCount" /></div>
                              <div class='producerResultsInfo'>Following : <ais-highlight :hit="item" attribute="followingCount"/></div>
                            </div>
                          </v-card-title>
                        
                      </v-layout>
                      
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
              <div class="header" style='padding-left:30px;'>
                Events
                <v-icon >
                expand_more
                </v-icon>
              </div>
               <div class="producerResults">
                 
                <ais-hits class='producerAISResults' > 
                  <template slot="item" slot-scope="{ item }">
                    
                    <v-card color="cyan darken-2" class="producerResultsCard" elevation='10'>
                      <v-layout column="true">
                        <v-flex xs5>
                          <v-img 
                            class = 'searchProducerImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            containzout
                          ></v-img>
                        </v-flex>
                       <v-card-title primary-title>
                            <div>
                              <div class='producerResultsInfo' @click='clickedProducer(item.uID , item.producer)'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div class='producerResultsInfo'>Dates : XXX</div>
                              <div class='producerResultsInfo'>Location : XXX</div>
                            </div>
                          </v-card-title>
                        
                      </v-layout>
                      
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
            <div class="producerSearchResults">
              <div class="header" style='padding-left:30px;'>Series<v-icon >
                expand_more
                </v-icon></div>
               <div class="producerResults">
                 
                <ais-hits class='producerAISResults' > 
                  <template slot="item" slot-scope="{ item }">
                    
                    <v-card color="cyan darken-2" class="producerResultsCard" elevation='10'>
                      <v-layout column="true">
                        <v-flex xs5>
                          <v-img 
                            class = 'searchProducerImage'
                            @click="handleClickTrack(item,item.objectID)"
                            :src="item.artworkURL"
                            height="125px"
                            containzout
                          ></v-img>
                        </v-flex>
                       <v-card-title primary-title>
                            <div>
                              <div class='producerResultsInfo'><ais-highlight :hit="item" attribute="producer" /></div>
                              <div class='producerResultsInfo'>Artists : XXX</div>
                              <div class='producerResultsInfo'>Entries : XXX</div>
                            </div>
                          </v-card-title>
                        
                      </v-layout>
                      
                    </v-card>
                  
                  </template>
                </ais-hits>
                
              </div>
            
            </div>
       </ais-instant-search>
     </div>
     

  </div>
</transition>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import selectedUserMixin from '../mixins/selectedUserMixin'
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
        selectedUserMixin,
        mixMixin
    ],

    methods: {

      clickedTitle(mID , producer, title){
        
        this.setSelectedmID(mID)
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
            selectedUser : 'selectedUser',
            customer: 'customer',
            searchQuery: 'searchQuery',
            showSearch : 'showSearch'
        }),
    },
}


</script>



<style>

.searchContainer{
 background-color:rgba(90, 150, 168, 0.637);  
 height: 96vh; 
  width : 96.3vw;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns : 1fr 1fr;
  grid-template-rows : 1fr 1fr;
}  


.producerResultsCard{
  margin-left:15px;
  line-height: 30px;

}

.producerResults{
  height: 100%!important;
}

.producerAISResults{
  height:100%;
}


.producerSearchResults{
  height:100%;
}

.ais-Hits{
  gap: 100px;
  display: inline-flex;
  width: 100%;
  height: 100%;
  contain:content;
  
}

.producerResultsInfo{
  margin-left: 10px;
  margin-right: 10px;
}

ol li{
  
  list-style-type: none;
  color:blue;
}

.ais-Hits-item{
  
  margin-left: 10px;
  height: 100px!important;
  margin-bottom: 5px;
}
.ais-Hits-item:hover{
  -webkit-box-shadow: 0 3px 8px rgba(255, 255, 255, 0.65);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.ais-InstantSearch{
  height: 100% !important;
}

.ais-Hits-list{
  display: inline-flex;
  flex-wrap: wrap;
  /* gap: 1rem; */
  max-height: 100% !important;
  width: 100%;
  height: 100% !important;
}

.searchMixInfo{
  width:100%;
  margin-left:10px;
}

.mixSearch{
  margin-left: 3px;
  margin-top: 35px;
  background-color : rgba(229, 192, 192, 0.8);
  grid-row: 1/2;
  grid-column: 1/2;
  max-height: 100%;
}
.producerSearch{
  margin-right: 30px;
  margin-top: 35px;
  background-color : rgba(229, 192, 192, 0.8);
  grid-row: 1/2;
  grid-column: 2/3;
}
.eventSearch{
  margin-top: 5px;
  margin-left: 3px;
  background-color : rgba(229, 192, 192, 0.8);
  grid-row: 2/3;
  grid-column: 1/2;
}
.seriesSearch{
  margin-top: 5px;
  margin-right: 30px;
  background-color : rgba(229, 192, 192, 0.8);
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
  line-height: 20px !important;
  
  
}

.subInfo{
  font-size:10px!important;
  line-height: 20px;;
}

.searchTitleImage{
  max-height: 75px !important;
}

.v-image__image--contain {
    background-size: cover;
}


.titleResultsCard{
  max-height: 100%;
  width: 350px;
  padding-right:30px;
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
