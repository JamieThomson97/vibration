//Areas that need populating -- Must be subcollections eg not likeCount, but likers list
//Mixes excempt 

// View : Mix

    // Likers // Comments // Commenters

// View : User

    // Followers // Following // 

//Home

    // User 

//About ??

import * as firebase from 'firebase'
// import { mapGetters } from 'vuex'
const database = firebase.firestore()

export default {

    methods: {
        returnIDs(uIDs, subCollection, orderBy){
            
            //Create query based on uID and subCollection given
            var results = []
            uIDs.forEach(user => {
                
                var uID = user.uID
            
                //if statement for if ordered or not
                if (!orderBy) {
                var query = database.collection('users').doc(uID).collection(subCollection)
                }
                else {
                query = database.collection('users').doc(uID).collection(subCollection).orderBy(orderBy, "DESC").limit(12)
                }
                
                return query.get().then((snapshot) => {
                const documents = snapshot.docs
                for (var entry = 0; entry < documents.length; entry++){
                    
                    // Adds the document to an array, that will be passed into the next function --- *** currently working on, is not yet designed correctly, may cause errors ***
                    // Must ensure that when new mix is added, the cloud function creates the entries elsewhere using the SAME DOCUMENT ID, otherwise this will fail
                    const item = documents[entry].id
                    
                    if(results.indexOf(item) < 0){
                        results.push(item)
                    }                    
                }
                }).catch((error) => {
                    return error
                })
            })
            return (results)
            
            //populate array with mIDs
        
            //Return --- may need to be a promise
        }
    }
}

