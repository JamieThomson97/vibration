import firebase from 'firebase'

export default {
  methods: {

    pullID(playlistName) {
      return new Promise(resolve => {
        //Ref references the playlist that this stream component is loading (e.g. timeline, history, or user created playlist, this does not query the database
        const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
        var mIDs = []
        //Actually queries the database, but only returns the 12 most recent entries
        ref.orderBy("dateRecorded", "asc").limit(12).get().then((snapshot) => {
          const timeline = snapshot.docs
          for (var entry = 0; entry < timeline.length; entry++) {
            console.log(timeline[entry].id+'  mixxxxxid')
            // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
            // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
            const item = timeline[entry].id
            mIDs.push(item)
          }
          resolve (mIDs)
        })
      })
    },

    pullMixes(mixIDs) {
      return new Promise(resolve => {
        
        const results = []
        const promises = []
        for (const mID in mixIDs) {
          const currentMix = mixIDs[mID]
          console.log(currentMix+"  currentMix")
          const promise = firebase.firestore().doc(`mixes/${currentMix}`).get()
          promises.push(promise)
        }

        return Promise.all(promises).then((mixes) => {
          mixes.forEach(mix => {
            const data = mix.data()
            data.mID = mix.id
            console.log(data)
            results.push(data)
          })
          resolve(results)
        })
      })
    },

  }
}