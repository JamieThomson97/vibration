import * as firebase from 'firebase'
const database = firebase.firestore()

export default {

  getUserProfile: (context, uID) => {

    database.collection('users').doc(uID).get().then(response => {
      const profile = response.data()
      profile['uID'] = uID
      context.commit('GET_USER_PROFILE_SUCCESS', profile)
      return profile
    })

  },

  getUserFollowX: (context, payload) => {

    //the 'doesFollow' object in state is set to false
    //this denotes it the logged in user follows the selectedUser
    context.commit('doesFollow', {
      does: false,
      index: -1
    })
    const customeruID = payload.customeruID
    const uID = payload.id
    const array = payload.array
    array.forEach(foll => {
      //the server side function getFollowX is called in a loop passing 'following' and 'followers'
      //getFollowX returns an array of the selectedUser's followers of following 
      var callFunction = firebase.functions().httpsCallable('getFollowX')
      callFunction({
        uID: uID,
        followX: foll
      }).then(response => {
        //for the selectedUser's followers
        if (foll == 'followers') {
          //each follower is iterated through
          for (var a in response.data) {
            //and checked to see if their userID matches the userID of the user logged in
            if (response.data[a].uID == customeruID) {
              //if there is a match, the user logged in follows the selected user, 
              //so a Vuex mutation is committed to set the value to true, with the position of the logged 
              //in user in the array also
              context.commit('doesFollow', {
                does: true,
                index: a
              })
            }
          }
        }
        //finally the set of followers of following is set to state
        context.commit('setFollowX', {
          response: response.data,
          follX: foll
        })
      })
    })
  },

  getUserTracks: () => {


  },

  actionSetSelecteduID: (context, uID) => {
    context.commit('setSelecteduID', uID)
  },

};