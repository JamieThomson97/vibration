<template>
  <!-- <div class="temp">
            temp
  </div>-->
  <div class="mixWrapper" v-if="trackData">
    <div class="mixTracklist">
      <v-img :src="trackData.artworkURL" height="100%" width="100%" class="tracklistButton">
        <div class="mixImageOverlay">
          <div class="mixHeader mixTracklistHeader">Tracklist</div>
          <div class="mixTracklistTable" v-if="selectedMix.trackData.tracklist">
            <tr
              class="mixTrackistTableRow"
              v-for="(song , x) in selectedMix.trackData.tracklist"
              :key="song"
            >
              <td class="mixTrackistTableColumn mixTracklistNumber">{{x+1}}.</td>
              <td
                style="padding-left:10px;"
                class="mixTrackistTableColumn mixTracklistSong"
              >{{song}}</td>
            </tr>
          </div>
          <div v-else class="noTracklist">
            A tracklist has not been uploaded, please update if possible
            <tracklistPopup/>
          </div>

          <div class="mixButton" v-if="false">
            <v-icon
              class="mixPlayButton"
              x-large
              v-if="!playerCurrentTrack.mID !== trackData.mID"
              @click="handleClickTrack(trackData, 'history') , isPlay = true , trackData.playCount++"
            >play_arrow</v-icon>
            <v-icon
              class="mixPlayButton"
              x-large
              v-else-if="!isPlay && playerCurrentTrack.mID !== trackData.mID"
              @click="handleClickTrack(trackData, 'history') , isPlay = true , trackData.playCount++"
            >play_arrow</v-icon>
            <v-icon
              class="mixPlayButton"
              x-large
              v-else-if="!isPlay && playerCurrentTrack.mID == trackData.mID"
              @click="handleClickTrack(trackData, 'history') , isPlay = true , trackData.playCount++"
            >play_arrow</v-icon>
            <v-icon
              class="mixPlayButton"
              x-large
              v-else-if="isPlay && playerCurrentTrack.mID !== trackData.mID"
              @click="handleClickTrack(trackData, 'history') , isPlay = true"
            >play_arrow</v-icon>
            <v-icon
              class="mixPlayButton"
              x-large
              v-else-if="isPlay && playerCurrentTrack.mID == trackData.mID"
              @click="handleClickTrack(trackData, 'history') , isPlay = false"
            >pause</v-icon>
          </div>
        </div>
      </v-img>
    </div>
    <div class="mixProducers">
      <div class="userHeader">Producers</div>
      <div class="showProducersCards">
        <producerTile
          v-for="producer in trackData.producers"
          :key="producer.uID"
          :object="producer"
        ></producerTile>
      </div>
    </div>

    <div class="mixInfo">
      <div class="mixHeader mixInfoTitle">{{trackData.title}}   {{trackData.show}} {{trackData.event}}</div>
      <div class="mixLikeButton">
        <v-btn style='color:white;' color='deep-orange darken-4' v-if="!doesLike" @click="likeMix(selectedMix.mID, true)">like</v-btn>
        <v-btn style='color:white;'  color='deep-orange darken-4' v-if="doesLike" @click="likeMix(selectedMix.mID, false)">unlike</v-btn>
      </div>
      <div class="mixPlays">
        <div class="smallPlays">Plays</div>
        <div class="largePlays">{{trackData.playCount}}</div>
      </div>
      <div class="mixLikes">
        <div class="smallPlays">Likes</div>
        <div class="largePlays">{{likeCount}}</div>
      </div>
      <div class="mixLikers" v-if="trackData.likers">
        <v-avatar
          class="user"
          v-for="x in trackData.likers"
          :key="x.uID"
          size="70"
          style="cursor:pointer;"
        >
          <img
            class="playlistImages"
            @click="navigateUser(x.uID , x.name)"
            :src="x.profileURL"
            alt="Avatar"
          >
        </v-avatar>
      </div>
    </div>
    <div class="mixProducerInfo">
      <div class="mixHeader mixProducerName">{{trackData.producers[0].name}}</div>

      <div class="mixFollowNumbers">
        <div class="mixFollowingCount">
          <div class="userPatronHeader">Following</div>
          <div class="userPatronCount">
            <div>{{selectedUser.followingCount}}</div>
          </div>
        </div>

        <div class="mixFollowerCount">
          <div class="userPatronHeader">Followers</div>
          <div class="userPatronCount">
            <div>{{selectedUser.followerCount}}</div>
          </div>
        </div>
      </div>
      <div class="mixUserShows">
        <div class="mixSubHeader">Shows</div>
        <div class="eventsGrid" v-if="selectedUser.Shows">
          <showTile
            v-for="show in selectedUser.Shows.slice(0,5)"
            :object="show"
            playerTracksReference="selectedUser.events"
            :key="show.sID"
          ></showTile>
        </div>
      </div>
      <div class="mixUserEvents">
        <div class="mixSubHeader">Events</div>
        <div class="eventsGrid" v-if="selectedUser.Events">
          <eventTile
            v-for="event in selectedUser.Events.slice(0,5)"
            :object="event"
            playerTracksReference="selectedUser.events"
            :key="event.eID"
          ></eventTile>
        </div>
      </div>
    </div>
    <!-- <div class="mixEventorShowSuggested">
      <div class="mixEvent">
        <div class="header">From the same event</div>
        <div class="mixTiles" v-if="event">
          <mixTile
            v-for="mix in event.mixes"
            :key="mix.mID"
            :object="mix"
            playerTracksReference="show.mixes"
          ></mixTile>
        </div>
        <div v-else class="noneFound">no mixes found from same event</div>
      </div>

      <div class="mixShow">
        <div class="header">From the same show</div>
        <div class="mixTiles" v-if="show">
          <mixTile
            v-for="mix in show.mixes"
            :key="mix.mID"
            :object="mix"
            playerTracksReference="show.mixes"
          ></mixTile>
        </div>
        <div v-else class="noneFound">no mixes found from same show</div>
      </div>
    </div>-->
    <div class="mixProducerSuggested">
      <div class="mixHeader">By the same producers</div>
      <div class="mixTiles">
        <mixTile
          v-for="mix in selectedMix.suggestedMixes"
          :key="mix.mID"
          :object="mix"
          playerTracksReference="show.mixes"
        ></mixTile>
      </div>
    </div>
  </div>
