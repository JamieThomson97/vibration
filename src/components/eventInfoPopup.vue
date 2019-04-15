<template>
  <v-dialog max-width="900px">
    <v-btn slot="activator" @click="updateEventInfo">Update Event Information</v-btn>
    <v-card>
      <v-card-title>
        <h2>Update Event Information</h2>
      </v-card-title>

      <v-layout row wrap>
        <v-flex xs12 sm6 md4>
          <v-text-field v-model="location" label="Location" prepend-icon="field" v-on="on"></v-text-field>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-menu
            ref="startMenu"
            v-model="startMenu"
            :close-on-content-click="false"
            :return-value.sync="startDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startDate"
                label="Start date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="startDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.startMenu.save(startDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-menu
            ref="endMenu"
            v-model="endMenu"
            :close-on-content-click="false"
            :return-value.sync="endDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endDate"
                label="End date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endMenu.save(endDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-btn flat class="success" @click="updateEventInfo()">Submit</v-btn>
      </v-layout>
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
      startDate: null,
      endDate: null,
      location: null
    };
  },

  methods: {
    updateEventInfo() {
      database
        .collection("events")
        .doc(this.selectedEvent.eID)
        .set(
          {
            startDate: this.startDate,
            endDate: this.endDate,
            location: this.location
          },
          {
            merge: true
          }
        );
    }
  }
};
</script>

<style>
</style>
