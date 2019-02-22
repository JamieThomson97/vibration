import firebase from 'firebase'

export default {


    methods: {
        pullID(type) {
            const passon = type
            const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.uID}`).collection(type)
            ref.orderBy("dateRecorded", "asc").limit(12).get().then((snapshot) => {
              var mIDs = []
              const timeline = snapshot.docs
              for (var entry = 0; entry < timeline.length; entry++) {
                const item = timeline[entry].data().mID
                mIDs.push(item)
                
              }
              this.$store.dispatch("actionSetmID", {
                array: mIDs,
                type: passon
              }).then(() => {
                this.pullMixes(type)
              })
            }).catch((error) => {
              
              console.log(error)
            })
          },

          pullMixes(type) {
            const results = []
            const promises = []
            var mixIDs = []
            
            if(type=="timeline"){        
              mixIDs = this.$store.getters.ID_Timeline
            }else if(type=="listenLater"){
              mixIDs = this.$store.getters.ID_ListenLater
            }else if(type=="history"){
              mixIDs = this.$store.getters.ID_History
              //console.log(mixIDs)
            }else if(type=="mixes"){
                mixIDs = this.$store.getters.ID_CustomerMixes
            }
            
            for (const mID in mixIDs) {
              const currentMix = mixIDs[mID]
              
              const promise = firebase.firestore().doc(`mixes/${currentMix}`).get()
              promises.push(promise)
            }
            return Promise.all(promises).then((mixes) => {
      
                mixes.forEach(mix => {
                  const data = mix.data()
                  results.push(data)
                })
                
      
                this.$store.dispatch("actionSetStream", {
                  stream: results,
                  type: type
                })
                if(type=="history"){
                  this.$store.dispatch("setActionMixLoaded")
                }  
      
              })
          },
    }
}