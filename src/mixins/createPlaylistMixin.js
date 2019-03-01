import firebase from 'firebase'

export default {
  methods: {

    pullID(playlistName) {
      return new Promise(resolve => {
        const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
        
        var mIDs = []
        ref.orderBy("dateRecorded", "asc").limit(12).get().then((snapshot) => {
          const timeline = snapshot.docs
          for (var entry = 0; entry < timeline.length; entry++) {
            const item = timeline[entry].data().mID
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
            results.push(data)
          })
          resolve(results)
        })
      })
    },

  }
}