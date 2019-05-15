<template>
  <div class="playerWrapper" v-if="!!playerCurrentTrack && showShow">

    <v-icon style='position:absolute;top:0;right:0;' @click='changeShowPlayer'>clear</v-icon>

    <div class="playerTrackDetails">
      <div class="playerMixArtwork">
        <v-img
          :src="playerCurrentTrack.artworkURL"
          max-height="100%"
          cover
          alt
          gradient="to top right, rgba(100,115,201,.6), rgba(25,32,72,.7)"
        ></v-img>
      </div>
      <div class="playerMixInfo">
        <div
          align
          right
          class="playerTitle"
          @click="navigateMix(playerCurrentTrack.mID , playerCurrentTrack.title)"
          :to="`/users/${(playerCurrentTrack.producers[0].name).split(' ').join('_')}/mixes/${(playerCurrentTrack.title).split(' ').join('_')}`"
        >{{playerCurrentTrack.title}}</div>
        <div
          align
          right
          class="playerProducer"
          @click="navigateUser(playerCurrentTrack.producers[0].uID , playerCurrentTrack.producers[0].name)"
          :to="`/users/${(playerCurrentTrack.producers[0].name).split(' ').join('_')}`"
        >{{displayProducers}}</div>
      </div>
    </div>
    <div class="mainButtons">
      <button :disabled="playerTracks.length === 0" @click="handleChangeTrack('previous')">
        <v-icon x-large color="white">skip_previous</v-icon>
      </button>
      <button @click="$store.dispatch(isPlay ? 'pause' : 'play')" class="playButton">
        <v-icon x-large v-if="!isPlay" color="white">play_arrow</v-icon>
        <v-icon x-large v-else color="white">pause</v-icon>
      </button>
      <button :disabled="playerTracks.length === 0" @click="handleChangeTrack('next')">
        <v-icon x-large color="white">skip_next</v-icon>
      </button>
    </div>
    <div class="playerTrackDetailsRight">
      <div align right class="playerDate">{{readableDate}}</div>
      <div align right class="playerGig" v-if="playerCurrentTrack.show">{{playerCurrentTrack.show}}</div>
      <div
        align
        right
        class="playerGig"
        v-if="playerCurrentTrack.event"
      >{{playerCurrentTrack.event}}</div>
    </div>

    <div class="seekbarWrapper">
      <span class="currentTime">{{secondsToTime(playerCurrentTime)}}</span>
      <div class="seekbar" @click="calculateSeekOnClick">
        <div
          class="seek"
          :style="{ width: `${(((playerCurrentTime / playerDuration) * 100) || 0)}%` }"
        />
        <div
          class="seekbarPoint"
          :style="{ left: `calc(${(((playerCurrentTime / playerDuration) * 100) || 0)}% - 7px)` }"
        />
      </div>

      <span class="durationTime">{{secondsToTime(playerDuration)}}</span>
    </div>
  </div>
</template>

<script>
import { Howl } from "howler";
import _ from "lodash";
import { mapGetters } from "vuex";
import secondsToTime from "@/utils/secondsToTime";
import selectedUserMixin from "../mixins/selectedUserMixin";
import mixMixin from "../mixins/mixMixin";
import tileMixin from "../mixins/tileMixin";

