import Vue from 'vue'

export default {

  GET_USER_PROFILE_SUCCESS: (state, data) => {
      
    data['playlists'] = {}
    data['Events'] = {}
    data['Shows'] = {}
    // state.getClickedProfileLoading = false;
    state.selectedUser = data
  },

  setSelectedmID(state, mID) {    
    Vue.set(state.selectedMix, 'mID', mID)  
  },
  
};

