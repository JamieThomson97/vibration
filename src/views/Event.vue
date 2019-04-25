<template>
  <div class="eventWrapper">
    <v-hover>
      <div class="eventImage" slot-scope="{ hover }">
        <v-img width="100%" height="100%" :src="selectedEvent.imageURL">
          <v-expand-transition>
            <div
              v-if="hover"
              class="transition-fast-in-fast-out cyan darken-2 display-3 white--text"
              style="height:100%;opacity: .4;max-width:100%!important;"
            >
              <div class="updateText">
                Update Event Image
                <br>
                <input
                  type="file"
                  @change="changeEventImage"
                  style="width:100%;"
                  accept="image/png, image/jpeg"
                  placeholder="Upload"
                  class="btn"
                >
              </div>
              <div class="updateEventInfo">
                <eventInfoPopup/>
              </div>
            </div>
          </v-expand-transition>
        </v-img>
      </div>
    </v-hover>
    <div class="eventInfo">
      <div class="eventHeader">{{selectedEvent.name}}</div>

      <div
        class="dateHeader"
        v-if="selectedEvent.startDate"
      >{{selectedEvent.startDate}} - {{selectedEvent.endDate}}</div>
      <div
        v-else
        class="noLocation"
      >Dates are yet to be set for this event , please official dates if you have sufficient permissions</div>

      <div class="location dateHeader" v-if="selectedEvent.location">
        {{selectedEvent.location}}
        <br>
      </div>
      <div
        v-else
        class="noLocation"
      >A location is yet to be set for this event , please update the location if you have sufficient permissions</div>
    </div>

    <v-hover>
      <div class="eventStream" slot-scope="{ hover }">
        <div class="headerandSearch">
          <div class="mixHeader">Mixes</div>
          <div class="userMixSearch">
            <v-fade-transition>
              <v-text-field
                v-if="hover"
                height="50%"
                color="red"
                v-model="mixSearch"
                class="eventMixSearchbox"
                solo-inverted
                clearable
                type="text"
                v-on:keyup.enter="s"
                placeholder="Search"
              ></v-text-field>
            </v-fade-transition>
          </div>
        </div>
        <div class="eventsGrid">
          <mixTile
            v-for="mix in fitleredMixes"
            :object="mix"
            playerTracksReference="events.mixes"
            :key="mix.mID"
          ></mixTile>
        </div>
      </div>
    </v-hover>
    <v-hover>
      <div class="eventArtists" slot-scope="{hover }">
        <div class="eventProducersCards">
          <div class="headerandSearch" style="min-height:100px;">
            <div class="userHeader">Producers</div>
            <div class="userMixSearch">
              <v-fade-transition>
                <v-text-field
                  v-if="hover"
                  height="50%"
                  color="red"
                  v-model="artistSearch"
                  class="eventMixSearchbox"
                  box
                  clearable
                  type="text"
                  placeholder="Search"
                ></v-text-field>
              </v-fade-transition>
            </div>
          </div>
          <div class="eventsGrid">
            <producerTile
              v-for="artist in filteredArtists"
              :object="artist"
              playerTracksReference="selectedUser.artists"
              :key="artist.uID"
            ></producerTile>
          </div>
        </div>
      </div>
    </v-hover>
  </div>

  <!-- <div class="temp">
    temp
  -->
</template>


<script>
import selectedUserMixin from "../mixins/selectedUserMixin.js";
import showMixin from "../mixins/showMixin.js";
import { mapGetters } from "vuex";
import mixTile from "@/components/mixTile.vue";
import eventInfoPopup from "@/components/eventInfoPopup.vue";
import producerTile from "@/components/producerTile.vue";

