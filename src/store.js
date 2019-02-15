import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({user: state.user})
})

export default new Vuex.Store({

  plugins: [vuexLocal.plugin],

  state: {
    appTitle: 'Vibration',
    user: null,
    error: null,
    loading: false,
    drawer:true,
    right: true,
    mini:true,
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
    }
  },

  actions: {

    signUserUp({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
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
          // console.log("signed out")
          commit('setUser', null)
          // alert("Logged Out")
        }).catch((error) => {
          console.log(error)
        })
    }




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
  },

})
