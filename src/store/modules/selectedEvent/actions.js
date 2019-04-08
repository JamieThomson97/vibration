
import * as firebase from 'firebase'
const database = firebase.firestore()

export default {


  getEventDetails({ commit }, eventName) {
    var mixes = []
    database.collection('events').where('name' , '==' , eventName).get().then(response => {
      const eventData = response.docs[0].data()
      eventData['sID'] = response.docs[0].id
      return eventData
    }).then((response)=> {
      database.collection('events').doc(response.eID).collection('mixes').get().then(mixDocs =>{
        mixDocs.forEach(mixDoc => {
          mixes.push(mixDoc.data())
        })
        response['mixes'] = mixes
        console.log('response')
        console.log(response)
        return response
      }).then(response => {
        commit('setEventData', response)
      })
    })
  },

      
  actionSetSelectedeID({ commit }, payload) {
    commit('setSelectedeID' , payload)
  },

  
  getEventDetailsID({ commit }, eID) {
    var mixes = []
    database.collection('events').doc(eID).get().then(response => {
      const eventData = response.data()
      eventData['eID'] = response.id
      return eventData
    }).then((response)=> {
      database.collection('events').doc(eID).collection('mixes').get().then(mixDocs =>{
        mixDocs.forEach(mixDoc => {
          var mix = mixDoc.data()
          mix['mID'] = mixDoc.id
          mixes.push(mix)
        })
        response['mixes'] = mixes
        console.log('response')
        console.log(response)
        return response
      }).then(response => {
        commit('setEventData', response)
      })
    })
  },

};
