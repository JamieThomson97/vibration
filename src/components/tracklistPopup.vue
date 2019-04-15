<template>
  <v-dialog max-width="900px">
    <v-btn slot="activator">Update Tracklist</v-btn>
    <v-card>
      <v-card-title>
        <h2>Update Tracklist</h2>
      </v-card-title>
      <div>Tracks</div>
      <v-btn @click="numberSongs++" class="btn">+</v-btn>
      <v-text-field
        v-for="x in numberSongs"
        :key="x-1"
        outline
        type="text"
        v-model="songs[x-1]"
        placeholder
      ></v-text-field>

      <v-btn flat class="success" @click="updateTracklist">Submit</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import * as firebase from "firebase";
const database = firebase.firestore();

export default {
  computed: {
    ...mapGetters({
      profileURL: "profileURL",
      uID: "uID",
      name: "name",
      clickeduID: "clickeduID",
      selectedUser: "selectedUser",
      selectedMix: "selectedMix",
      trackData: "trackData",
      selectedEvent: "selectedEvent"
    })
  },

  data() {
    return {
      numberSongs: 1,
      songs: []
    };
  },

  watch: {
    numberSongs: function(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (newValue > oldValue) {
        this.songs.push("");
      } else {
        this.songs.pop();
      }
    }
  },

  methods: {
    updateTracklist() {
      database
        .collection("mixes")
        .doc(this.selectedMix.trackData.mID)
        .set(
          {
            tracklist: this.songs
          },
          { merge: true }
        );
    }
  }
};
</script>

<style>
</style>
