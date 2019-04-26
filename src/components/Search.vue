<template>
  <transition name="slide-fade">
    <div class="searchContainer" v-if="showSearch">
      <div
        :class="{'mixSearch': divExpands[0]==0 , 'expandedDiv': divExpands[0]==1, 'hiddenDiv': divExpands[0]==-1 }"
      >
        <ais-instant-search :search-client="searchClient" index-name="mixes">
          
          <ais-configure v-if="divExpands[0]==0" :hitsPerPage="10"/>
          <ais-configure v-if="divExpands[0]==1" :hitsPerPage="25"/>
          <ais-search-box
            placeholder="Search here…"
            style="display: none;"
            v-if="searchQuery"
            v-model="searchQuery"
            class="searchbox"
            hitsPerPage="5"
          />
          <div class="header" style="padding-left:15px;">
            Mixes
            <v-icon @click="expandDiv(0)">expand_more</v-icon>
          </div>
          <ais-hits>
            <template slot="item" slot-scope="{ item }">
              <transition name="slide-fade">
                <mixTile :object="item"></mixTile>
              </transition>
            </template>
          </ais-hits>
          <ais-pagination/>
        </ais-instant-search>
      </div>

      <div
        :class="{'producerSearch': divExpands[1]==0 , 'expandedDiv': divExpands[1]==1, 'hiddenDiv': divExpands[1]==-1 }"
      >
        <ais-instant-search :search-client="searchClient" index-name="producers">
          <ais-configure v-if="divExpands[1]==0" :hitsPerPage="10"/>
          <ais-configure v-if="divExpands[1]==1" :hitsPerPage="25"/>
          <ais-search-box
            placeholder="Search here…"
            style="display: none;"
            v-if="searchQuery"
            class="searchbox"
            v-model="searchQuery"
          />
          <div class="producerSearchResults">
            <div class="header" style="padding-left:30px;">
              Producers
              <v-icon @click="expandDiv(1)">expand_more</v-icon>
            </div>
            <div class="producerResults">
              <ais-hits class="producerAISResults">
                <template slot="item" slot-scope="{ item }">
                  <producerTile :object="item"></producerTile>
                </template>
              </ais-hits>
            </div>
          </div>
        </ais-instant-search>
      </div>

      <div
        :class="{'eventSearch': divExpands[2]==0 , 'expandedDiv': divExpands[2]==1, 'hiddenDiv': divExpands[2]==-1 }"
      >
        <ais-instant-search :search-client="searchClient" index-name="events">
          <ais-configure v-if="divExpands[2]==0" :hitsPerPage="10"/>
          <ais-configure v-if="divExpands[2]==1" :hitsPerPage="25"/>
          <ais-search-box
            style="display: none;"
            placeholder="Search here…"
            class="searchbox"
            v-if="searchQuery"
            v-model="searchQuery"
          />
          <div class="producerSearchResults">
            <div class="header" style="padding-left:30px;">
              Events
              <v-icon @click="expandDiv(2)">expand_more</v-icon>
            </div>
            <div class="producerResults">
              <ais-hits class="eventsAISResults">
                <template slot="item" slot-scope="{ item }">
                  <eventTile :object="item"></eventTile>
                </template>
              </ais-hits>
            </div>
          </div>
        </ais-instant-search>
      </div>

      <div
        :class="{'seriesSearch': divExpands[3]==0 , 'expandedDiv': divExpands[3]==1, 'hiddenDiv': divExpands[3]==-1 }"
      >
        <ais-instant-search :search-client="searchClient" index-name="shows">
          <ais-configure v-if="divExpands[3]==0" :hitsPerPage="10"/>
          <ais-configure v-if="divExpands[3]==1" :hitsPerPage="25"/>
          <ais-search-box
            placeholder="Search here…"
            style="display: none;"
            class="searchbox"
            v-if="searchQuery"
            v-model="searchQuery"
          />
          <div class="producerSearchResults">
            <div class="header" style="padding-left:30px;">
              Shows
              <v-icon @click="expandDiv(3)">expand_more</v-icon>
            </div>
            <div class="producerResults">
              <ais-hits class="producerAISResults">
                <template slot="item" slot-scope="{ item }">
                  <showTile :object="item"></showTile>
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
import algoliasearch from "algoliasearch/lite";
import createPlaylistMixin from "../mixins/createPlaylistMixin";
import selectedUserMixin from "../mixins/selectedUserMixin";
import mixMixin from "../mixins/mixMixin";
import { mapGetters } from "vuex";
import mixTile from "@/components/mixTile.vue";
import showTile from "@/components/showTile.vue";
import eventTile from "@/components/eventTile.vue";
import producerTile from "@/components/producerTile.vue";
import Vue from "vue";

