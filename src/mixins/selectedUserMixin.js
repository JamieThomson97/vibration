//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from './createPlaylistMixin'
import {
    mapGetters
} from 'vuex'
import * as firebase from 'firebase'
const database = firebase.firestore()
const storage = firebase.storage()

export default {



    computed: {
        ...mapGetters({
            profileURL: 'profileURL',
            uID: 'uID',
            name: 'name',
            clickeduID: 'clickeduID',
            selectedUser: 'selectedUser',
        }),


    },

    methods: {

        fetchUserDetails(uID) {

            this.$store.dispatch('getUserProfile', uID)
            this.createClickedStream(uID)
            this.$store.dispatch('getUserFollowX', {
                id: uID,
                array: ['followers', 'following'],
                customeruID: this.uID
            });
        },

        getUserShowsorEvents(uID, type) {
            //the uID of the selectedUser is passed
            //the type EG show or event is passed

            var entries = []
            //the database is queried for that user's shows or events
            database.collection('users').doc(uID).collection(type).get().then(response => {
                var docs = response.docs
                docs.forEach(doc => {
                    //the results are iterated through
                    var info = doc.data()
                    if (type == 'events') {
                        info['eID'] = doc.id
                    }
                    if (type == 'shows') {
                        info['sID'] = doc.id
                    }
                    //each result is pashed to the entried array
                    entries.push(info)
                })
                //the populated array is commited to the store
                this.$store.commit(`set${type}`, entries)
            })
        },

        updateUserImage(user, image) {
            //Will receive an image file
            //and the uID of the user
            const uID = user.uID
            var events = false
            var shows = false
            console.log(user)
            shows = user.Shows
            events = user.Events

            var imageStorageRef = storage.ref('userProfileImage/' + uID + '.jpeg')

            return imageStorageRef.put(image).then(() => {

                return imageStorageRef.getDownloadURL().then(function (URL) {

                    return URL
                })
            }).then(response => {

                var updatePromises = []

                events.forEach(event => {
                    console.log('in event loop')
                    var eID = event.eID
                    database.collection('events').doc(eID).get().then(eventDoc => {
                        var index = -1
                        const eventData = eventDoc.data()
                        const producers = eventData.producers
                        console.log('producers')
                        console.log(producers)
                        producers.forEach(function (producer, i) {
                            if (producer.uID == uID) {
                                index = i
                            }
                        })

                        producers[index]['profileURL'] = response
                        console.log('new producers')
                        console.log(producers)

                        return producers
                    }).then(producers => {
                        updatePromises.push(database.collection('events').doc(eID).update({
                            producers: producers
                        }))
                    })
                })



                shows.forEach(show => {
                    console.log('in show loop')
                    var eID = show.eID
                    database.collection('shows').doc(eID).get().then(showDoc => {
                        var index = -1
                        const showData = showDoc.data()
                        const producers = showData.producers
                        console.log('producers')
                        console.log(producers)
                        producers.forEach(function (producer, i) {
                            if (producer.uID == uID) {
                                index = i
                            }
                        })

                        producers[index]['profileURL'] = response
                        console.log('new producers')
                        console.log(producers)

                        return producers
                    }).then(producers => {
                        updatePromises.push(database.collection('shows').doc(eID).update({
                            producers: producers
                        }))
                    })
                })


                //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia



                //Get every location a user is in 
                //users collection

                const userPromise = database.collection('users').doc(uID).update({
                    profileURL: response
                })


                //in the following subcollection

                var followinguIDs = []

                database.collection('users').doc(uID).collection('following').get().then(response => {
                    response.forEach(user => {
                        var uID = user.id
                        followinguIDs.push(uID)
                    })
                }).then(() => {
                    updatePromises.push(userPromise)
                    followinguIDs.forEach(followinguID => {
                        updatePromises.push(database.collection('users').doc(followinguID).collection('followers').doc(uID).update({
                            profileURL: response
                        }))
                    })
                }).then(() => {

                    // and follower subcolletions

                    var followeruIDs = []

                    database.collection('users').doc(uID).collection('followers').get().then(response => {
                        response.forEach(user => {
                            var uID = user.id
                            followeruIDs.push(uID)
                        })
                    }).then(() => {
                        followeruIDs.forEach(followeruID => {
                            updatePromises.push(database.collection('users').doc(followeruID).collection('following').doc(uID).update({
                                profileURL: response
                            }))
                        })
                    }).then(() => {
                        return Promise.all(updatePromises).then(() => {
                            const indexNewProfile = firebase.functions().httpsCallable('updateUserProfile')
                            return indexNewProfile({
                                profileURL: response,
                                objectID: uID
                            })

                        })
                    })

                    //any shows they are in
                    //shows/[sID]/producers array of objects

                    // var showsIDs = [] //Currently profile URLs are not stored on the mix or show documents, and therefore must be retrieved upon loading of the page,
                    //Will evaluate this effect on performance and if needs changed, will change

                    // database.collection('users').doc(uID).collection('shows').get().then(response => {
                    //     response.forEach(show => {
                    //         var sID = show.id
                    //         showsIDs.push(sID)
                    //     })
                    // }).then(() => {
                    //     showsIDs.forEach(showsID => {
                    //         updatePromises.push(database.collection('show').doc(showsID).collection('shows').doc(uID).set({
                    //             profileURL : response
                    //         }))
                    //     })
                    // })            

                    // //any events they are in
                    //     //shows/[eID]/producers array of objects

                    // var eventeIDs = []

                    // database.collection('users').doc(uID).collection('events').get().then(response => {
                    //     response.forEach(event => {
                    //         var eID = event.id
                    //         eventeIDs.push(eID)
                    //     })
                    // }).then(() => {
                    //     eventeIDs.forEach(eventeID => {
                    //         updatePromises.push(database.collection('event').doc(eventeID).collection('shows').doc(uID).set({
                    //             profileURL : response
                    //         }))
                    //     })
                    // })
                })

            })
        },
    },




    mixins: [
        createPlaylistMixin
    ],

}