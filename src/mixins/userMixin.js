//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from '../mixins/createPlaylistMixin'
import {
    mapGetters
} from 'vuex'


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

        setClickeduID(uID) {
            
            this.$store.commit('setClickeduID', uID)
          },
    },

    

    
    mixins: [
        createPlaylistMixin
    ],

}