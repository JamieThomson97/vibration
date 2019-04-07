import * as firebase from 'firebase'
import { mapGetters } from 'vuex'
import createPlaylistMixin from './createPlaylistMixin';
const database = firebase.firestore()

export default {

    mixins : [
        createPlaylistMixin,
    ],

    computed: {
        ...mapGetters({
            profileURL : 'profileURL',
            uID : 'uID',
            name : 'name',
            clickeduID : 'clickeduID',
            selectedUser : 'selectedUser',
            customer: 'customer',
        }),
    
    },

    methods: {
        
        //Takes, playlist name, mID as input
        //Adds mix to playlist locally, and in DB

        newPlaylist(playlistName) {
            database.collection('users').doc(this.uID).update({
                createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
            }).then(() => {
                this.$store.commit('createPlaylist', playlistName)
                return 'Playlist created, now add some mixes!'
            })
        },

        // addToPlaylist(mixData, mID, playlistNameArray){
            
        //     var mixDataPass = {

        //         artworkURL : mixData.artworkURL,
        //         likeCount : mixData.likeCount,
        //         mID : mID,
        //         producer : mixData.producer,
        //         series : mixData.series,
        //         audioURL : mixData.audioURL,
        //         title : mixData.title,
        //         uID : mixData.uID,
        //         dateUploaded :  mixData.dateUploaded,
        //         dateAdded : new Date()

        //     }
        //         var playlistCreated = false
        //         playlistNameArray.forEach(playlistName => {
        //             playlistCreated = false
        //             this.customer.createdPlaylists.forEach(pName => {
        //                 if (pName === playlistName) {
        //                 playlistCreated = true
        //             }
        //         })

        //         database.collection('users').doc(this.uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                    
        //             this.$store.commit('addToPlaylist' , {mix : mixDataPass , playlistName : playlistName})
        //         }).catch(error => {
        //             this.$noty.warning(error)
        //         }).then(() => {
        //             if (!playlistCreated) {
        //                 if(playlistName !== "Listen Later" | "Liked Mixes")
        //                     this.createPlaylist(playlistName)
        //                     this.$noty.success('Successfully added to Playlist : '+playlistName)
        //             }
        //         } )
               
        //     })

            
        // },

        deletePlaylist(playlistName) {
            
            var promises = []
            database.collection('users').doc(this.uID).collection(playlistName).get().then(response => {
                
                response.forEach(mix => {
                    
                    var promise = database.collection('users').doc(this.uID).collection(playlistName).doc(mix.data().mID).delete()
                    promises.push(promise)
                })
            })

            const arrayEntry = database.collection('users').doc(this.uID).update({
                createdPlaylists: firebase.firestore.FieldValue.arrayRemove(playlistName)
            })
            promises.push(arrayEntry)

            Promise.all(promises).then(() => {
                this.$store.commit('deletePlaylist', playlistName)
                this.$noty.success(playlistName+' deleted')
            })
        },

        addToHistory(trackData) {
            trackData['dateAdded'] = new Date()
            database.collection('users').doc(this.uID).collection('history').doc(trackData.mID).set(trackData).then(() => {
                this.$store.commit('addToHistory', trackData)
            })
        },


        createPlaylist(playlistName){

            const playlistNames = this.customer.playlistNames
            
            for(var a in playlistNames){
                    var name = playlistNames[a]
                    if(name === playlistName){
                        return 'Playlist aready created'
                    }  
            }

            database.collection('users').doc(this.uID).update({
                createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
            }).then(() => {
                this.$store.commit('createPlaylist', playlistName)
                this.$noty.success(playlistName+' created')
            })

        },

        // getPlaylists(){
            
        //     const playlistNames = this.customer.playlistNames
            
        //     for(var a in playlistNames){
        //             var name = playlistNames[a]
        //             database.collection('users').doc(this.uID).collection(name).get().then(response => {
        //                 var playlists = response.docs
        //                 for(var b in playlists){
        //                     var playlist = playlists[b]
                            
        //                 }
        //             })
                    
                      
        //     }  
        // },

    }


}
