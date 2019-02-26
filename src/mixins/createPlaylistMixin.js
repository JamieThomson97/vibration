import firebase from 'firebase'

export default {


    methods: {
      pullID(playlistName) {
        
        const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
        var mIDs = []
        ref.orderBy("dateRecorded", "asc").limit(12).get().then((snapshot) => {
          const timeline = snapshot.docs
          for (var entry = 0; entry < timeline.length; entry++) {
            const item = timeline[entry].data().mID
            mIDs.push(item)
          }
        }) 
        return mIDs 
      },

      pullMixes(playlistName, [mixIDs]) {
        
        const results = []
        const promises = []
        console.log("mixIDs")
        console.log(mixIDs)
        console.log("mixIDs[0]")
        console.log(mixIDs[0])
        for (const mID in mixIDs) {
          const currentMix = mixIDs[mID]
          console.log("current mix")
          console.log(currentMix)      
          const promise = firebase.firestore().doc(`mixes/${currentMix}`).get()
          // promises.push(promise)
        }

        return Promise.all(promises).then((mixes) => {
          mixes.forEach(mix => {
              const data = mix.data()
              results.push(data)
          })
          console.log(results)
          return results
        })
        
      },
    
    testReturn(){
      return "hello"
    }
    }
}