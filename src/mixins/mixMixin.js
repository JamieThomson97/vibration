import firebase from 'firebase'
const database = firebase.firestore()
import playlistMixin from '../mixins/playlistMixin'
import selectedUserMixin from '../mixins/selectedUserMixin'

export default {

    mixins: [
        selectedUserMixin,
        playlistMixin

 ],

  methods: {



        fetchMixInfo(mID){

            
                var likers = []
                database.collection('users').doc(this.uID).collection('liked').doc(mID).get().then(doc=> {
                    if(doc.exists){
                        this.doesLike = true
                    }else{
                        this.doesLike = false
                    }
                })
                
                
                this.$store.dispatch('getTrackData', mID)
                database.collection('mixes').doc(mID).get().then(response => {

                    const mixData =  response.data()    
                    console.log(mixData)               
                    this.likeCount = response.data().likeCount
                    this.getUserShowsorEvents(mixData.producers[0].uID , 'shows')
                    this.getUserShowsorEvents(mixData.producers[0].uID, 'events')
                    console.log(mixData.producers[0].name)
                    database.collection('users').doc(mixData.producers[0].uID).get().then(response => {
                        const userData = response.data()
                        console.log('userData')
                        console.log(userData)
                        const followingCount = userData.followingCount
                        const followerCount = userData.followerCount
                        this.$store.commit('setFollowCounts' , {  followingCount : followingCount , followerCount : followerCount })
                    })
                    if(mixData.event){
                        console.log('event')
                        var event = mixData.event
                        
                        this.$store.dispatch('getEventDetails', event).then(() => {
                        var mixes = this.getEventMixes(event) 
                            mixes.then(response => {
                            //Dispatch to save in state
                            this.$store.commit("setEventMixes", response)  
                            })
                        })
                    }
                    
                    if(mixData.show){
                        console.log('show')
                        var show = mixData.show
                        this.$store.dispatch('getShowDetails', show).then(() => {
                            
                            var mixes = this.getShowMixes(show) 
                            mixes.then(response => {
                            
                                //Dispatch to save in state
                                this.$store.commit("setShowMixes", response)  
                                })
                        })
                    }
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
                    return 
                })
            
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