</template>

<script>
import mixMixin from "../mixins/mixMixin";
import createPlaylistMixin from "../mixins/createPlaylistMixin";
import tileMixin from "../mixins/tileMixin";
import selectedUserMixin from "../mixins/selectedUserMixin";

import mixTile from "@/components/mixTile.vue";
import tracklistPopup from "@/components/tracklistPopup.vue";
import showTile from "@/components/showTile.vue";
import eventTile from "@/components/eventTile.vue";
import producerTile from "@/components/producerTile.vue";

import { mapGetters } from "vuex";

import firebase from "firebase";

export default {
  components: {
    tracklistPopup,
    mixTile,
    showTile,
    producerTile,
    eventTile
  },

  props: {
    pagePart: {
      type: String,
      required: false
    },
    passedUser: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      likeCount: 0,
      doesLike: null,
      x: 0,
      inLiked: -1,
      producerShower: 0
    };
  },

  mixins: [mixMixin, createPlaylistMixin, selectedUserMixin, tileMixin],

  computed: {
    ...mapGetters({
      profileURL: "profileURL",
      uID: "uID",
      name: "name",
      // selectedMixmID: "selectedMixmID",
      selectedUser: "selectedUser",
      selectedMix: "selectedMix",
      event: "event",
      show: "show",
      playerCurrentTrack: "playerCurrentTrack",
      isPlay: "isPlay"
    }),

    trackData() {
      return this.selectedMix.trackData;
    }
  },

  watch: {
    selectedMix: function(newValue) {
      console.log("watcher");
      // this.fetchMixInfo(newValue);
    },
    trackData: function(newValue) {
      if (this.selectedUser.uID != newValue.uID) {
        this.fetchUserDetails(newValue.uID);
      }
      console.log(newValue);
    },
    selectedUser: function(newValue) {
      if (newValue.uID) {
        this.getUserShowsorEvents(newValue.uID, "events");
        this.getUserShowsorEvents(newValue.uID, "shows");
      }
    }
    //If event or stream, set the event . mixes object in state to equal the mixes in that event or mix
  },

  mounted: function() {
    if (this.selectedMix.mID) {
      var passmID = this.selectedMix.mID;
    } else {
      passmID = JSON.parse(localStorage.getItem("vuex")).selectedMixmID;
      console.log("passmID");
     
    }
    this.fetchMixInfo(passmID);
  },

  methods: {
    //adds or removes the user to the local 'likers' and calls the server-side fuction 'likeMix' to 
    //execute the database transaction
    likeMix(mID, like) {
      //receives the liked mix' mID. "like" is Boolean denoting whether to like or un-like the mix

      //defines the object that will be written to state
      const likersObj = {
        name: this.name,
        uID: this.uID,
        profileURL: this.profileURL
      };
      //if the mix is being liked
      if (like) {
        //increase the selectedMixes likeCount, this automatically updates the UI
        this.likeCount = this.likeCount + 1;
        //if the currentMix' likers array has less than 10 entries
        if (this.trackData.likers.length < 10) {
          //add the object to the array
          this.trackData.likers.push(likersObj);
          //inLiked holds the index of the currentUser in the "likers" array
          //this is so the array can be easily spliced of the user if they chose to unlike the mix
          this.inLiked = this.trackData.likers.length - 1;
        }
        
      }//if the mix is being unliked 
      else {
        if (this.inLiked > -1) {
          //remove the user from the likers array, if they are in it
          this.trackData.likers.splice(this.inLiked, 1);
        }
        //update the local likeCount
        this.likeCount = this.likeCount - 1;
      }
      
      this.doesLike = !this.doesLike;
      //call the server-side likeMix function, passing the requried information
      var callFunction = firebase.functions().httpsCallable("likeMix");
      return callFunction({
        mID: mID,
        likeruID: this.uID,
        likerName: this.name,
        mixName: this.trackData.title,
        liked: like,
        profileURL: this.profileURL,
        producers: this.trackData.producers,
        artworkURL: this.trackData.artworkURL,
        likeCount: this.trackData.likeCount,
        playCount: this.trackData.playCount
      }).catch(error => {
        this.$noty.warning(error);
      });
    }
  }
};
</script>

