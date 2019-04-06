import Vue from 'vue'

export default {
  GET_USER_PROFILE: (state) => {
    state.getUserProfileLoading = true;
  },
  
  GET_USER_PROFILE_FAIL: (state, data) => {
    state.getUserProfileLoading = false;
    state.getUserProfileFail = data;
  },
  GET_USER_FOLLOWINGS: (state) => {
    state.getUserFollowingsLoading = true;
  },

  GET_USER_PROFILE_SUCCESS: (state, data) => {
      
    data['playlists'] = {}
    data['Events'] = {}
    data['Shows'] = {}
    // state.getClickedProfileLoading = false;
    state.selectedUser = data
  },

  GET_USER_FOLLOWINGS_SUCCESS: (state, data) => {
    state.getUserFollowingsLoading = false;
    state.userFollowingsData = data;
  },
  GET_USER_FOLLOWINGS_FAIL: (state, data) => {
    state.getUserFollowingsLoading = false;
    state.getUserFollowingsFail = data;
  },
  GET_USER_TRACKS: (state) => {
    state.getUserTracksLoading = true;
  },
  GET_USER_TRACKS_SUCCESS: (state, data) => {
    
    state.getUserTracksLoading = false;
    state.userTracksData = data;
  },
  GET_USER_TRACKS_FAIL: (state, data) => {
    state.getUserTracksLoading = false;
    state.getUserTracksFail = data;
  },

  setSelecteduID : (state , uID) => {
    Vue.set(state.selectedUser, 'uID', uID)
    console.log('set')
  },

  setevents(state, value){
    Vue.set(state.selectedUser  , 'Events' , value)
  },

  setshows(state, value){
    Vue.set(state.selectedUser , 'Shows'  , value)
  },

  setClickedPlaylist(state, payload) {
    Vue.set(state.selectedUser.playlists , 'mixes' , payload.object)
    
  },

  setFollowX: (state, payload) => {
      
    Vue.set(state.selectedUser, payload.follX , payload.response)
  },

  doesFollow(state, bool) {
    Vue.set(state.selectedUser, 'doesFollow', bool)
  
  },
  
};

