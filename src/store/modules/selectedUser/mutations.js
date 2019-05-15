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
    Object.keys(data).forEach(key => {
      Vue.set(state, key, data[key])
    })
  },

  setUserProfileURL: (state, data) => {
    Vue.set(state, 'profileURL', data)
  },

  DESTROY_USER: (state, data) => {
    console.log('destroy Mutation')
    Object.keys(state).forEach(key => {
      if (key != 'uID') {
        Vue.delete(state, key)
      }
      
    })
    console.log(state)
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
    Vue.set(state, 'uID', uID)
    console.log('set')
  },

  setevents(state, value){
    Vue.set(state , 'Events' , value)
  },

  setshows(state, value){
    console.log('setSHo')
    console.log(value)
    Vue.set(state , 'Shows'  , value)
  },

  setClickedPlaylist(state, payload) {
    const playlists = {
      mixes : payload.object
    }
    Vue.set(state , 'playlists' , playlists)
    
  },

  setFollowX: (state, payload) => {
      
    Vue.set(state , payload.follX , payload.response)
  },

  doesFollow(state, payload) {
    Vue.set(state , 'doesFollow', payload)
  
  },
  
  setFollowCounts(state, payload){
    Vue.set(state , 'followerCount', payload.followerCount)
    Vue.set(state , 'followingCount', payload.followingCount)
  }

};

