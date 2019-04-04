import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'
import router from './router'
import player from './store/modules/player';
import user from './store/modules/user';
// import * as _ from 'underscore'
const database = firebase.firestore()

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    customer: state.customer,
    clickedMixID: state.clickedmID,
    clickeduID : state.clickeduID,
    clickedeID : state.clickedeID,
    clickedsID : state.clickedsID,
    clickedUser: state.clickeduser,
    //trackData: state.trackData,
  })
})


export default new Vuex.Store({

  plugins: [
    vuexLocal.plugin,
  ],

  modules: {
    player,
    user,
  },

  appTitle: 'Vibration',
  state: {
    customer: {
      uID: null,
      name: null,
      profileURL: null,
      followerCount: 0,
      followingCount: 0,
      playlists: { },
    },
    clickedUser: { 
      Events: {},
      Shows: {},
      playlists: {},
      doesFollow: false
    },
    playerCurrentTracks: {},
    showSearch: false,
    searchQuery : '',
    clickedMix: {},
    user: null,
    error: null,
    loading: false,
    drawer: true,
    right: true,
    mini: true,
    mixLoaded: false,
  },

  mutations: {

    setPlaylist(state, payload){
      if(payload.name == "Listen Later"){
        payload.name = "listenLater"
      }
      Vue.set(state.customer.playlists, payload.name , payload.object)
    },

    setCurrentPlayerTracks(state, tracks) {
      Vue.set(state, 'playerCurrentTracks' , tracks)
    },

    setFollowX: (state, payload) => {
      
      //state.clickedUser[payload.follX] = payload.response
      Vue.set(state.clickedUser, payload.follX , payload.response)
    },

    setShowSearch(state, value){
      Vue.set(state , 'showSearch' , value)
    },

    setevents(state, value){
      Vue.set(state.clickedUser  , 'Events' , value)
    },

    setshows(state, value){
      Vue.set(state.clickedUser , 'Shows'  , value)
    },

    setSearchQuery(state, query){
      Vue.set(state , 'searchQuery' , query)
    },

    setClickedPlaylist(state, payload) {
      Vue.set(state.clickedUser.playlists, 'mixes' , payload.object)
    },

    GET_USER_PROFILE_SUCCESS: (state, data) => {
      
      data['playlists'] = {}
      data['Events'] = {}
      data['Shows'] = {}
      state.getClickedProfileLoading = false;
      Vue.set(state , 'clickedUser' , data)
    },

    setClickeduID(state, payload) {
      Vue.set(state, 'clickeduID' , payload)
    },
    setClickedeID(state, payload) {
      Vue.set(state, 'clickedeID' , payload)
    },
    setClickedsID(state, payload) {
      Vue.set(state, 'clickedsID' , payload)
    },
    setClickedmID(state, payload) {
      Vue.set(state , 'clickedmID' , payload)
    },

    setuID(state, payload) {  
      state.clickedMix.uID = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setMixLoaded(state) {
      state.mixLoaded = true
    },
    setName(state, payload) {
      state.customer.name = payload
    },
    setProfileURL(state, payload) {
      state.customer.profileURL = payload
    },
    setFollowersCounts(state, payload) {
      state.customer.followersCount = payload
    },
    setFollowingCount(state, payload) {
      state.customer.followingCount = payload
    },

    setNullUser(state) {
      Vue.delete(state, Vuex)
    },

    setUser(state, payload) {
      var user = {}
      user.customer = payload.user
      user.customer.uID = payload.uID
      user.customer.playlists = {} 
      user.customer.followerCount = 0
      user.customer.followingCount = 0
      
      Vue.set(state, 'customer', user.customer)
      //Vue.set( )
    },

    doesFollow(state, bool) {
      Vue.set(state.clickedUser, 'doesFollow', bool)
    
    },

    deletePlaylist(state, playlist) {

      const index = state.customer.createdPlaylists.indexOf(playlist);
      state.customer.createdPlaylists.splice(index, 1);
      Vue.delete(state.customer.playlists, playlist)
    
    },

    deleteFromPlaylist(state, payload){
      const index = state.customer.playlists[payload.playlist].indexOf(payload.mID)
      state.customer.playlists[payload.playlist].splice(index, 1);
    },

    addToPlaylist(state, payload) {
      Vue.set(state.customer.playlists[payload.playlistName], payload.mix.mID, payload.mix)
    },

    createPlaylist(state, playlistName){
      state.customer.createdPlaylists.push(playlistName)
      Vue.set(state.customer.playlists, playlistName, {})
    },

    

    deleteMix(state, payload) {
      Vue.delete(state.clickedUser.playlists[payload.pName], payload.mID)      
    },

    addToHistory(state, trackData) {
      state.customer.playlists.History.push(trackData)
    },

    setTrackData(state, trackData) {
      Vue.set(state, 'trackData', trackData)
    },
    
    setLikers(state, likers){
      Vue.set(state.trackData, 'likers', likers)
    },

    setEventData(state, eventData) {      
      Vue.set(state, 'event' , eventData)
    },
    setEventMixes(state, mixes){
      Vue.set(state.event, 'mixes', mixes )
    },
    setShowData(state, ShowData) {      
      Vue.set(state, 'Show' , ShowData)
    },
    setShowMixes(state, mixes){
      Vue.set(state.Show, 'mixes', mixes )
    },
    setSuggestedShowMixes(state, mixes){
      Vue.set(state.Show, 'suggestedMixes', mixes )
    },
  },

  actions: {

    actionSetLikers({commit}, likers){
      commit('setLikers' , likers)
    },

    actionDeletePlaylist({commit}, playlist) {
      commit('deletePlaylist' , playlist)    
    },

    actionSetSearchQuery({commit} , payload){
      commit('setSearchQuery' , payload)
      console.log(payload.length)
      if(payload.length > 3){
        commit( 'setShowSearch' , true)
      }else{
        commit( 'setShowSearch' , false)
      }
    },

    signUserUp({
      commit
    }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          firebase.firestore().collection('users').doc(user.user.uid).set({
            name: payload.name,
            followingCount: 0,
            followersCount: 0,
            following: [],
            followers: [],
            playlists: {}
          }).then(() => {

          }).catch((error) => {
            this.$noty.error(error)
          })
          commit('setuID', user.user.uid)
        }).catch((error) => {
          this.$noty.error(error)
        })
    },

    actionSetClickeduID({ commit }, payload) {
      commit('setClickeduID' , payload)
    },
    actionSetClickedmID({ commit }, payload) {
      commit('setClickedmID' , payload)
    },
    actionSetClickedeID({ commit }, payload) {
      commit('setClickedeID' , payload)
    },
    actionSetClickedsID({ commit }, payload) {
      commit('setClickedsID' , payload)
    },

    signUserIn({// eslint-disable-next-line
      commit
    }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          const uID = user.user.uid
          const ref = firebase.firestore().collection('users').doc(user.user.uid)
          ref.get().then((snapshot) => {
            this.dispatch("actionSetUser", {
              
              user : snapshot.data(),
              uID : uID
            }).then(() => {
              router.push({
                name: 'home'
              })
            })
          })
        }).catch((error) => {
          this.$noty.error(error)
        })
    },

    logUserOut({
      commit
    }) {
      firebase.auth().signOut()
        .then(() => {
          commit('setNullUser')
          router.push('/landing')
          
        }).catch((error) => {
          this.$noty.error(error)
        })
    },

    getTrackData({ commit }, mID) {
      
      database.collection('mixes').doc(mID).get().then(response => {
        
        commit('setTrackData', response.data())
      })
    },

    getEventDetails({ commit }, eID) {
      database.collection('events').doc(eID).get().then(response => {
        const eventData = response.data()
        eventData['eID'] = response.id
        commit('setEventData', eventData)
      })
    },
    getShowDetails({ commit }, sID) {
      database.collection('shows').doc(sID).get().then(response => {
        const eventData = response.data()
        eventData['sID'] = response.id
        commit('setShowData', eventData)
      })
    },

    actionDeleteMix({commit}, payload){
     commit('deleteMix', payload)
    },

    actionSetPlayerCurrentTracks({commit}, tracks){
      commit('setCurrentPlayerTracks', tracks)
     },
 

    actionCreatePlaylist({commit} , playlistName){
      commit('createPlaylist' , playlistName)
    },

    actionAddToPlaylist({commit} , payload){
      commit('addToPlaylist' , payload)
    },

    actionSetmID({
      commit
    }, payload) {

      commit(`setmID`, payload)

    },
    actionSetStream({ commit }, payload) {

      commit('setStream', payload)
    },
    setActionMixLoaded({
      commit
    }) {
      commit('setMixLoaded', true)
    },


    actionSetUser({
      commit
    }, payload) {
      
      commit('setUser', { user : payload.user , uID : payload.uID })
    }


  },

  getters: {

    clickedUser(state) {
      return state.clickedUser
    },

    doesFollow(state) {
      return state.clickedUser.doesFollow
    },


    clickeduID(state) {
      return state.clickeduID
    },
    clickedmID(state) {
      return state.clickedmID
    },
    clickedeID(state) {
      return state.clickedeID
    },
    clickedsID(state) {
      return state.clickedsID
    },
    customer(state){
      return state.customer
    },
    
    uID(state) {
      return state.customer.uID
    },
    drawer(state) {
      return state.user
    },
    right(state) {
      return state.user
    },
    mini(state) {
      return state.user
    },
    timeline(state) {
      return state.timeline
    },
    stream(state) {
      return state.stream
    },
    mixLoaded(state) {
      return state.mixLoaded  
    },
    name(state) {
      return state.customer.name
    },
    profileURL(state) {
      return state.customer.profileURL
    },
    customerMixes(state) {
      return state.customer.mixes
    },

    playlists: (state) => (pName, passedUser) => {
      if(pName && passedUser){
        return (state[passedUser].playlists[pName])//+'.'+pName.stream)
      }else{
        return false
      }
    }, 
    followingCount(state){
      return state.customer.followingCount
    },
    followerCount(state){
      return state.customer.followerCount
    },
    searchQuery(state){
      return state.searchQuery
    },
    showSearch(state){
      return state.showSearch
    },
    clickedMixID(state){
      return state.clickedmID
    },
    trackData(state){
      return state.trackData
    },
    event(state){
      return state.event
    },
    show(state){
      return state.Show
    },
    currentPlayerTracks(state){
      return state.currentPlayerTracks
    },
  },

})
