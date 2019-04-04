import firebase from 'firebase'
const database = firebase.firestore()
import playlistMixin from '../mixins/playlistMixin'

export default {

    mixins: [
        playlistMixin
 ],

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
                
                this.$store.dispatch('actionSetClickedmID', mID) 
                this.$store.dispatch('getTrackData', mID)
                database.collection('mixes').doc(mID).get().then(response => {
                    
                    this.likeCount = response.data().likeCount
                })
                database.collection('mixes').doc(mID).collection('liked').limit(10).get().then(response => {
                    
                    const documents = response.docs
                    for (var entry = 0; entry < documents.length; entry++) {
                    
                    // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
                    // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
                    const item = documents[entry].data()
                    item['uID'] = documents[entry].id
                    if(documents[entry].id === this.uID){
                        this.inLiked = entry
                    }else{
                        this.inLiked = -1
                    }
                    
                    likers.push(item)
                    }
                    
                    this.$store.dispatch('actionSetLikers', likers)
                })
            
        },
      
        setClickedmID(mID){
            this.$store.dispatch('actionSetClickedmID', mID)
        },
        
        handleClickTrack(trackData, trackID) {
            
            if (this.playerCurrentTrack && this.playerCurrentTrack.title === trackData.title) {
                this.$store.dispatch('setPlayerCurrentTrack', null);
            } else {
                trackData['mID'] = trackID 
                this.$store.dispatch('setPlayerCurrentTrack', trackData);
                this.$store.dispatch('setPlayerTracks', this.stream)
                this.addToHistory(trackData)
            }
        },

    }

}