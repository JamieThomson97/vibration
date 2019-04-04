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

        getShowPageData(sID){

            //Get basic show info
            var showDataArtists = null
            var showName  = null
            var suggestedMixesObj = []
            var episodeCount = null
            database.collection('shows').doc(sID).get().then(response  => {
                const showData = response.data()
                showDataArtists = showData.artists
                showName = showData.name
                episodeCount = showData.episodeCount
                
                //Set basic show info to state
                this.$store.commit('setShowData' , showData)
            }).then(() => {
                //Get suggested mixes from artists
                showDataArtists.forEach(artist => {
                    var uID = artist.uID
                    database.collection('users').doc(uID).collection('mixes').limit(episodeCount+12).get().then(response =>{
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

    

    
    mixins: [
        createPlaylistMixin
    ],

}