export default {
  components: {
    eventInfoPopup,
    mixTile,
    producerTile
  },

  mixins: [showMixin, selectedUserMixin],

  mounted() {
    if (this.selectedEvent.eID) {
      var eID = this.selectedEvent.eID;
    } else {
      eID = JSON.parse(localStorage.getItem("vuex")).selectedEventeID;
      console.log("eID");
      console.log(eID);
    }
    this.$store
      .dispatch("getEventDetailsID", eID)
      .then(() => {})
      .then(() => {
        var mixes = this.getEventMixes(eID);
        mixes.then(response => {
          console.log("Mounted resonse");
          console.log(response);
          //Dispatch to save in state
          this.$store.commit("setEventMixes", response);
        });
      });
  },

  data() {
    return {
      options: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      },
      mixSearch: "",
      artistSearch: "",
      newEventImage: null
    };
  },

  methods: {
    pushtoUser(name, uID) {
      this.navigateUser(uID, name);
    },

    changeEventImage(e) {
      if (
        (e.target.files[0].type == "image/jpeg") |
        (e.target.files[0].type == "image/png")
      ) {
        this.newEventImage = e.target.files[0];
        this.updateEventImage(this.selectedEvent, this.newEventImage);
      } else {
        this.$noty.error("please upload an image");
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
      selectedMix: "selectedMix",
      trackData: "trackData",
      selectedEvent: "selectedEvent"
    }),

    // inEvent(){

    //     if(this.selectedEvent.mixes){
    //         console.log('in')
    //         var inEvent = false
    //         console.log('in event')
    //         console.log()
    //         this.selectedEvent.mixes[0].producers.forEach(producer => {
    //             console.log('producer')
    //             console.log(producer)
    //             if(producer.uID == this.uID){
    //                 return true
    //             }
    //         })
    //         return isEvent
    //     }else{

    //         return 'waiting'
    //     }
    // },

    startDate() {
      return new Date(
        this.selectedEvent.startDate.seconds * 1000
      ).toLocaleDateString("en-UK", this.options);
    },
    endDate() {
      return new Date(
        this.selectedEvent.endDate.seconds * 1000
      ).toLocaleDateString("en-UK", this.options);
    },

    fitleredMixes() {
      if (this.selectedEvent.mixes) {
        if (this.selectedEvent.mixes.constructor == Array) {
          if (this.mixSearch != null) {
            return this.selectedEvent.mixes.filter(mix => {
              return mix.title
                .toLowerCase()
                .includes(this.mixSearch.toLowerCase());
            });
          } else {
            return this.event.mixes;
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    },

    filteredArtists() {
      if (this.selectedEvent.producers) {
        if (this.artistSearch != null) {
          return this.selectedEvent.producers.filter(artist => {
            return artist.name
              .toLowerCase()
              .includes(this.artistSearch.toLowerCase());
          });
        } else {
          return this.event.artists;
        }
      } else {
        return "";
      }
    }
  },

  created: function() {}

  //  return new Date(this.event.startDate.seconds * 1000).toLocaleDateString('en-UK', this.options)
};
</script>

<style>
.eventWrapper {
  display: grid;
  grid-template-columns: 2.5fr 3.5fr 3fr;
  grid-template-rows: 1fr 1fr;
  height: 100%;
  width: 96.2vw;
  background-color: white;
}

.eventInfo {
  display: block;
  overflow: auto;
  grid-column: 2/3;
  grid-row: 2/3;
  background-color: #CFD8DC;
  color: #8E24AA;
  margin-bottom: 5px;
}


.eventHeader {
  margin-left: 15px;
  font-size: 50px;
  color : #8E24AA;
  flex-basis: 100%;
}


.updateEventInfo {
  position: absolute;
  bottom: 0;
  right: 0;
}

.eventImage {
  margin-top: 5px;

  grid-column: 2/3;
  grid-row: 1/2;
}

.eventProducersCards {
  margin-left: 15px;
  display: inline-flex;
  flex-wrap: wrap;
  grid-gap: 10px;
}

.eventProducersCard {
  width: 5vw;
  height: 11vh;
}

.noLocation{
  margin-left:15px;
  font-size: 20px;
}

.eventProducerInfo {
  margin-top: 2px;
  text-align: center !important;
  color: white;
  font-weight: bold;
  width: 100%;
}

.eventStream {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 3px;
  display: block;
  overflow: auto;
  grid-column: 1/2;
  grid-row: 1/3;
  background-color: #CFD8DC;
  color: #e0a99a;
}

.eventArtists {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 3px;
  margin-right: 5px;
  display: block;
  overflow: auto;
  grid-column: 3/4;
  grid-row: 1/3;
  background-color: #CFD8DC;
  color: #e0a99a;
}

.dateHeader {
  margin-left: 20px;
  color: white;
  font-size: 35px;
}
</style>
