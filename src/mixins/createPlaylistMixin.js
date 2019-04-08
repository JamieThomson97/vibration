import firebase from 'firebase'
const database = firebase.firestore()
import { mapGetters } from 'vuex'

export default {

  computed: {
    ...mapGetters({
        profileURL : 'profileURL',
        uID : 'uID',
        name : 'name',
        clickeduID : 'clickeduID',
        selectedUser : 'selectedUser',
        customer: 'customer',
    }),

},
 

  methods: {

    // pullID(playlistName) {
    //   return new Promise(resolve => {
    //     //Ref references the playlist that this stream component is loading (e.g. timeline, history, or user created playlist, this does not query the database
    //     const ref = database.collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
    //     var mIDs = {}
    //     //Actually queries the database, but only returns the 12 most recent entries
    //     ref.orderBy("dateUploaded", "asc").limit(12).get().then((snapshot) => {
    //       const timeline = snapshot.docs
    //       for (var entry = 0; entry < timeline.length; entry++) {
    //         // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
    //         // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
    //         const item = timeline[entry].data()
    //         mIDs[timeline[entry].id] = item
    //       }
    //       resolve(mIDs)
    //     })
    //   })
    // },

    getSubCollectionNoDate(playlistName) {
      return new Promise(resolve => {
        //Ref references the playlist that this stream component is loading (e.g. timeline, history, or user created playlist, this does not query the database
        const ref = database.collection('users').doc(`${this.$store.getters.uID}`).collection(playlistName)
        var mIDs = {}
        //Actually queries the database, but only returns the 12 most recent entries
        ref.limit(5).get().then((snapshot) => {
          const timeline = snapshot.docs
          for (var entry = 0; entry < timeline.length; entry++) {
            // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
            // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
            const item = timeline[entry].data()
            mIDs[timeline[entry].id] = item
          }
          resolve(mIDs)
        })
      })
    },

    // getSubCollectionbyDate(subCollection, amount) {

    //   var results = []
    //   const uID = this.$store.getters.uID
    //   const query = database.collection('users').doc(uID).collection(subCollection).orderBy("dateUploaded", "DESC").limit(amount)

    //   return query.get().then((snapshot) => {
    //     const documents = snapshot.docs
    //     for (var entry = 0; entry < documents.length; entry++) {
          
    //       // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
    //       // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
    //       const item = documents[entry].data()
        
    //       results.push(item)
          
    //     }
    //     return (results)
    //   }).catch((error) => {
    //     
    //   })
    // },

    // async createStream(streamComponents) {
      
    //   var mixIDs = []
    //   var objects = []
    //   for (let comp in streamComponents) {
        
    //     if (!this.$store.getters.playlists[streamComponents[comp]]) {
    //       
    //       
          
    //       objects[comp] = {}
    //       mixIDs[comp] = await this.pullID(streamComponents[comp])
          
          
    //       if (Object.keys(mixIDs[comp]).length > 0) {

    //         await this.$store.commit("setPlaylist", {
    //           object: mixIDs[comp],
    //           name: this.streamComponents[comp]
    //         })
    //       } else {
    //         
    //       }
    //     }
    //   }
    // },

    getClickedMixes(uID) {
      return new Promise(resolve => {
        //Ref references the playlist that this stream component is loading (e.g. timeline, history, or user created playlist, this does not query the database
        const ref = database.collection('users').doc(uID).collection('mixes')
        var mIDs = []
        //Actually queries the database, but only returns the 12 most recent entries
        ref.orderBy("dateUploaded", "asc").limit(12).get().then((snapshot) => {
          const mixes = snapshot.docs
          mixes.forEach(mix => {
            const item = mix.data()
            item['mID'] = mix.id
            mIDs.push(item)
          }) 
            // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
            // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
            resolve(mIDs)
          
          
        })
      })
    },

    async createClickedStream(uID) {
      
      var mixIDs = []
      var objects = []
      
      objects['mixes'] = {}
      mixIDs['mixes'] = await this.getClickedMixes(uID)
          
      if (Object.keys(mixIDs['mixes']).length > 0) {

        await this.$store.commit("setClickedPlaylist", {
          object: mixIDs['mixes']
        })
      } else {
        this.$noty.error("Could not find any mixes in mixes")
      }
    },

    // fetchMixes(path, uID){
    //   var path = 'collection("users").doc()
    // }
    
    async fetchPlaylists(playlistNames) {
      
      var mixIDs = []
      var objects = []
      for (let comp in playlistNames) {
        
        if (!this.$store.getters.playlists[playlistNames[comp]]) {
          
          objects[comp] = {}
          mixIDs[comp] = await this.getSubCollectionNoDate(playlistNames[comp])
          
          if (Object.keys(mixIDs[comp]).length > 0) {

            await this.$store.commit("setPlaylist", {
              object: mixIDs[comp],
              name: playlistNames[comp]
            })
          } else {
            console.log("No mixes found")
          }
        }
      }
    },

    getTimeline(){
      console.log('getTimeline')

      var mixesArray = []
      return new Promise(resolve => {
        database.collection('users').doc(this.uID).collection('timeline').orderBy('dateUploaded', 'asc').limit(12).get().then(response => {
          var mixes = response.docs
          mixes.forEach(mix => {
            
            var mixInfo = mix.data()
            console.log(mixInfo)
            mixInfo['mID'] = mix.id
            mixesArray.push(mixInfo)
          })
          resolve (mixesArray)
        })
      })
    },

    getPlaylist(playlistName, limit) {
      
      var mixesArray = []
      return new Promise(resolve => {
        database.collection('users').doc(this.uID).collection(playlistName).orderBy('dateAdded', 'asc').limit(limit).get().then(response => {
          var mixes = response.docs
          mixes.forEach(mix => {
            var mixInfo = mix.data()
            mixInfo['mID'] = mix.id
            mixesArray.push(mixInfo)
          })
          resolve (mixesArray)
        })
      }) 
    },

    getEventMixes(eID){
      console.log('get event mixes')
      var mixesArray = []
      return new Promise(resolve => {
        database.collection('events').doc(eID).collection('mixes').limit(12).get().then(response => {
          var mixes = response.docs
          mixes.forEach(mix => {
            var mixInfo = mix.data()
            mixInfo['mID'] = mix.id
            console.log('mixInfo')
            console.log(mixInfo)
            mixesArray.push(mixInfo)
          })
          resolve (mixesArray)
        })
      }) 
    },

    getShowMixes(eID){

      var mixesArray = []
      return new Promise(resolve => {
        database.collection('shows').doc(eID).collection('mixes').limit(12).get().then(response => {
          var mixes = response.docs
          mixes.forEach(mix => {
            var mixInfo = mix.data()
            mixInfo['mID'] = mix.id
            mixesArray.push(mixInfo)
          })
          resolve (mixesArray)
        })
      }) 
    },



  }
}
