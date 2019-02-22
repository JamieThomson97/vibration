import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'
import router from './router'
//import * as _ from 'underscore'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({customer: state.customer})
})

export default new Vuex.Store({

  plugins: [
    vuexLocal.plugin,
  ],

    appTitle: 'Vibration',
    state: {
      customer:{
          uID: null,
          name: null,
          profileURL: null,
          followersCount: null,
          followingCount: null,
          mixes: {},
          IDs: {
            timeline: {},
            listenLater: {},
            history: {},
          },
          Streams: {
            timeline: {},
            listenLater: {},
            history: {},
        },
      },
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
    setuID (state, payload) {
      state.customer.uID = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },

    setmID (state, payload) {
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
    setName(state , payload){
      state.customer.name = payload
    },
    setProfileURL(state , payload){
      state.customer.profileURL = payload
    },
    setFollowersCounts(state , payload){
      state.customer.followersCount = payload
    },
    setFollowingCount(state , payload){
      state.customer.followingCount = payload
    },

    setNullUser(state){
      state.customer = {
        uID: null,
        name: null,
        profileURL: null,
        followersCount: null,
        followingCount: null,
        IDs: {
          timeline: {},
          listenLater: {},
          history: {},
        },
        Streams: {
          timeline: {},
          listenLater: {},
          history: {},
        }
      }
    },

    setCustomerMixes(state , payload){
      state.customer.mixes = payload
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
          commit('setuID', user.user.uid)
          // localStorage.setItem('auth', newUser.ID)
        }).catch((error) => {
          console.log(error)
        })
    },

    signUserIn({ commit }, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          commit('setuID', user.user.uid)
          console.log("getter     "+user.user.uid)
            const ref = firebase.firestore().collection('users').doc(user.user.uid)            
            ref.get().then((snapshot) => {
                console.log(snapshot.data().mixes)
                this.dispatch("actionSetUser", {
                  name : snapshot.data().name,
                  profileURL: snapshot.data().profileURL,  
                  customerMixes: snapshot.data().mixes,
                }).then(() => {
                  router.push({ name: 'home'})
                })
            })
        }).catch((error) => {
          console.log(error)
        })
    },

    logUserOut({ commit }) {
      firebase.auth().signOut()
        .then(() => {
          commit('setNullUser')
          router.push({ name: 'about'})
          console.log("signed out")          
        }).catch((error) => {
          console.log(error)
        })
    },

    actionSetmID({commit} , payload){ 
      
      commit(`setmID`, payload)
      
    },
    actionSetStream({commit} , payload){
      
      commit('setStream', payload)
    },
    setActionMixLoaded({commit}){
      commit('setMixLoaded', true)
    },
    

    actionSetUser({commit} , payload){
      if(payload.uID){
        commit('setuID' , payload.uID)
      }
      if(payload.name){
        commit('setName' , payload.name)
      }
      if(payload.profileURL){
        commit('setProfileURL' , payload.profileURL)
      }
      if(payload.followersCount){
        commit('setFollowersCount' , payload.followersCount)
      }
      if(payload.followingCount){
        commit('setFollowingCount' , payload.followingCount)
      }
      if(payload.customerMixes){
        commit('setCustomerMixes' , payload.customerMixes)
      }
    }


  },

  getters: {
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
    name(state){
      return state.customer.name
    },
    profileURL(state){
      return state.customer.profileURL
    },
    customerMixes(state){
      return state.customer.mixes
    }
  },

})
