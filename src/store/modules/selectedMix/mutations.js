import Vue from 'vue'

export default {



  setSelectedmID(state, mID) {
    Vue.set(state, 'mID', mID)
  },

  setTrackData(state, trackData) {
    Vue.set(state, 'trackData', trackData)
  },

  setLikers(state, likers) {
    Vue.set(state.trackData, 'likers', likers)
  },
  setSuggestedMixMixes(state, mixes) {

    Vue.set(state, 'suggestedMixes', mixes)
  },


};