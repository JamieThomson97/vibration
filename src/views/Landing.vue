<template>
  <v-app>
    <div fluid class="aboutDiv">
      <div class="backgroundImage"></div>
      <div class="landingInfo">
        <div class="landingHeader">Vibration</div>
        <div class="landingPoints">
          <div class="point1">A music service designed for listening to mixes</div>
          <div class="point2">Integrated track-listing services</div>
        </div>
      </div>
      <div class="signIn">
        <SignIn/>
      </div>
    </div>
  </v-app>
</template>


<script>
import "intersection-observer";
import SignIn from "../components/SignIn.vue";
// import Search from '../components/Search.vue'

export default {
  components: {
    //Register,
    SignIn
    // Search,
    // Scrollama,
    //  Scroll,
  },

  data() {
    return {
      show: false
    };
  },

  computed: {
    user() {
      return this.$store.getters.user;
    }
  },

  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        // this.$router.push('/')
      }
    }
  },

  methods: {
    signOutUser() {
      this.$router.push("/landing");
      this.$store.dispatch("logUserOut");
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

.backgroundImage {
  /* The image used */
  background-image: url("../../testAssets/flume-red-rocks-new-stage.jpg");

  /* Add the blur effect */
  filter: blur(7px);
  -webkit-filter: blur(7px);

  /* Full height */
  height: 100vh;
  width: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.signIn {
  width: 600px;
  position: absolute;
  top: 2%;
  left: 50%;
}

.landingInfo {
  width: 600px;
  position: absolute;
  top: 4%;
  left: 2%;
  background-color: white;
}

.landingHeader {
  margin-left: 2px;
  margin-top: 2px;
  margin-right: 2px;
  font-size: 50px;
  color: #b71c1c;
  background-color: #cfd8dc;
}

.landingPoints {
  margin-left: 2px;
  margin-top: 2px;
  margin-right: 2px;
  font-size: 25px;
  color: #b71c1c;
  background-color: #cfd8dc;
}
</style>
