import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'
//import * as _ from 'underscore'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    user: state.user,

  })
})

const vuexSession = new VuexPersistence({
  storage: window.sessionStorage,
  reducer: (/*state*/) => ({
   
  })
})

export default new Vuex.Store({

  plugins: [
    vuexLocal.plugin,
    vuexSession.plugin
  ],

  state: {
    appTitle: 'Vibration',
    user: null,
    error: null,
    loading: false,
    drawer:true,
    right: true,
    mini:true,
    ID_Timeline: {},
    Stream_Timeline: {},
    ID_ListenLater: {},
    Stream_ListenLater: {},
    ID_History: {},
    Stream_History: {},
    mixLoaded: false,
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setID (state, payload) {
      
      if(payload.type=="timeline"){
        state.ID_Timeline = payload.array
      }else if(payload.type=="listenLater"){
        state.ID_ListenLater = payload.array
      }else if(payload.type=="history"){
        state.ID_History = payload.array
      }
    },
    setStream (state, payload) {
      if(payload.type=="timeline"){
        state.Stream_Timeline = payload.stream
      }else if(payload.type=="listenLater"){
        state.Stream_ListenLater = payload.stream
      }else if(payload.type=="history"){
        state.Stream_History = payload.stream
      }
    },
    setMixLoaded(state){
      state.mixLoaded = true
    },
  },

  actions: {

    signUserUp({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          firebase.firestore().collection('users').doc(user.user.uid).set({
            name: payload.name,
            mixes: [],
            timeline: [],
            history: [],
            listenLater: [],
            following: [],
            followers: [],
            playlists: {}
          }).then(() => {
            
          }).catch((error) =>{
            
            console.log(error)
          })
          
          const newUser = {
            id: user.user.uid,
          }
          commit('setUser', newUser)
          // localStorage.setItem('auth', newUser.ID)
        }).catch((error) => {
          console.log(error)
        })
    },

    signUserIn({ commit }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
            
          console.log(user)
          const newUser = {
            id: user.user.uid,
          }
          commit('setUser', newUser)
          // localStorage.setItem('auth', newUser.ID)
        }).catch((error) => {
          console.log(error)
        })
    },

    logUserOut({ commit }) {
      firebase.auth().signOut()
        .then(() => {
          
          commit('setUser', null)
          
        }).catch((error) => {
          console.log(error)
        })
    },

    setNullUser({commit}){
      commit('setUser', null)
      console.log("setting")
    },

    actionSetID({commit} , payload){
      
      commit(`setID`, payload)
      
    },
    actionSetStream({commit} , payload){
      
      commit('setStream', payload)
    },
    setActionMixLoaded({commit}){
      commit('setMixLoaded', true)
    },


  },

  getters: {
    user(state) {
      return state.user
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
    ID_Timeline(state) {
      return state.ID_Timeline
    },
    Stream_Timeline(state) {
      return state.Stream_Timeline
    },
    ID_ListenLater(state) {
      return state.ID_ListenLater
    },
    Stream_ListenLater(state) {
      return state.Stream_ListenLater
    },
    ID_History(state) {
      return state.ID_History
    },
    Stream_History(state) {
      return state.Stream_History
    },
    mixLoaded(state) {
      return state.mixLoaded
    },
  },

})
