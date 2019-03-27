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
            clickedUser : 'clickedUser',
            customer: 'customer',
        }),
    
    },

    methods: {
        
        //Takes, playlist name, mID as input
        //Adds mix to playlist locally, and in DB

        addToPlaylist(mixData, mID, playlistNameArray){

            console.log(mixData)
            console.log(this.uID)
            console.log(playlistNameArray)

            var mixDataPass = {

                artworkURL : mixData.artworkURL,
                likeCount : mixData.likeCount,
                mID : mID,
                producer : mixData.producer,
                series : mixData.series,
                streamURL : mixData.streamURL,
                title : mixData.title,
                uID : mixData.uID,
                dateUploaded :  mixData.dateUploaded,
                dateAdded : new Date()

            }
            
            console.log(mixDataPass)

            // var playlistCreated = false

            // const playlistNames = this.customer.playlistNames
            var message = 'created playlist '+playlistNameArray+' and added mix'

            // playlistNames.forEach(name => {
            //     playlistNameArray.forEach(newName => {
            //         if(name === newName){
            //             playlistCreated = true
            //             message = 'added to playlist'
            //         }
            //     })
            // })

            // if(!playlistCreated){
            //     if(playlistNameArray !== 'ListenLater'){
            //         console.log('in name checker if')
            //         this.createPlaylist(playlistNameArray)
            //     }
            // }

            playlistNameArray.forEach(playlistName => {

                //playlistName = playlistName.split(' ').join('')

                database.collection('users').doc(this.uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                    console.log(message)
                    this.$store.commit('addToPlaylist' , {mix : mixDataPass , playlistName : playlistName})
                }).catch(error => {
                    console.log(error)
                })
               
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
                playlistNames: firebase.firestore.FieldValue.arrayUnion(playlistName)
            }).then(() => {
                this.$store.commit('createPlaylist', playlistName)
                return 'Playlist created, now add some mixes!'
            })

        },

        getPlaylists(){
            
            const playlistNames = this.customer.playlistNames
            
            for(var a in playlistNames){
                    var name = playlistNames[a]
                    database.collection('users').doc(this.uID).collection(name).get().then(response => {
                        var playlists = response.docs
                        for(var b in playlists){
                            var playlist = playlists[b]
                            console.log(playlist)
                        }
                    })
                    
                      
            }  
        },

        // getPlaylistData(playlistName){
            
            
            
        // }

    }


}
