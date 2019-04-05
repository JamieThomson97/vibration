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
            show : 'show',
        }),


    },

    methods: {

        removeFromPlaylist(mID , collection){
            console.log(collection)
            database.collection('users').doc(this.uID).collection(collection).doc(mID).delete().then(() => {
                this.$store.commit('deleteFromPlaylist' , {mID : mID , playlist : collection})
                this.$noty.success('Mix removed from : '+collection)
            })
        },

        addToPlaylist(mixData , playlists){
            console.log(mixData)
            console.log(playlists)
            if(playlists == null){
                this.$noty.warning('Please select atleast one playlist')
            }else{
                var mixDataPass = {

                    artworkURL : mixData.artworkURL,
                    likeCount : mixData.likeCount,
                    mID : mixData.mID,
                    artists : mixData.artists,
                    show : this.show.name,
                    audioURL : mixData.audioURL,
                    title : mixData.title,
                    // uID : mixData.uID,
                    dateUploaded :  mixData.dateUploaded,
                    dateAdded : new Date()
    
                }

                var playlistCreated = false
                playlists.forEach(playlistName => {
                    playlistCreated = false
                    this.customer.createdPlaylists.forEach(pName => {
                        if (pName == playlistName) {
                        playlistCreated = true
                    }
                })
    
                    database.collection('users').doc(this.uID).collection(playlistName).doc(mixDataPass.mID).set(mixDataPass).then(() => {
                        if (!playlistCreated) {
                            if(playlistName !== "Listen Later" | "Liked Mixes"){
                                
                                database.collection('users').doc(this.uID).update({
                                        createdPlaylists: firebase.firestore.FieldValue.arrayUnion(playlistName)
                                    }).then(() => {
                                        this.$store.dispatch('actionCreatePlaylist', playlistName).then(() => {
                                            this.$store.commit('addToPlaylist' , {mix : mixDataPass , playlistName : playlistName})
                                            this.$noty.success(playlistName+' created')
                                        })
                                    })
                            }
                        }else{
                            this.$store.commit('addToPlaylist' , {mix : mixDataPass , playlistName : playlistName})
                        }
                    
                        
                    }).catch(error => {
                        console.log(error)
                    })
                   
                })
            }
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

        addToHistory(trackData) {
            trackData['dateAdded'] = new Date()
            database.collection('users').doc(this.uID).collection('History').doc(trackData.mID).set(trackData).then(() => {
                this.$store.commit('addToHistory', trackData)
            })
        },

        setClickedmID(mID, title ){
            this.$store.dispatch('actionSetClickedmID', mID).then(() => {
                this.$router.push(`/mixes/${(title).split(' ').join('_')}`)
            })
            
        },

        setClickeduID(uID , user) {
            this.$store.dispatch('actionSetClickeduID', uID).then(() => {
                this.$router.push(`/users/${(user).split(' ').join('_')}`)
            })
        },

          setClickedeID(eID, eventName){
            this.$store.dispatch('actionSetClickedeID', eID).then(() => {
                this.$router.push(`/events/${(eventName).split(' ').join('_')}`)
            })
        },

        setClickedsID(sID , showName) {
            this.$store.dispatch('actionSetClickedsID', sID).then(() => {
                this.$router.push(`/shows/${(showName).split(' ').join('_')}`)
            })
          },
        
        handleClickTrack(trackData, reference) {
            console.log('trackData')
            console.log(trackData)            
            if (this.playerCurrentTrack && this.playerCurrentTrack.title === trackData.title) {
                this.$store.dispatch('setPlayerCurrentTrack', null);
            } else {
                
                this.$store.dispatch('setPlayerCurrentTrack', trackData);
                if(reference == 'show.mixes'){
                    this.$store.dispatch('setPlayerTracks', this.show.mixes)
                }
                if(reference == 'show.suggestedMixes'){
                    this.$store.dispatch('setPlayerTracks', this.show.suggestedMixes)
                }
                this.addToHistory(trackData)
            }
        },
      
    },

    

    
    mixins: [
        createPlaylistMixin
    ],

}