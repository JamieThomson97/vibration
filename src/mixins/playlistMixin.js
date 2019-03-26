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

        addToPlaylist(mixData, playlistName){

            // var mixDataPass = {
            //     artworkURL : "http://i64.tinypic.com/rr7ds7.jpg",// mixData.artworkURL
            //     likeCount : 0, // mixData.likeCount
            //     mID : "OVuQ9zDhn12fn8aV8Ods" , //mixData.mID
            //     producer : 'NewUser', //mixData.producer
            //     series : 'a brand new series', //mixData.series
            //     streamURL : "https://firebasestorage.googleapis.com/v0/b/vibration-401b4.appspot.com/o/mixes%2FOVuQ9zDhn12fn8aV8Ods.mp3?alt=media&token=a01bddaf-7236-4ae8-b15f-71e0f84b5b48", //mixData.streamURL
            //     title : 'New User Mix', //mixData.title
            //     uID : "zONR3mCAA8R2sBXTv58GhjrqQOQ2" //mixData.uID
            // }

            console.log(mixData)
            console.log(this.uID)
            console.log(playlistName)

            var mixDataPass = {
                artworkURL : mixData.artworkURL,
                likeCount : mixData.likeCount,
                mID : mixData.mID,
                producer : mixData.producer,
                series : mixData.series,
                streamURL : mixData.streamURL,
                title : mixData.title,
                uID : mixData.uID,
            }
            
            console.log(mixDataPass)

            var playlistCreated = false

            const playlistNames = this.customer.playlistNames
            var message = 'created playlist '+playlistName+' and added mix'

            for(var a in playlistNames){
                    var name = playlistNames[a]
                    if(name === playlistName){
                        playlistCreated = true
                        message = 'added to playlist'
                    }  
            }

            if(!playlistCreated){
                if(playlistName !== 'ListenLater'){
                    console.log('in name checker if')
                    this.createPlaylist(playlistName)
                }
            }

            database.collection('users').doc(this.uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                console.log(message)
            }).catch(error => {
                console.log(error)
            })
        },


        removeFromPlaylist(mID, playlistName){

            
            playlistName = 'FIFA Songs'

            database.collection('users').doc(this.uID).collection(playlistName).doc(mID).delete().then(() => {
                return 'mix delete from '+playlistName
            }).catch(error => {
                return error
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
                return 'Playlist created, now add some mixes!'
            })

        },

        getPlaylists(uID){

            uID = "zONR3mCAA8R2sBXTv58GhjrqQOQ2" //mixData.uID
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
