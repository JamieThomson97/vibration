<template>
  <v-dialog max-width="900px" color='#CFD8DC'>
    <v-btn slot="activator">Update Tracklist</v-btn>
    <v-card color='#CFD8DC' class='tracklistPopupCard'>
      <v-card-title>
        <h2 class='mixHeader'>Update Tracklist</h2>
      </v-card-title>
      <div class='tracklistText'>Tracks</div>
      <v-btn @click="numberSongs++"  class="btn">+</v-btn>
      <v-btn @click="numberSongs--" class="btn">-</v-btn>
      <v-text-field
        v-for="x in numberSongs"
        :key="x-1"
        outline
        color='#b71c1c'
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
      numberSongs: 5,
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
      //queries the 'mixes' collection using the selectedMixID
      database
        .collection("mixes")
        .doc(this.selectedMix.trackData.mID)
        .set(
          //sets the tracklist object of the returned document to the 'songs' array, which is populated with user input
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

.tracklistPopupCard{
  height: 1000px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #CFD8DC;
}



.tracklistText {
  padding-left: 15px;
  font-size: 25px;
  color: #b71c1c;
  flex-basis: 100%;
}


</style>
