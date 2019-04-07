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
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser : 'selectedUser',
        }),


    },

    methods: {

        getShowPageData(sID){

            //Get basic show info
            var showDataProducers = null
            var showName  = null
            var suggestedMixesObj = []
            var mixCount = null
            console.log(sID)
            database.collection('shows').doc(sID).get().then(response  => {
                const showData = response.data()
               
                showDataProducers = showData.producers
                showName = showData.name
                mixCount = showData.mixCount
                
                //Set basic show info to state
                this.$store.commit('setShowData' , showData)
            }).then(() => {
                //Get suggested mixes from Producers
                showDataProducers.forEach(artist => {
                    var uID = artist.uID
                    database.collection('users').doc(uID).collection('mixes').limit(mixCount+12).get().then(response =>{
                        var suggestedMixes = response.docs
                        
                        suggestedMixes.forEach(mix => {
                            var mixData = mix.data()
                            mixData['mID'] = mix.id
                            if(mixData.show){
                                
                                if(mixData.show !== showName){
                                    
                                    suggestedMixesObj.push(mixData)
                                }
                            }else{
                                
                                suggestedMixesObj.push(mixData)
                            }    
                        })
                        //Set suggested mixes from artists to state
                        
                        
                        this.$store.commit('setSuggestedShowMixes' , suggestedMixesObj)
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
                this.$store.commit('setShowMixes' , mixesObj)
            })

        }

    },

    updateShowImage(sID, image){
        //Will receive an image file
        //and the uID of the user

        var imageStorageRef = storage.ref('userShowImage/'+sID+'.jpeg')

        return imageStorageRef.put(image).then(() => {
            
            return imageStorageRef.getDownloadURL().then(function(URL) {
                
                return URL
            })
        }).then(response => {

            //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia

            var updatePromises = []

            //Get every location a user is in 
                //users collection

                const userPromise = database.collection('shows').doc(sID).update({
                    imageURL : response
                })
                

                //in the following subcollection
                
               

                database.collection('shows').doc(sID).get().then(response => {
                    const producers = response.data().producers
                    updatePromises.push(userPromise)
                    producers.forEach(producer => {
                        updatePromises.push(database.collection('users').doc(producer.uID).collection('shows').doc(sID).update({
                            imageURL : response
                        }))
                    })
                    
                }).then(() => {
                    return Promise.all(updatePromises)
                })

                // database.collection('users').doc(sID).collection('following').get().then(response => {
                //     response.forEach(user => {
                //         var sID = user.id
                //         followingsIDs.push(sID)
                //     })
                // }).then(() => {
                //     updatePromises.push(userPromise)
                //     followingsIDs.forEach(followingsID => {
                //         updatePromises.push(database.collection('users').doc(followingsID).collection('followers').doc(sID).update({
                //             profileURL : response
                //         }))
                //     })
                // }).then(() => {

                //     // and follower subcolletions

                //     var followersIDs = []

                //     database.collection('users').doc(sID).collection('followers').get().then(response => {
                //         response.forEach(user => {
                //             var sID = user.id
                //             followersIDs.push(sID)
                //         })
                //     }).then(() => {
                //         followersIDs.forEach(followersID => {
                //             updatePromises.push(database.collection('users').doc(followersID).collection('following').doc(sID).update({
                //                 profileURL : response
                //             }))
                //         })
                //     }).then(() => {
                //         return Promise.all(updatePromises).then(()=>{
                //             const indexNewProfile = firebase.functions().httpsCallable('updateUserProfile')
                //             return indexNewProfile({ profileURL : response , sID : sID })
                            
                //         })
                //     })

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
                // })
                                
            })
        },

    

    
    mixins: [
        createPlaylistMixin
    ],

}