<template>

  <v-app>
    <div class="wrapper">
      <div class="box stream">
        <div>
          <Stream pagePart="timeline"/>
        </div>
      </div>
      <div class="box history">
        <Stream pagePart="history"/>
      </div>
      <div class="box recommended">
        <Stream pagePart="listenLater"/>
      </div>
      <div class="box right">Something on the Right (maybe list of playlists)</div>
      <div class="box player">Player</div>
    </div>
  </v-app>

</template>

<script>
import firebase from 'firebase'

import Stream from '@/components/Stream.vue'

export default {

  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem('vuex')) {
      console.log("doesnt exist")
      next('/about')
    } else {
      if ((JSON.parse(localStorage.getItem('vuex')).user) == null) {
        next('/about')
        console.log("property is NULL")
      } else {
        next()
      }
    }

  },

  components: {
    Stream

  },

  props: {
    pagePart: {
      type: String,
      required: false,
      default: "test"
    }
  },

  methods: {

    
    pullID(type) {
      const passon = type
      const ref = firebase.firestore().collection('users').doc(`${this.$store.getters.user.id}`).collection(type)
      ref.orderBy("dateRecorded", "asc").limit(12).get().then((snapshot) => {
        var mIDs = []
        const timeline = snapshot.docs
        for (var entry = 0; entry < timeline.length; entry++) {
          const item = timeline[entry].data().mID
          mIDs.push(item)
          
        }
        this.$store.dispatch("actionSetID", {
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
        console.log(mixIDs)
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
    }
  },

  data() {
    return {
      expand: false
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    },
  },

  created: function () {

    if (this.$store.getters.mixLoaded == false) {
      //retreive timeline, and save it in state
      console.log("loading mixes")
      this.pullID("timeline")
      this.pullID("listenLater")
      this.pullID("history")
      }else{
        console.log("already loaded")
      }
      
  }


}

</script>

<style>
    .wrapper{

      display:grid;
      grid-template-columns: 3fr 4fr 3fr;
      grid-template-rows: repeat(12, 1fr);
      grid-gap:1rem;
      
      min-height: 100%;
      max-height: 100%
    }

    .stream{
      /*align-self:start;*/
      
      grid-column:2/3;
      grid-row:2/5;
      border:1px solid #333;
      
    }

    .history{
      /*align-self:end;*/
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:3/4;
      border:1px solid #333;
    }

    .recommended{
      /*justify-self:end;*/
      margin-left: 1rem;
      grid-column:1/2;
      grid-row:4/5;
      border:1px solid #333;
    }

    .right{
      margin-left: 1rem;
      margin-right: 1rem;
      grid-column:3/4;
      grid-row:2/4;
      border:1px solid #333;
    }

    .player{
      margin  : 1rem;
      grid-column:1/-1;
      grid-row:6/7;
      border:1px solid #333;
    }
  </style>

