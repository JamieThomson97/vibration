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
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser : 'selectedUser',
        }),


    },

    methods: {

        fetchUserDetails(uID) {
            
            console.log('in fetch user details')
            console.log(uID)
            this.$store.dispatch('getUserProfile', uID)   
            this.createClickedStream(uID)
            this.$store.dispatch('getUserFollowX', { id : uID , array : ['followers' , 'following'], customeruID : this.uID});
        },

          getUserShowsorEvents(uID, type){
            console.log()
            var entries = []

            database.collection('users').doc(uID).collection(type).get().then(response => {
                var docs = response.docs
                docs.forEach(doc => {
                    var info = doc.data()
                    info['eID'] = doc.id 
                    entries.push(info)
                    
                })
                this.$store.commit(`set${type}` , entries)
            })

          },

          updateUserImage(uID, image){
            //Will receive an image file
            //and the uID of the user
    
            var imageStorageRef = storage.ref('userProfileImage/'+uID+'.jpeg')
    
            return imageStorageRef.put(image).then(() => {
                
                return imageStorageRef.getDownloadURL().then(function(URL) {
                    
                    return URL
                })
            }).then(response => {
    
                //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia
    
                var updatePromises = []
    
                //Get every location a user is in 
                    //users collection
    
                    const userPromise = database.collection('users').doc(uID).update({
                        profileURL : response
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
                                profileURL : response
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
                                    profileURL : response
                                }))
                            })
                        }).then(() => {
                            return Promise.all(updatePromises).then(()=>{
                                const indexNewProfile = firebase.functions().httpsCallable('updateUserProfile')
                                return indexNewProfile({ profileURL : response , uID : uID })
                                
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