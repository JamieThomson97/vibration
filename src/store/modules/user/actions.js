
import * as firebase from 'firebase'
const database = firebase.firestore()
import store from '../../../store'
  
export default {



  getUserProfile: (context, uID) => {
    console.log('getUserProfile')
    database.collection('users').doc(uID).get().then(response => {
      const profile = response.data()
      profile['uID'] = uID
      context.commit('GET_USER_PROFILE_SUCCESS', profile)
      return profile
    })
  },
  /*
  getUserFollowings: (context, id) => {
    
  },
  */
  
  getUserTracks: () => {
    console.log('getUserTracks')
    
  },
};