export default {
  components: {
    mixTile,
    showTile,
    eventTile,
    producerTile
  },

  data() {
    return {
      searchClient: algoliasearch(
        "A86V2VQNIW",
        "61c79176d7f5afdda01825fd663f521b"
      ),
      stream: [],
      divExpands: [0, 0, 0, 0]
    };
  },

  mixins: [createPlaylistMixin, selectedUserMixin, mixMixin],

  methods: {
    clickedTitle(mID, producer, title) {
      this.$store.commit("setShowSearch", false);
      this.setSelectedmID(mID);
      this.$router.push(
        `/users/${producer.split(" ").join("_")}/mixes/${title
          .split(" ")
          .join("_")}`
      );
      this.searchQuery = "";
    },

    clickedProducer(uID, name) {

      this.$store.commit("setShowSearch", false);
      this.navigateUser(uID, name);
      this.searchQuery = "";
    },

    expandDiv(x) {
      if (this.divExpands[x] == 1) {
        this.divExpands.forEach((entry, i) => {
          Vue.set(this.divExpands, i, 0);
        }); // Set all to 0
      } else {
        this.divExpands.forEach((entry, i) => {
          if (i == x) {
            Vue.set(this.divExpands, i, 1);
          } else {
            Vue.set(this.divExpands, i, -1);
          }
        });
      }
    }
  },

  computed: {
    ...mapGetters({
      profileURL: "profileURL",
      uID: "uID",
      name: "name",
      clickeduID: "clickeduID",
      selectedUser: "selectedUser",
      customer: "customer",
      searchQuery: "searchQuery",
      showSearch: "showSearch"
    })
  }
};
</script>



<style>
.searchContainer {
  background-color: rgba(90, 150, 168, 0.637);
  height: 96vh;
  width: 96.3vw;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.producerResultsCard {
  margin-left: 15px;
  line-height: 30px;
}

.producerResults {
  height: 100% !important;
}

.producerAISResults {
  height: 100%;
}

.expandedDiv {
  margin-left: 3px;
  margin-top: 35px;
  background-color: rgba(197, 6, 6, 0.8);
  grid-row: 1/-1;
  grid-column: 1/-1;
  max-height: 100%;
}

.hiddenDiv {
  display: none;
}

.producerSearchResults {
  height: 100%;
}

.ais-Hits {
  gap: 100px;
  display: inline-flex;
  width: 100%;
  height: 100%;
  contain: content;
}

.producerResultsInfo {
  margin-left: 10px;
  margin-right: 10px;
}

ol li {
  list-style-type: none;
  color: blue;
}

.ais-Hits-item {
  margin-left: 10px;
  height: 100px !important;
  margin-bottom: 5px;
}
.ais-Hits-item:hover {
  -webkit-box-shadow: 0 3px 8px rgba(255, 255, 255, 0.65);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.ais-InstantSearch {
  height: 100% !important;
}

.ais-Hits-list {
  margin-top: 15px;
  display: inline-flex;
  flex-wrap: wrap;
  /* gap: 1rem; */
  max-height: 100% !important;
  width: 100%;
  height: 100% !important;
}

.searchMixInfo {
  width: 100%;
  margin-left: 10px;
}

.mixSearch {
  margin-left: 3px;
  margin-top: 35px;
  background-color: rgba(229, 192, 192, 0.8);
  grid-row: 1/2-aa;
  grid-column: 1/2;
  max-height: 100%;
}
.producerSearch {
  margin-right: 30px;
  margin-top: 35px;
  background-color: rgba(229, 192, 192, 0.8);
  grid-row: 1/2;
  grid-column: 2/3;
}
.eventSearch {
  margin-top: 5px;
  margin-left: 3px;
  background-color: rgba(229, 192, 192, 0.8);
  grid-row: 2/3;
  grid-column: 1/2;
}
.seriesSearch {
  margin-top: 5px;
  margin-right: 30px;
  background-color: rgba(229, 192, 192, 0.8);
  grid-row: 2/3;
  grid-column: 2/3;
}

.searchIcons {
  display: inline-flex;
  width: 100%;
}

body,
h1 {
  margin: 0;
  padding: 0;
  background-color: rgb(232, 225, 225);
}

.headline {
  font-size: 15px !important;
  line-height: 20px !important;
}

.subInfo {
  font-size: 10px !important;
  line-height: 20px;
}

.searchTitleImage {
  max-height: 75px !important;
}

.v-image__image--contain {
  background-size: cover;
}

.titleResultsCard {
  max-height: 100%;
  width: 350px;
  padding-right: 30px;
}

.titleResultsCard {
  height: 100%;
  width: 100%;
}

.v-card__title--primary {
  padding-top: 0px !important;
}

.v-card__title {
  padding: 0px !important;
}

element.style {
  max-height: 100px !important;
}

.search-panel {
  background-color: rgb(232, 225, 225);
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
}

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