<style>
.mixWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 0.5rem;
  height: 100vh;
  width: 95.8vw;
}

.mixTracklist {
  grid-column: 1/2;
  grid-row: 1/4;
  background-color: #CFD8DC;
}

.mixProducers {
  grid-column: 1/2;
  grid-row: 4/5;
  background-color: #CFD8DC;
}

.mixTracklistTable {
  margin-top: 20px;
  margin-left: 20px;
}

.noTracklist {
  color: #BF360C;
  font-size: 20px;
  margin-left: 20px;
}

.mixTracklistNumber {
  color: #BF360C;
  font-size: 16px;
}

.mixTracklistSong {
  font-weight: bold;
  color: #BF360C;
  font-size: 26px;
}

.mixImageOverlay {
  grid-column: 1/2;
  grid-row: 1/1;
  height: 100%;
  background-color: rgb(207, 216, 220, 0.3);
}

.tracklistButton {
  display: inline-flex;
  flex-direction: row;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.mixButton {
  position: absolute;
  top: 100px;
  right: 100px;
}

.mixPlayButton {
  transform: scale(8);
}

.mixInfo {
  grid-column: 2/3;
  grid-row: 1/3;
  background-color: #CFD8DC;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
}

.mixInfoTitle {
  grid-row: 1/1;
  grid-column: 1/2;
}
.mixLikeButton {
  margin: auto;
  grid-row: 1/1;
  grid-column: 2/3;
}
.mixPlays {
  grid-row: 2/3;
  grid-column: 1/2;
}

.smallPlays {
  font-size: 20px;
  color: #BF360C;
  text-align: center;
}

.largePlays {
  font-size: 60px;
  color: #BF360C;
  text-align: center;
}

.mixLikes {
  grid-row: 2/3;
  grid-column: 2/3;
}
.mixLikers {
  margin-top: 15px;
  margin-left: 15px;
  grid-gap: 1rem;
  display: inline-flex;
  grid-row: 3/4;
  grid-column: 1/3;
}

.mixProducerInfo {
  display: grid;
  grid-column: 3/4;
  grid-row: 1/3;
  background-color: #CFD8DC;
  grid-template-rows: 0.5fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
}

.mixFollowNumbers {
  display: inline-flex;
  grid-column: 2/3;
  grid-row: 1/2;
}

.mixSubHeader {
  font-size: 20px;
  margin-left: 15px;
  color: #BF360C;
}

.mixUserShows {
  display: grid;
  grid-column: 1/3;
  grid-row: 2/3;
  grid-template-rows: 0.3fr 1fr;
  max-height: 80%;
}
.mixUserEvents {
  max-height: 80%;
  display: grid;
  grid-column: 1/3;
  grid-row: 3/4;
  grid-template-rows: 0.3fr 1fr;
}

.mixFollowingCount {
  width: 50%;
}

.mixFollowerCount {
  width: 50%;
}

.mixEventorShowSuggested {
  grid-column: 2/4;
  grid-row: 3/5;
  background-color: #CFD8DC;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.mixEvent {
  grid-column: 2/3;
  grid-row: 1/1;
  background-color: red;
}

.mixShow {
  grid-column: 2/3;
  grid-row: 1/1;
  background-color: #CFD8DC;
}

.mixProducerSuggested {
  grid-column: 2/4;
  grid-row: 3/5;
  background-color: #CFD8DC;
}
</style>
