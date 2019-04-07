import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'
import router from './router'
import player from './store/modules/player';
import selectedUser from './store/modules/selectedUser';
import selectedMix from './store/modules/selectedMix';
import selectedEvent from './store/modules/selectedEvent';
import selectedShow from './store/modules/selectedShow';

const database = firebase.firestore()

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    customer: state.customer,
    // selectedMix.mID: state.clickedmID,
    clickeduID : state.clickeduID,
    clickedeID : state.clickedeID,
    clickedsID : state.clickedsID,
  })
})


export default new Vuex.Store({

  plugins: [
    vuexLocal.plugin,
  ],

  modules: {
    player,
    selectedUser,
    selectedEvent,
    selectedShow,
    selectedMix,
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

    setShowSearch(state, value){
      Vue.set(state , 'showSearch' , value)
    },

    setSearchQuery(state, query){
      Vue.set(state , 'searchQuery' , query)
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
      var stateArr = Object.keys(state)
      stateArr.forEach(key => {
        if(state.key){
          Vue.delete(state, key)
        }
      })
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
      Vue.delete(state.selectedUser.playlists[payload.pName], payload.mID)      
    },

    addToHistory(state, trackData) {
      state.customer.playlists.History.push(trackData)
    },


    setuIDWatcher(state, uID){
      Vue.set(state , 'uIDWatcher', uID )
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
     
      if(payload.length > 3){
        commit( 'setShowSearch' , true)
      }else{
        commit( 'setShowSearch' , false)
      }
    },

    // eslint-disable-next-line
    createNewUser({commit} , payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(user => {
        
        firebase.firestore().collection('users').doc(user.user.uid).set({
          dateCreated: new Date(),
          name: payload.name,
          followingCount: 0,
          followerCount: 0,
          prePlaylists: ['timeline' , 'listenLater' , 'history' , 'likes'],
          createdPlaylists : [],
        }).then(() => {
            const indexUserFunction = firebase.functions().httpsCallable('indexUser')
            indexUserFunction({ name : payload.name , uID : user.user.uid })
            this.dispatch('signUserIn' , {email : payload.email , password : payload.password})
          })
      })
    },

    actionSetClickeduID({ commit }, payload) {
      commit('setClickeduID' , payload)
    },


    signUserIn({// eslint-disable-next-line
      commit
    }, payload) {
      console.log('email')
      console.log(payload.email)
      console.log('password')
      console.log(payload.password)
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
          this.noty.error(error)
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
          this.noty.error(error)
        })
    },


    getShowDetails({ commit }, showName) {
      var mixes = []
      database.collection('shows').where('name' , '==' , showName).get().then(response => {
        const eventData = response.docs[0].data()
        eventData['sID'] = response.docs[0].id
        return eventData
      }).then((response)=> {
        database.collection('shows').doc(response.sID).collection('mixes').get().then(mixDocs =>{
          mixDocs.forEach(mixDoc => {
            mixes.push(mixDoc.data())
          })
          response['mixes'] = mixes
          console.log('response')
          console.log(response)
          return response
        }).then(response => {
          commit('setShowData', response)
        })
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

    doesFollow(state) {
      return state.selectedUser.doesFollow
    },

    uIDWatcher(state){
      return state.uIDWatcher
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