export default {
  data() {
    return {
      player: null,
      options: { year: "numeric", month: "numeric", day: "numeric" }
    };
  },

  mixins: [selectedUserMixin, tileMixin, mixMixin],
  computed: {
    ...mapGetters({
      isPlay: "isPlay",
      playerCurrentTime: "playerCurrentTime",
      playerDuration: "playerDuration",
      playerTracks: "playerTracks",
      playerCurrentTrack: "playerCurrentTrack",
      showShow: "showShow",
      playerSeeking: "playerSeeking"
    }),

    displayProducers() {
      switch (this.playerCurrentTrack.producers.length) {
        case 1:
          return this.playerCurrentTrack.producers[0].name;
        case 2:
          return (
            this.playerCurrentTrack.producers[0].name +
            ", " +
            this.playerCurrentTrack.producers[1].name
          );
        case 3:
          return (
            this.playerCurrentTrack.producers[0].name +
            ", " +
            this.playerCurrentTrack.producers[1].name +
            ", " +
            this.playerCurrentTrack.producers[2].name
          );

        case (3, 4, 5, 6, 7, 8, 9, 10):
          return (
            this.playerCurrentTrack.producers[0].name +
            ", " +
            this.playerCurrentTrack.producers[1].name +
            ", " +
            this.playerCurrentTrack.producers[2].name +
            "..."
          );

        default:
          return this.playerCurrentTrack.producers[0].name;
      }
    },

    readableDate() {
      if (this.playerCurrentTrack.dateUploaded) {
        var seconds = this.playerCurrentTrack.dateUploaded.seconds;
        var date = new Date(seconds * 1000).toLocaleDateString(
          "en-UK",
          this.options
        );
        return date;
      } else {
        return "not sure";
      }
    }
  },
  watch: {
    isPlay(nextIsPlay, prevIsPlay) {
      if (nextIsPlay !== prevIsPlay && this.player) {
        this.handlePlayPause();
      }
    },
    playerCurrentTime(nextPlayerCurrentTime, prevPlayerCurrentTime) {
      if (
        nextPlayerCurrentTime !== prevPlayerCurrentTime &&
        this.playerSeeking
      ) {
        this.player.seek(nextPlayerCurrentTime);
        this.$store.dispatch("setPlayerSeeking", false);
      } //If the next second is the final second of the song
      if (nextPlayerCurrentTime == this.playerDuration) {
        //If there are other tracks queued, play the next
        const self = this;
        const currentTrackTitle = this.playerCurrentTrack.title;
        Object.values(this.playerTracks).forEach((track, index) => {
          if (currentTrackTitle === track.title) {
            let nextIndex = 0;
            nextIndex = index + 1;
            if (nextIndex < Object.values(self.playerTracks).length) {
              Object.values(self.playerTracks)[nextIndex]["mID"] = Object.keys(
                this.playerTracks
              )[nextIndex];
              this.$store.dispatch(
                "setPlayerCurrentTrack",
                Object.values(self.playerTracks)[nextIndex]
              );
            }
          }
        });
      }
    },
   

    playerCurrentTrack(nextCurrentTrack, prevCurrentTrack) {
      if (nextCurrentTrack && !_.isEqual(nextCurrentTrack, prevCurrentTrack)) {
        if (this.player) {
          this.player.pause();
          this.$store.dispatch("pause");
          this.$store.dispatch("setPlayerCurrentTime", 0);
          this.$store.dispatch("setPlayerDuration", 0);
          this.player = null;
        }
        setTimeout(() => {
          this.player = new Howl({
            src: nextCurrentTrack.audioURL,
            html5: true,
            volume: 1.0
          });
          this.$store.dispatch("play");
          this.player.on("play", () => {
            setInterval(() => {
              if (this.player && this.player.playing()) {
                this.$store.dispatch(
                  "setPlayerCurrentTime",
                  Math.round(this.player.seek()) || 0
                );
                if (
                  Math.round(this.player.duration()) !== this.playerDuration
                ) {
                  this.$store.dispatch(
                    "setPlayerDuration",
                    Math.round(this.player.duration()) || 0
                  );
                }
              }
            }, 100);
            this.addPlay(this.nextCurrentTrack);
          });
        }, 100);
      } else if (prevCurrentTrack && !nextCurrentTrack) {
        this.$store.dispatch("pause");
        this.$store.dispatch("setPlayerCurrentTime", 0);
        this.$store.dispatch("setPlayerDuration", 0);
        this.player.pause();
        this.player = null;
      }
    }
  },
  destroyed() {
    if (this.player) {
      this.$store.dispatch("pause");
      this.player = null;
      this.$store.dispatch("setPlayerCurrentTime", 0);
      this.$store.dispatch("setPlayerDuration", 0);
    }
  },
  methods: {

    

    handlePlayPause() {
      if (this.isPlay) {
        if (
          this.playerDuration > 0 &&
          this.playerCurrentTime === this.playerDuration
        ) {
          this.player.seek(0);
          this.$store.dispatch("setPlayerCurrentTime", 0);
          this.$store.dispatch("setPlayerDuration", 0);
        }
        this.player.play();
      } else {
        this.player.pause();
      }
    },
    handleChangeTrack(direction) {
      const self = this;
      const currentTrackTitle = this.playerCurrentTrack.title;
      Object.values(this.playerTracks).forEach((track, index) => {
        if (currentTrackTitle === track.title) {
          let nextIndex = 0;
          if (direction === "next") {
            nextIndex = index + 1;
            if (nextIndex < Object.values(self.playerTracks).length) {
              Object.values(self.playerTracks)[nextIndex]["mID"] = Object.keys(
                this.playerTracks
              )[nextIndex];
              this.$store.dispatch(
                "setPlayerCurrentTrack",
                Object.values(self.playerTracks)[nextIndex]
              );
            } else {
              this.$noty.warning("Tracklist finished");
            }
          } else if (direction === "previous") {
            nextIndex = index - 1;
            if (nextIndex >= 0) {
              Object.values(self.playerTracks)[nextIndex]["mID"] = Object.keys(
                this.playerTracks
              )[nextIndex];
              this.$store.dispatch(
                "setPlayerCurrentTrack",
                Object.values(self.playerTracks)[nextIndex]
              );
            }
          }
        }
      });
    },


    calculateSeekOnClick(e) {
      const element = e.target;
      const offset = {
        left: element.offsetLeft,
        top: element.offsetTop
      };
      let reference = e.offsetParent;
      while (reference !== undefined) {
        offset.left += reference.offsetLeft;
        offset.top += reference.offsetTop;
        reference = reference.offsetParent;
      }
      const percent =
        100 -
        ((element.clientWidth - (e.pageX - offset.left)) /
          element.clientWidth) *
          100; // eslint-disable-line
      const currentTime = Math.floor((this.playerDuration / 100) * percent);
      this.player.seek(currentTime);
    },
    secondsToTime
  }
};
</script>

