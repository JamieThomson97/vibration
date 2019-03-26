<template>
<div class="container">
    
      <ais-instant-search
        :search-client="searchClient"
        index-name="test_mixes"
      >
        <div class="search-panel">
          <div class="search-panel__results">
            <ais-search-box placeholder="Search here…" class="searchbox" v-model='searchQuery'/>
            <ais-hits v-if='searchQuery.length > 3'>
              
              <template slot="item" slot-scope="{ item }">
                <v-btn @click='setClickedmID(item.objectID)' :to="`/users/${(item.producer).split(' ').join('_')}/mixes/${(item.title).split(' ').join('_')}`"><ais-highlight :hit="item" attribute="title" /></v-btn>
                <v-btn @click='setClickeduID(item.uID)' :to="`/users/${(item.producer).split(' ').join('_')}`"><ais-highlight :hit="item" attribute="producer" /></v-btn>
                <v-btn ><ais-highlight :hit="item" attribute="dateUploaded"/></v-btn>
                <v-btn ><ais-highlight :hit="item" attribute="series" /></v-btn>
                <v-btn ><ais-highlight :hit="item" attribute="event" /></v-btn>
                <v-img class='artwork' @click="handleClickTrack(item,item.objectID)" :aspect-ratio="1/1" contain height='25%' width='25%' :src="item.artworkURL"></v-img>
              </template>
            </ais-hits>

          
          </div>
        </div>
      </ais-instant-search>
     
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import userMixin from '../mixins/userMixin'
import mixMixin from '../mixins/mixMixin'

export default {
  data() {
    return {
      searchClient: algoliasearch(
        'P37603ZCU7',
        '77a30f217b5763c36e99ed23dcf0e555'
      ),
      stream : [],
      searchQuery : '',
    };
  },

  mixins: [
        createPlaylistMixin,
        userMixin,
        mixMixin
    ],

    methods: {
      
      
    }
}
</script>



<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

.header {
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-panel {
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
  margin-bottom: 2rem;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
