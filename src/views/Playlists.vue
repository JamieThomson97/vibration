
<template>
  <div>
    <div class="d-flex justify-between align-center mb-3">
      <div class="header" style="color:black;">Playlists</div>
    </div>

    <v-expansion-panel v-model="panel" expand>
      <v-expansion-panel-content v-for="(playlist,i) in Object.keys(customer.playlists)" :key="i">
        <template v-slot:header v-if="playlist != 'timeline'">
          <div>{{playlist}}</div>
        </template>
        <div class="playlistTileGrid">
          <mixTile
            v-for="mix in customer.playlists[playlist]"
            :key="mix.mID"
            :object="mix"
            playerTracksReference="show.mixes"
          ></mixTile>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import mixTile from "@/components/mixTile.vue";
import Vue from "vue";

export default {
  components: {
    //tracklistPopup,
    mixTile
    // showTile,
    // producerTile,
    // eventTile
  },

  computed: {
    ...mapGetters({
      profileURL: "profileURL",
      uID: "uID",
      name: "name",
      customer: "customer",
      selectedUser: "selectedUser",
      selectedMix: "selectedMix",
      event: "event",
      show: "show",
      playerCurrentTrack: "playerCurrentTrack",
      isPlay: "isPlay"
    }),

    usePlaylists() {
      var playlists = this.customer.playlists;
      Vue.delete(playlists, "timeline");
      return playlists;
    }
  },

  data() {
    return {
      panel: [],
      items: 5
    };
  },
  methods: {
    // Create an array the length of our items
    // with all values as true
    all() {
      // eslint-disable-next-line
      this.panel = [...Array(this.items).keys()].map(_ => true);
    },
    // Reset the panel
    none() {
      this.panel = [];
    }
  }
};
</script>

<style>
.v-expansion-panel__body {
  height: 50vh;
}

.playlistTileGrid {
  margin-left: 20px;
  display: flex;
  grid-gap: 1rem;
}
</style>