<style scoped>
.playerWrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 11vh;
  background-color: #CFD8DC;
  display: flex;
  z-index: 99999;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.playerTrackDetails {
  position: absolute;
  left: 0px;
  top: 0;
  height: 100%;
  width: 50%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  color: #b71c1c;
}
.playerTrackDetailsRight {
  position: absolute;
  right: 0px;
  top: 0;
  height: 100%;
  font-weight: bold;
  font-size: 24px;
  color: #b71c1c;
  margin-right: 20px;
}

.playerDate {
  width: 100% !important;
}
.playerGig {
  text-align: right;
  width: 100% !important;
}

.playerMixArtwork {
  max-height: 100%;
  grid-row: 1/5;
  grid-column: 1/2;
}

.playerMixInfo {
  grid-row: 1/5;
  grid-column: 2/3;
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.trackDetails .titleWrapper * {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}
.trackDetails .titleWrapper .title {
  font-weight: bold;
}
.mainButtons {
  margin: 5px auto 0;
  display: flex;
  margin-top: 15px;
  grid-gap: 20px;
  align-self: center;
  position: absolute;
  height: 50%;
  top: 0px;
}
.mainButtons button {
  float: left;
  border-radius: 20px;
  width: 45px;
  height: 45px;
  transition: all ease 0.1s;
  box-sizing: border-box;
}
.mainButtons button:disabled,
.mainButtons button[disabled] {
  cursor: default;
  pointer-events: none;
}
.mainButtons button:disabled img,
.mainButtons button[disabled] img {
  opacity: 0.2 !important;
}
.mainButtons button:hover img {
  opacity: 0.7;
}
.mainButtons button.playButton {
  display: flex;
}
.mainButtons button.playButton img {
  width: 25px;
}
.mainButtons button img {
  width: 14px;
  opacity: 0.4;
}
.seekbarWrapper {
  position: absolute;
  top: 60%;
  margin-top: 5px;
  width: 98vw;
  display: flex;
  justify-content: stretch;
  align-items: center;
}
.seekbarWrapper > .seekbar {
  width: 100%;
  height: 5px;
  background: #eee;
  border-radius: 5px;
  position: relative;
  margin: 0 10px;
  cursor: pointer;
}
.seekbarWrapper > .seekbar:hover .seekbarPoint {
  opacity: 1;
}
.seekbarWrapper > .seekbar > .seek {
  height: 5px;
  background: #b71c1c;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  border-radius: 5px 0 0 5px;
  pointer-events: none;
  transition: all linear 0.1s;
}
.seekbarWrapper > .seekbar > .seekbarPoint {
  width: 12px;
  height: 12px;
  border-radius: 8px;
  background:  #b71c1c;
  position: absolute;
  top: -3.25px;
  z-index: 3;
  opacity: 0;
  transition: all linear 0.1s;
  pointer-events: none;
}
.currentTime {
  font-size: 16px;
  color: #b71c1c;
  }

.durationTime {
  font-size: 16px;
  color: #b71c1c;
}
</style>