//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import {
    mapGetters
} from 'vuex'
import * as firebase from 'firebase'
// import { call } from 'vuex-pathify';
const database = firebase.firestore()


export default {



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
            console.log('passmID')
            console.log(passmID)
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
            console.log('gig')
            console.log(gig)
            console.log(gigName)

            if (gig) {
                const callGigFunction = firebase.functions().httpsCallable('deleteFromShowEvent')
                promises.push(callGigFunction({
                    type: gig,
                    gatherName: gigName,
                    mID: passmID
                }))
            }
            console.log('index')
            console.log(index)
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
            console.log('promises.length')
            console.log(promises.length)
            return Promise.all(promises).then(() => {
                console.log('done')
            })
        },


        removeFromPlaylist(mID, collection) {
            console.log(collection)
            //database.collection('mixPlaylists').doc(mID).get()  // see commented below
            database.collection('users').doc(this.uID).collection(collection).doc(mID).delete().then(() => {
                this.$store.commit('deleteFromPlaylist', {
                    mID: mID,
                    playlist: collection
                })
                this.$noty.success('Mix removed from : ' + collection)
            })

            // .then(response => {
            //     var playlistData = response.data().uIDs[this.uID] //start of removing playlist name from mixPlaylists collection
            //     var index = playlistData.indexOf(collection)      // not sure about ROI so abandoning for now
            //     playlistData.splice(index, 1)
            //     return playlistData
            // }).then(newArray => [

            // ])
        },

        addToPlaylist(mixData, playlists) {
            console.log('mixData')
            console.log(mixData)

            this.playlistSelector = false
            this.playlistChoice = null
            console.log(mixData)
            console.log(playlists)
            if (playlists == null) {
                this.$noty.warning('Please select atleast one playlist')
            } else {

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
                //const customer = this.customer

                playlists.forEach((playlistName) => {
                    var next = false
                    if (playlistName == 'Listen Later') {
                        playlistName = 'listenLater'
                    }
                    if (playlistName == 'Liked Mixes') {

                        playlistName = 'liked'
                    }
                    var playlistCreated = false
                    createdPlaylists.forEach(pName => {

                        if (pName == playlistName) {
                            playlistCreated = true
                        }
                    })
                    console.log('this.customer.playlists[playlistName]')
                    console.log(this.customer.playlists[playlistName])

                    if (this.customer.playlists[playlistName]) {
                        this.customer.playlists[playlistName].forEach((mix) => {
                            if (mix.mID == mixData.mID) {
                                console.log('track already in ' + playlistName)
                                next = true;
                                return
                            }
                        })
                        if (next) {
                            return;
                        }
                    }


                    console.log('above DB Call')
                    const uID = this.uID
                    const mID = mixData.mID
                    database.collection('users').doc(uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                        if (!playlistCreated) {
                            if (playlistName !== "listenLater" | "liked") {

                                database.collection('users').doc(uID).update({
                                    createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
                                }).then(() => {
                                    this.$store.dispatch('actionCreatePlaylist', playlistName)
                                }).then(() => {
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
                        // else{
                        //     this.$store.commit('addToPlaylist' , {mix : mixDataPass , playlistName : playlistName})                                                                                                                                                                             
                        // }


                    }).catch(error => {
                        console.log(error)
                    }).then(() => {


                        const ref = database.collection('mixPlaylists').doc(mID)
                        return database.runTransaction(transaction => {
                            return transaction.get(ref).then(mixDoc => {

                                const mixData = mixDoc.data()
                                console.log(mixData)
                                const uIDs = mixData.uIDs
                                var isIn = false

                                Object.keys(uIDs).forEach(key => {
                                    if (key == uID) {
                                        isIn = true
                                    }
                                })

                                if (!isIn) {

                                    var addObject = [playlistName]
                                    // //if not 
                                    uIDs[uID] = (addObject)

                                } else {
                                    if (!uIDs[uID].includes(playlistName)) {
                                        uIDs[uID].push(playlistName)
                                    } else {
                                        console.log('already in playlist')
                                    }
                                }


                                return transaction.update(ref, {
                                    uIDs: uIDs
                                })
                            })
                        })
                    })

                })
            }
        },

        createPlaylist(playlistName) {

            const playlistNames = this.customer.playlistNames

            for (var a in playlistNames) {
                var name = playlistNames[a]
                if (name === playlistName) {
                    return 'Playlist aready created'
                }
            }

            database.collection('users').doc(this.uID).update({
                createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
            }).then(() => {
                this.$store.commit('createPlaylist', playlistName)
                this.$noty.success(playlistName + ' created')
            })

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
            console.log('navigate Mix')
            console.log(mID)
            this.$store.commit('setShowSearch', false)
            this.$store.dispatch('actionSetSelectedmID', mID).then(() => {
                this.$router.push(`/mixes/${(title).split(' ').join('_')}`)
            })

        },

        navigateUser(uID, name) {

            this.$store.commit('setShowSearch', false)
            this.$store.commit('setuIDWatcher', uID)
            this.$store.dispatch('actionSetSelecteduID', uID).then(() => {
                console.log('pushing')
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

        handleClickTrack(trackData, reference) {
            console.log('trackData')
            console.log(trackData)
            console.log('reference')
            console.log(reference)
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


    mixins: [
        createPlaylistMixin
    ],

}