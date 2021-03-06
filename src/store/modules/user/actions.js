
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
    
    const customeruID = payload.customeruID
    const uID = payload.id
    const array = payload.array
    array.forEach(foll => {
      var callFunction = firebase.functions().httpsCallable('getFollowX')
      callFunction({ uID: uID, followX: foll }).then(response => {
        if (foll == 'followers') {
          for (var a in response.data) {
            if (response.data[a].id == customeruID) {
              context.commit('doesFollow' , true)
            }
          }
        }
        context.commit('setFollowX' , { response : response.data , follX : foll})
      })
    } ) 
  },
  
  getUserTracks: () => {
    
    
  },
};
