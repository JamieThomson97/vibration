//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import {
    mapGetters
} from 'vuex'
import * as firebase from 'firebase'
const database = firebase.firestore()


export default {



    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            clickedUser : 'clickedUser',
        }),


    },

    methods: {

        fetchUserDetails(uID) {
            
            
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
    },

    

    
    mixins: [
        createPlaylistMixin
    ],

}