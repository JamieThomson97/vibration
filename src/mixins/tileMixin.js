//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import mixMixin from '../mixins/mixMixin'
import {
    mapGetters
} from 'vuex'
import * as firebase from 'firebase'
// import { call } from 'vuex-pathify';
const database = firebase.firestore()


export default {




    mixins: [
        mixMixin,
        createPlaylistMixin
    ],

    computed: {
        ...mapGetters({
            profileURL: 'profileURL',
            uID: 'uID',
            name: 'name',
            clickeduID: 'clickeduID',
            selectedUser: 'selectedUser',
            show: 'show',
            showSearch: 'showSearch',
            customer: 'customer',
        }),


    },

    methods: {

        deleteMix(ID) {
            const passmID = ID
            var index = 0
            const mixes = this.selectedUser.playlists.mixes
            var gig = false
            var gigName = null
            var promises = []
            for (var x in mixes) {
                var mID = mixes[x].mID
                if (mID == ID) {
                    if (mixes[x].show) {
                        gig = 'shows'
                        gigName = mixes[x].show
                    }
                    if (mixes[x].event) {
                        gig = 'events'
                        gigName = mixes[x].event
                    }
                    index = x
                }
            }

            if (gig) {
                const callGigFunction = firebase.functions().httpsCallable('deleteFromShowEvent')
                promises.push(callGigFunction({
                    type: gig,
                    gatherName: gigName,
                    mID: passmID
                }))
            }
            mixes.splice(index, 1)
            this.$store.dispatch('actionDeleteMix', {
                'pName': this.collection,
                'mID': ID
            })
            const callFunction = firebase.functions().httpsCallable('deleteMix')
            promises.push(callFunction({
                mID: passmID,
                uID: this.customer.uID
            }))
            return Promise.all(promises).then(() => {
                this.$noty.success('mix deleted')
            })
        },

        //this function removes the passed mix of the passed mixID from the playlist that is passed
        removeFromPlaylist(mixData, playlist) {
            const mID = mixData.mID
            if(playlist == 'liked'){
                console.log('IN FFFF')
                var callFunction = firebase.functions().httpsCallable("likeMix");
                        return callFunction({
                            mID: mID,
                            dateUploaded: mixData.dateUploaded,
                            likeruID: this.uID,
                            likerName: this.name,
                            mixName: mixData.title,
                            liked: false,
                            profileURL: this.profileURL,
                            producers: mixData.producers,
                            artworkURL: mixData.artworkURL,
                            likeCount: mixData.likeCount,
                            playCount: mixData.playCount
                        }).then(() =>{
                            this.$noty.success('mix removed from likes, refresh to page to update');
                        }).catch(error => {
                        this.$noty.warning(error);
                        });
            }
            //database request to delete the mix by mixID from the playlist's subcollection
            database.collection('users').doc(this.uID).collection(playlist).doc(mID).delete().then(() => {
                //next the playlist is deleted locally
                this.$store.commit('deleteFromPlaylist', {
                    mID: mID,
                    playlist: playlist
                })
                //and the user is notified of success
                this.$noty.success('Mix removed from : ' + playlist)
            }).catch(error => {
                this.$noty.warning(error)
            })
        },

        //function that adds a passed mix to an array of passed playlists 
        addToPlaylist(mixData, playlists) {
          
            this.playlistSelector = false
            this.playlistChoice = null
            //check to make sure the array isn't empty
            if (playlists.length < 1 ) {
                //notifies the user that they must select atleast one playlist
                this.$noty.warning('Please select atleast one playlist')
            } else {

                //define the object to be added to the playlists
                var mixDataPass = {
                    artworkURL: mixData.artworkURL,
                    audioURL: mixData.audioURL,
                    mID: mixData.mID,
                    producers: mixData.producers,
                    title: mixData.title,
                    // uID : mixData.uID,
                    dateUploaded: mixData.dateUploaded,
                    dateAdded: new Date()
                }
                const createdPlaylists = this.customer.createdPlaylists
              
                //for each playlist passed as input
                playlists.forEach((playlistName) => {
                    var next = false
                    //edits the playlist name if it is Listen Later or Liked Mixes for simplicity reasons
                    if (playlistName == 'Listen Later') {
                        playlistName = 'listenLater'
                    }
                    if (playlistName == 'Liked Mixes') {                        
                        playlistName = 'liked'
                        //calling the likedMix server side function if the playlist selected was liked mixes
                        var callFunction = firebase.functions().httpsCallable("likeMix");
                        return callFunction({
                            mID: mixData.mID,
                            dateUploaded: mixData.dateUploaded,
                            likeruID: this.uID,
                            likerName: this.name,
                            mixName: mixData.title,
                            liked: true,
                            profileURL: this.profileURL,
                            producers: mixData.producers,
                            artworkURL: mixData.artworkURL,
                            likeCount: mixData.likeCount,
                            playCount: mixData.playCount
                        }).catch(error => {
                        this.$noty.warning(error);
                        });
                    }
                    var playlistCreated = false
                    createdPlaylists.forEach(pName => {
                        if (pName == playlistName) {
                            playlistCreated = true
                        }
                    })
                    //if the playlist already exists
                    if (this.customer.playlists[playlistName]) {
                        //iterate through each mix
                        this.customer.playlists[playlistName].forEach((mix) => {
                            //to check if the mix has already been added
                            if (mix.mID == mixData.mID) {
                                //if it has, notify the user and break out of the this part of the loop 
                                //I.E. skip to the next playlist passed as input
                                this.$noty.warning('track already in ' + playlistName)
                                next = true;
                                return
                            }
                        })
                        if (next) {
                            return;
                        }
                    }


                    
                    const uID = this.uID
                    const mID = mixData.mID
                    //add the to the playlist subCollection on the user document
                    //Note : if this is the first mix of the playlist and the subCollection has yet to be created
                    //Firebase creates the subCollection automatically upon adding its first document
                    database.collection('users').doc(uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                        //if the playlist is being created here
                        if (!playlistCreated) {
                            if (playlistName !== "listenLater" | "liked") {
                                //add the playlist to the createdPlaylist array on the user document in Firestore
                                database.collection('users').doc(uID).update({
                                    createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
                                }).then(() => {
                                    //then create the playlist locally
                                    this.$store.dispatch('actionCreatePlaylist', playlistName)
                                }).then(() => {
                                    //then add the mix to the playlist
                                    this.$store.commit('addToPlaylist', {
                                        mix: mixDataPass,
                                        playlistName: playlistName
                                    })
                                    this.$noty.success(playlistName + ' created')
                                })
                            }
                            
                            this.$store.commit('addToPlaylist', {
                                mix: mixDataPass,
                                playlistName: playlistName
                            })
                        }
                    }).catch(error => {
                        console.log(error)
                    }).then(() => {

                        //next the mix' document in the 'mixPlaylists' collection must be updated with the user and the new playlists
                        //to service the possibility of deleting the mix later
                        const ref = database.collection('mixPlaylists').doc(mID)
                        return database.runTransaction(transaction => {
                            return transaction.get(ref).then(mixDoc => {

                                const mixData = mixDoc.data()
                                const uIDs = mixData.uIDs
                                var isIn = false

                                //checks if the user has already added this mix to a playlist
                                Object.keys(uIDs).forEach(key => {
                                    if (key == uID) {
                                        isIn = true
                                    }
                                })

                                //if the user has not already added this mix to a playlist
                                if (!isIn) {

                                    //create an new object, based off of the documents current "uIDs", 
                                    //this new object adds the current userID and the playlist name to the objct
                                    var addObject = [playlistName]
                                    uIDs[uID] = (addObject)

                                } else {
                                    //if the user has already added this mix to a playlist
                                    //add has not already added this mix to the passed playlist
                                    if (!uIDs[uID].includes(playlistName)) {
                                        //push the new playlist name onto the previous uIDs object
                                        uIDs[uID].push(playlistName)
                                    } else {
                                        this.$noty.warning('already in playlist')
                                    }
                                }
                                //update the document with the new uIDs object.
                                return transaction.update(ref, {
                                    uIDs: uIDs
                                })
                            })
                        })
                    })

                })
            }
        },
        
        //function that creates a new playlist in Firestore and adds the new playlist in real time to the UI
        createPlaylist(playlistName) {
        //takes the new playlist name as it's only argument


            const playlistNames = this.customer.createdPlaylists
            var isCreated = false
            //loops through the logged-in user's already created playlists setting the 
            //isCreated variable to true if a playlist with the same name already exists
            console.log(isCreated)
            for (var a in playlistNames) {
                var name = playlistNames[a]
                if (name === playlistName) {
                    isCreated = true
                }
            }
            
            // 
            if(!isCreated){
                database.collection('users').doc(this.uID).update({
                    createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
                }).then(() => {
                    this.$store.commit('createPlaylist', playlistName)
                    this.$noty.success(playlistName + ' created')
                })
            }else{
                this.$noty.warning('playlist already created with that name')
            }
        },

        addToHistory(trackData) {

            const passedmID = trackData.mID
            var inHistory = false
            this.customer.playlists.history.forEach(mix => {
                if (mix.mID == passedmID) {
                    inHistory = true
                }
            })
            if (!inHistory) {
                console.log('add to history')
                console.log(trackData)
                console.log(this.customer.uID)
                trackData['dateAdded'] = new Date()

                database.collection('users').doc(this.customer.uID).collection('history').doc(passedmID).set(trackData).then(() => {
                    this.$store.commit('addToHistory', trackData)
                })
            } else {
                console.log('mix already in history')
            }

        },

        navigateMix(mID, title) {
            //hide search
            this.$store.commit('setShowSearch' , false)
            this.fetchMixInfo(mID)
            this.$store.dispatch('actionSetSelectedmID', mID).then(() => {
                this.$router.push(`/mixes/${(title).split(' ').join('_')}`)
            })

        },

        navigateUser(uID, name) {

            this.$store.commit('setShowSearch', false)
            this.$store.commit('setuIDWatcher', uID)
            this.$store.dispatch('actionSetSelecteduID', uID).then(() => {
                this.$router.push(`/users/${(name).split(' ').join('_')}`)
            })


        },

        navigateEvent(eID, eventName) {
            console.log('eID')
            console.log(eID)
            this.$store.commit('setShowSearch', false)
            this.$store.dispatch('actionSetSelectedeID', eID).then(() => {
                this.$router.push(`/events/${(eventName).split(' ').join('_')}`)
            })
        },

        navigateShow(sID, showName) {
            this.$store.commit('setShowSearch', false)
            this.$store.dispatch('actionSetSelectedsID', sID).then(() => {
                this.$router.push(`/shows/${(showName).split(' ').join('_')}`)
            })
        },


        //function that plays the given mix that is clicked on
        handleClickTrack(trackData, reference) {
            if (this.playerCurrentTrack && this.playerCurrentTrack.mID === trackData.mID) {
                this.$store.dispatch('setPlayerCurrentTrack', null);
            } else {

                this.$store.dispatch('setPlayerCurrentTrack', trackData);
                switch (reference) {
                    case 'show.mixes':
                        console.log('in showixes')
                        this.$store.dispatch('setPlayerTracks', this.show.mixes)
                        break;
                    case 'show.suggestedMixes':
                        console.log('in showixes')
                        this.$store.dispatch('setPlayerTracks', this.show.suggestedMixes)
                        break;
                    case 'producer.mixes':
                        this.$store.dispatch('setPlayerTracks', this.selectedUser.playlists.mixes)
                        break;
                    case 'events.mixes':
                        this.$store.dispatch('setPlayerTracks', this.selectedEvent.mixes)
                        break;
                    case 'listenLater':
                        this.$store.dispatch('setPlayerTracks', this.customer.playlists.listenLater)
                        break;
                    case 'history':
                        this.$store.dispatch('setPlayerTracks', this.customer.playlists.history)
                        break;
                    default:
                        this.$store.dispatch('setPlayerTracks', this.customer.playlists[reference])
                }
                this.$store.commit('SET_SHOW', {value : true})
                this.addToHistory(trackData)
                this.addPlay(trackData)
            }
        },

        addPlay(trackData) {
            const mID = trackData.mID
            const ref = database.collection('mixes').doc(mID)
            return database.runTransaction(transaction => {
                return transaction.get(ref).then(mixDoc => {

                    const mixData = mixDoc.data()
                    console.log(mixData)
                    const playCount = mixData.playCount

                    const newPlayCount = playCount + 1


                    return transaction.update(ref, {
                        playCount: newPlayCount
                    })
                })
            })
        }



        // updateUserImage(uID, image){
        // //Will receive an image file
        // //and the uID of the user

        // var imageStorageRef = storage.ref('userProfileImage/'+uID+'.jpeg')

        // return imageStorageRef.put(image).then(() => {

        //     return imageStorageRef.getDownloadURL().then(function(URL) {

        //         return URL
        //     })
        // }).then(response => {

        //     //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia

        //     var updatePromises = []

        //     //Get every location a user is in 
        //         //users collection

        //         const userPromise = database.collection('users').doc(uID).set({
        //             profileURL : response
        //         })


        //         //in the following subcollection

        //         var followinguIDs = []

        //         database.collection('users').doc(uID).collection('following').get().then(response => {
        //             response.forEach(user => {
        //                 var uID = user.id
        //                 followinguIDs.push(uID)
        //             })
        //         }).then(() => {
        //             updatePromises.push(userPromise)
        //             followinguIDs.forEach(followinguID => {
        //                 updatePromises.push(database.collection('users').doc(followinguID).collection('followers').doc(uID).set({
        //                     profileURL : response
        //                 }))
        //             })
        //         }).then(() => {

        //             // and follower subcolletions

        //             var followeruIDs = []

        //             database.collection('users').doc(uID).collection('followers').get().then(response => {
        //                 response.forEach(user => {
        //                     var uID = user.id
        //                     followeruIDs.push(uID)
        //                 })
        //             }).then(() => {
        //                 followeruIDs.forEach(followeruID => {
        //                     updatePromises.push(database.collection('users').doc(followeruID).collection('following').doc(uID).set({
        //                         profileURL : response
        //                     }))
        //                 })
        //             }).then(() => {
        //                 return Promise.all(updatePromises)
        //             })

        //             //any shows they are in
        //                 //shows/[sID]/producers array of objects

        //             // var showsIDs = [] //Currently profile URLs are not stored on the mix or show documents, and therefore must be retrieved upon loading of the page,
        //                                 //Will evaluate this effect on performance and if needs changed, will change

        //             // database.collection('users').doc(uID).collection('shows').get().then(response => {
        //             //     response.forEach(show => {
        //             //         var sID = show.id
        //             //         showsIDs.push(sID)
        //             //     })
        //             // }).then(() => {
        //             //     showsIDs.forEach(showsID => {
        //             //         updatePromises.push(database.collection('show').doc(showsID).collection('shows').doc(uID).set({
        //             //             profileURL : response
        //             //         }))
        //             //     })
        //             // })            

        //             // //any events they are in
        //             //     //shows/[eID]/producers array of objects

        //             // var eventeIDs = []

        //             // database.collection('users').doc(uID).collection('events').get().then(response => {
        //             //     response.forEach(event => {
        //             //         var eID = event.id
        //             //         eventeIDs.push(eID)
        //             //     })
        //             // }).then(() => {
        //             //     eventeIDs.forEach(eventeID => {
        //             //         updatePromises.push(database.collection('event').doc(eventeID).collection('shows').doc(uID).set({
        //             //             profileURL : response
        //             //         }))
        //             //     })
        //             // })
        //         })

        //     })
        // },

    },

}