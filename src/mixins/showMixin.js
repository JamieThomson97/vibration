//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'
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

        getShowPageData(sID) {

            //Get basic show info
            var showDataProducers = null
            var showName = null
            var suggestedMixesObj = []
            var mixCount = null
            console.log(sID)
            database.collection('shows').doc(sID).get().then(response => {
                const showData = response.data()

                showDataProducers = showData.producers
                showName = showData.name
                mixCount = showData.mixCount

                //Set basic show info to state
                this.$store.commit('setShowData', showData)
            }).then(() => {
                //Get suggested mixes from Producers
                showDataProducers.forEach(artist => {
                    var uID = artist.uID
                    database.collection('users').doc(uID).collection('mixes').limit(mixCount + 12).get().then(response => {
                        var suggestedMixes = response.docs

                        suggestedMixes.forEach(mix => {
                            var mixData = mix.data()
                            mixData['mID'] = mix.id
                            if (mixData.show) {

                                if (mixData.show !== showName) {

                                    suggestedMixesObj.push(mixData)
                                }
                            } else {

                                suggestedMixesObj.push(mixData)
                            }
                        })
                        //Set suggested mixes from artists to state


                        this.$store.commit('setSuggestedShowMixes', suggestedMixesObj)
                    })
                })

            })

            //Set show mixes
            var mixesObj = []

            database.collection('shows').doc(sID).collection('mixes').get().then(response => {
                const mixes = response.docs
                mixes.forEach(mix => {
                    var mixData = mix.data()
                    mixData['mID'] = mix.id
                    mixesObj.push(mixData)
                })
                //Set show mixes to state
                this.$store.commit('setShowMixes', mixesObj)
            })

        },



        newupdateShowImage(show, image) {
            //Will receive an image file
            //and the sID of the user
            const sID = show.sID
            console.log(show)
            const producers = show.producers

            var imageStorageRef = storage.ref('showImage/' + sID + '.jpeg')

            return imageStorageRef.put(image).then(() => {

                return imageStorageRef.getDownloadURL().then(function (URL) {

                    return URL
                })
            }).then(response => {


                const showPromise = database.collection('shows').doc(sID).update({
                    imageURL: response
                })

                var producersPromises = [showPromise]

                producers.forEach(producer => {
                    var uID = producer.uID
                    producersPromises.push(database.collection('users').doc(uID).collection('shows').doc(sID).update({
                        imageURL: response
                    }))
                })
                const updateShowIndex = firebase.functions().httpsCallable('updateShowIndex')
                const callFunction = updateShowIndex({
                    imageURL: response,
                    objectID: sID
                })
                producersPromises.push(callFunction)
                return producersPromises

            }).then((producersPromises) => {
                return Promise.all(producersPromises).then(response => {
                    console.log(response)
                })
            })
        },

        updateEventImage(event, image) {
            //Will receive an image file
            //and the sID of the user
            const eID = event.eID
            console.log(event)
            const producers = event.producers

            var imageStorageRef = storage.ref('eventImage/' + eID + '.jpeg')

            return imageStorageRef.put(image).then(() => {

                return imageStorageRef.getDownloadURL().then(function (URL) {

                    return URL
                })
            }).then(response => {


                const eventPromise = database.collection('events').doc(eID).update({
                    imageURL: response
                })

                var producersPromises = [eventPromise]

                producers.forEach(producer => {
                    var uID = producer.uID
                    producersPromises.push(database.collection('users').doc(uID).collection('events').doc(eID).update({
                        imageURL: response
                    }))
                })
                const updateEventIndex = firebase.functions().httpsCallable('updateEventIndex')
                const callFunction = updateEventIndex({
                    imageURL: response,
                    objectID: eID
                })
                producersPromises.push(callFunction)
                return producersPromises

            }).then((producersPromises) => {
                return Promise.all(producersPromises).then(response => {
                    console.log(response)
                })
            })
        },

        updateShowImage(sID, image) {
            //Will receive an image file
            //and the uID of the user

            var imageStorageRef = storage.ref('userShowImage/' + sID + '.jpeg')

            return imageStorageRef.put(image).then(() => {

                return imageStorageRef.getDownloadURL().then(function (URL) {

                    return URL
                })
            }).then(response => {

                //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia

                var updatePromises = []

                //Get every location a user is in 
                //users collection

                const userPromise = database.collection('shows').doc(sID).update({
                    imageURL: response
                })


                //in the following subcollection



                database.collection('shows').doc(sID).get().then(response => {
                    const producers = response.data().producers
                    updatePromises.push(userPromise)
                    producers.forEach(producer => {
                        updatePromises.push(database.collection('users').doc(producer.uID).collection('shows').doc(sID).update({
                            imageURL: response
                        }))
                    })

                }).then(() => {
                    return Promise.all(updatePromises)
                })
            })

        },

    },




    mixins: [
        createPlaylistMixin
    ],

}