<template>
    <div class="userWrapper">
        <div class="image">
            <div>
                <!-- <v-img :src=profileURL></v-img> -->
                
            </div>
        </div>
        <div class="mixes">
            <div>
                <Stream pagePart="mixes"></Stream>
            </div>
        </div>
        <div class="currentInfo">
            <div>Information</div>
        </div>
        <div class="follow">Follow/Unfollow btn + no. of followers etc...</div>
        <div class="userPlayer">User Player</div>
    </div>
        
   
</template>

<script>

    import createPlaylistMixin from '../mixins/createPlaylistMixin'
    import {
        mapGetters
    } from 'vuex'
    import Stream from '@/components/Stream.vue'

    export default {

        components: {
            Stream,
        },
        
        data() {
            return {
               streamComponents: ['mixes']
            }
        },

        computed: {
            ...mapGetters([
                'profileURL'
            ]),

            // stream(){
            //     return this.pullID("mixes")
            // }

        },

        mixins: [
            createPlaylistMixin
        ],

        

        created: function () {
      
      let that = this

      async function create() {

        var mixIDs = []
        var objects = []
        for(let comp in that.streamComponents){
            if(!that.$store.getters.playlist(that.streamComponents[comp])){
                objects[comp] = {}
                console.log(comp)
                mixIDs[comp] = await that.pullID(that.streamComponents[comp])
                if(mixIDs[comp].length > 0){
                    console.log("in if")
                    var stream = await that.pullMixes(mixIDs[comp])
                    objects[comp].mIDS =  mixIDs[comp]
                    objects[comp].stream =  stream
                    objects[comp].name =  that.streamComponents[comp]
                    console.log(that.streamComponents[comp])
                    console.log(objects[comp])
                    await that.$store.commit("setPlaylist", {object: objects[comp]})
                }else{
                    console.log("No mixes found")
                }
          }
        }
      }

      create()
      
      
  },

    }
</script>

<style>

    .userWrapper{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4,1fr);
        grid-gap: 1em;
        height: 100%
    }

    .image{
        border: solid 1px;
        grid-column: 1/2;
        grid-row: 1/4
    }

    .mixes{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 1/2;
    }

    .follow{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 2/3;
    }

    .currentInfo{
        border: solid 1px;
        grid-column: 2/5;
        grid-row: 3/4;
    }

    .userPlayer{
        border: solid 1px;
        grid-row: 4/5;
        grid-column: 1/-1;        
    }

</style>


