<script>

 setSelectedmID(state, mID) {
    Vue.set(state, 'mID', mID)
  },




signUserIn({ // eslint-disable-next-line
      commit
    }, payload) {
      //payload is the object that contains data passed to the action
      //the Firebase function signInWithEmailAndPassword returns the user data if the authentication is successful, 
      //and an error message if successful
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then((user) => {
          const uID = user.user.uid
          //the user object, returned from signInWithEmailAndPassword, is used to query the 'users' collection
          //from the Firestore database, to retrieve data about the user
          const ref = firebase.firestore().collection('users').doc(user.user.uid)
          ref.get().then((snapshot) => {
            //'actionSetUser' dispatches the mutution that saves the information returned from the query to state
            this.dispatch("actionSetUser", {
              user: snapshot.data(),
              uID: uID
              //finally the user is pushed to the 'home' component
            }).then(() => {
              router.push({
                name: 'home'
              })
            })
          })
          //if the authentication fails, the user is notified of the error
        }).catch((error) => {
          this.noty.error(error)
        })
    },

logUserOut({
      commit
    }) {
      //the Firebase function signOut(), terminates the user session within Firebase 
      firebase.auth().signOut()
        .then(() => {
          //'setNullUser' deletes the customer object from the store
          commit('setNullUser')
        }).catch((error) => {
          //notifies the user of the error if signOut is unsuccessful
          this.noty.error(error)
        })
    },

   createNewUser({
      // eslint-disable-next-line
      commit
    }, payload) {
      //the Firebase function createUserWithEmailAndPassword returns an userID 
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(user => {
        //here a new document is created in the 'users' collection with the new uID returned from the above function
        firebase.firestore().collection('users').doc(user.user.uid).set({
          //the default state for a new user is defined
          dateCreated: new Date(),
          name: payload.name,
          followingCount: 0,
          followerCount: 0,
          prePlaylists: ['timeline', 'Listen Later', 'history', 'liked'],
          createdPlaylists: [],
        }).then(() => {
          //a server-side Firebase function called 'indexUser' is called to save the new user to the Algolia index
          const indexUserFunction = firebase.functions().httpsCallable('indexUser')
          indexUserFunction({
            name: payload.name,
            uID: user.user.uid
          })
          //finally the 'signUserIn' action is called to save the user info to state
          this.dispatch('signUserIn', {
            email: payload.email,
            password: payload.password
          })
        })
      })
    },



    </script>