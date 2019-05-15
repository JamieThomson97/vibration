import firebase from 'firebase'
const database = firebase.firestore()
import playlistMixin from '../mixins/playlistMixin'
import selectedUserMixin from '../mixins/selectedUserMixin'
import {
    mapGetters
} from 'vuex'

export default {

    mixins: [
        selectedUserMixin,
        playlistMixin

    ],

    computed: {
        ...mapGetters({
            profileURL: 'profileURL',
            uID: 'uID',
            name: 'name',
            clickeduID: 'clickeduID',
            selectedUser: 'selectedUser',
            selectedMix: 'selectedMix',
            show: 'show',
            showSearch: 'showSearch',
            customer: 'customer',
            showShow: "showShow",
        }),


    },

    methods: {

    changeShowPlayer(){
        console.log('chaging')
        this.$store.commit('SET_SHOW' , {value :!this.showShow})
    },


    //adds or removes the user to the local 'likers' and calls the server-side fuction 'likeMix' to 
    //execute the database transaction
    likeMix(mID, like) {
        //receives the liked mix' mID. "like" is Boolean denoting whether to like or un-like the mix
  
        //defines the object that will be written to state
        const likersObj = {
          name: this.name,
          uID: this.uID,
          profileURL: this.profileURL
        };
        //if the mix is being liked
        if (like) {
          //increase the selectedMixes likeCount, this automatically updates the UI
          this.likeCount = this.likeCount + 1;
          //if the currentMix' likers array has less than 10 entries
          if (this.trackData.likers.length < 10) {
            //add the object to the array
            this.trackData.likers.push(likersObj);
            //inLiked holds the index of the currentUser in the "likers" array
            //this is so the array can be easily spliced of the user if they chose to unlike the mix
            this.inLiked = this.trackData.likers.length - 1;
          }
          
        }//if the mix is being unliked 
        else {
          if (this.inLiked > -1) {
            //remove the user from the likers array, if they are in it
            this.trackData.likers.splice(this.inLiked, 1);
          }
          //update the local likeCount
          this.likeCount = this.likeCount - 1;
        }
        
        this.doesLike = !this.doesLike;
        //call the server-side likeMix function, passing the requried information
        var callFunction = firebase.functions().httpsCallable("likeMix");
        return callFunction({
          mID: mID,
          dateUploaded: this.trackData.dateUploaded,
          likeruID: this.uID,
          likerName: this.name,
          mixName: this.trackData.title,
          liked: like,
          profileURL: this.profileURL,
          producers: this.trackData.producers,
          artworkURL: this.trackData.artworkURL,
          likeCount: this.trackData.likeCount,
          playCount: this.trackData.playCount
        }).catch(error => {
          this.$noty.warning(error);
        });
      },


        fetchMixInfo(mID) {
            //recevies the mixID of the selectedMix

            //vuex action that collects the basic track data
            this.$store.dispatch('getTrackData', mID)

            //checks if the logged in user 'likes' the selectedMix
            database.collection('users').doc(this.uID).collection('liked').doc(mID).get().then(doc => {
                if (doc.exists) {
                    this.doesLike = true
                } else {
                    this.doesLike = false
                }
            })


            var likers = []

            //queries the 'mixes' collection for more detailed information about the mix and it's producer(s)
            database.collection('mixes').doc(mID).get().then(response => {

                const mixData = response.data()
                console.log(mixData)
                //sets the likeCount
                this.likeCount = response.data().likeCount
                //calls the previously getUserShowsorEvents functions on the producer of the mix,                
                this.getUserShowsorEvents(mixData.producers[0].uID, 'shows')
                this.getUserShowsorEvents(mixData.producers[0].uID, 'events')

                //queries the database about the producer
                database.collection('users').doc(mixData.producers[0].uID).get().then(response => {
                    const userData = response.data()
                    const followingCount = userData.followingCount
                    const followerCount = userData.followerCount
                    //sets the following and follower counts of the producer to state
                    this.$store.commit('setFollowCounts', {
                        followingCount: followingCount,
                        followerCount: followerCount
                    })
                })

                //if the mix is part of an event
                if (mixData.event) {
                    var event = mixData.event
                    //get that event's details
                    this.$store.dispatch('getEventDetails', event).then(() => {
                        var mixes = this.getEventMixes(event)
                        mixes.then(response => {
                            //dispatch to save in state
                            this.$store.commit("setEventMixes", response)
                        })
                    })
                }

                //if the mix is part of a show
                if (mixData.show) {
                    console.log('show')
                    var show = mixData.show
                    //get that show's details
                    this.$store.dispatch('getShowDetails', show).then(() => {
                        var mixes = this.getShowMixes(show)
                        mixes.then(response => {
                            //Dispatch to save in state
                            this.$store.commit("setShowMixes", response)
                        })
                    })
                }


                var suggestedMixesObj = []
                //for each producer on the mix
                mixData.producers.forEach(artist => {
                    var uID = artist.uID
                    //query for their 12 most recent mixes
                    database.collection('users').doc(uID).collection('mixes').limit(12).get().then(response => {
                        var suggestedMixes = response.docs
                        //nested loop through each mix for the current producer
                        suggestedMixes.forEach(mix => {
                            var mixData = mix.data()
                            mixData['mID'] = mix.id
                            //push each mix object to the suggestMixesObj array
                            suggestedMixesObj.push(mixData)
                        })
                    })
                })
                //when both loops are complete  
                //set suggested mixes to state
                this.$store.commit('setSuggestedMixMixes', suggestedMixesObj)
            })

            //the selectedMix' 'liked' subCollection is queried to return, at most, 10 users that have liked the mix
            database.collection('mixes').doc(mID).collection('liked').limit(10).get().then(response => {

                const documents = response.docs
                //for each user returned
                for (var entry = 0; entry < documents.length; entry++) {

                   

                    //here is a check to see if the logged in user is part of these 10 user
                    //if so their index in the likers array is saved so that if they unlike the mix, 
                    //that user can be spliced from the array and UI updated in real time
                    const item = documents[entry].data()
                    item['uID'] = documents[entry].id
                    //add them to the 'likers' array
                    likers.push(item)
                    if (documents[entry].id === this.uID) {
                        this.inLiked = entry
                    } else {
                        this.inLiked = -1
                    }
                }
                //the 'likers' array is saved to state
                return this.$store.dispatch('actionSetLikers', likers)

            })

        },


    }

}