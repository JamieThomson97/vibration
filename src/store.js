import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'
import router from './router'
// import * as _ from 'underscore'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({
    customer: state.customer
  })
})

// function findObjectByKey(array, key, value) {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i][key] === value) {
//       return array[i];
//     }
//   }
//   return false;
// }

export default new Vuex.Store({

  plugins: [
    vuexLocal.plugin,
  ],

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
    user: null,
    error: null,
    loading: false,
    drawer: true,
    right: true,
    mini: true,
    mixLoaded: false,
  },

  mutations: {

    setPlaylist(state, payload) {
      Vue.set(state.customer.playlists, payload.name , payload.object)
    },

    setuID(state, payload) {
      state.customer.uID = payload
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
      // console.log('in')
      // Vue.delete(state, 'customer')
      state.customer = {
        uID: null,
        name: null,
        profileURL: null,
        followersCount: null,
        followingCount: null,
        playlists: {},
      }
    },

    setUser(state, payload) {
      var user = {}
      user.customer = payload.user
      user.customer.uID = payload.uID
      user.customer.playlists = {} 
      user.customer.followerCount = 0
      user.customer.followingCount = 0
      console.log(user.customer)
      Vue.set(state, 'customer', user.customer)
      //Vue.set( )
    },

    // deletePlaylist(state, payload) {
    // },

    deleteMix(state, payload){
      console.log(payload.pName)
      console.log('mid')
      console.log(payload.mID)
      Vue.delete(state.customer.playlists[payload.pName], payload.mID)      
    },


  },

  actions: {

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

            console.log(error)
          })
          commit('setuID', user.user.uid)
        }).catch((error) => {
          console.log(error)
        })
    },

    signUserIn({
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
          console.log(error)
        })
    },

    logUserOut({
      commit
    }) {
      firebase.auth().signOut()
        .then(() => {
          commit('setNullUser')
          router.push({
            name: 'about'
          })
          console.log("signed out")
        }).catch((error) => {
          console.log(error)
        })
    },

    actionDeleteMix({commit}, payload){
     // this.dispatch(`customer.playlists.${payload.pName}.stream.${payload.mID}/delete`)
     commit('deleteMix', payload)
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
      console.log(payload.user)
      commit('setUser', { user : payload.user , uID : payload.uID })
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
    playlists: (state) => (pName) => {
      return (state.customer.playlists[pName])//+'.'+pName.stream)
    }, 
    followingCount(state){
      return state.customer.followingCount
    },
    followerCount(state){
      return state.customer.followerCount
    },
  },

})
