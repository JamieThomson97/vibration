import firebase from 'firebase'
const database = firebase.firestore()

export default {

 

  methods: {

    pullID(playlistName) {
      return new Promise(resolve => {
        //Ref references the playlist that this stream component is loading (e.g. timeline, history, or user created playlist, this does not query the database
        const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
        var mIDs = {}
        //Actually queries the database, but only returns the 12 most recent entries
        ref.orderBy("dateUploaded", "asc").limit(12).get().then((snapshot) => {
          const timeline = snapshot.docs
          for (var entry = 0; entry < timeline.length; entry++) {
            // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
            // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
            const item = timeline[entry].data()
            mIDs[timeline[entry].id] = item
          }
          resolve (mIDs)
        })
      })
    },

    getSubCollectionbyDate(subCollection, amount){

      var results = []
      const uID = this.$store.getters.uID      
      const query = database.collection('users').doc(uID).collection(subCollection).orderBy("dateUploaded", "DESC").limit(amount)

      return query.get().then((snapshot) => {
        const documents = snapshot.docs
        for (var entry = 0; entry < documents.length; entry++){
          
          // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
          // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
          const item = documents[entry].data()
        
          results.push(item)
          
        }
        return (results)
      }).catch((error) => {
        console.log(error)
      })
    },

    async createStream(streamComponents) {

      var mixIDs = []
      var objects = []
      for (let comp in streamComponents) {
        if (!this.$store.getters.playlists[streamComponents[comp]]) {
          objects[comp] = {}
          mixIDs[comp] = await this.pullID(streamComponents[comp])
          
          if (Object.keys(mixIDs[comp]).length > 0) {

            await this.$store.commit("setPlaylist", {
              object: mixIDs[comp],
              name: this.streamComponents[comp]
            })
          } else {
            console.log("No mixes found")
          }
        }
      }
    }

  }
}