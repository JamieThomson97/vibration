//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'


export default {

 

    methods: {

        fetchUserDetails(uID) {
            console.log('clickeduID')
            console.log(uID)
            this.$store.dispatch('getUserProfile', uID)   
            this.createClickedStream(uID)
            this.$store.dispatch('getUserFollowX', { id : uID , array : ['followers' , 'following']});
        }

    },

    
    mixins: [
        createPlaylistMixin
    ],

}