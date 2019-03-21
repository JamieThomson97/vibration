import firebase from 'firebase'
const database = firebase.firestore()

export default {

 

  methods: {



        fetchMixInfo(mID){
            var likers = []
            database.collection('users').doc(this.uID).collection('likedMixes').doc(mID).get().then(doc=> {
                if(doc.exists){
                    this.doesLike = true
                }else{
                    this.doesLike = false
                }
            })
            this.$store.dispatch('getTrackData', mID)
            database.collection('mixes').doc(mID).get().then(response => {
                console.log(response.data().likeCount)
                this.likeCount = response.data().likeCount
            })
            database.collection('mixes').doc(mID).collection('liked').limit(10).get().then(response => {
                
                const documents = response.docs
                for (var entry = 0; entry < documents.length; entry++) {
                
                // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
                // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
                const item = documents[entry].data()
                item['uID'] = documents[entry].id
                
                likers.push(item)
                }
                console.log(likers)
                this.$store.dispatch('actionSetLikers', likers)
            })
        }

    }

}