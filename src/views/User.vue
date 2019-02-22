<template>
    <div class="userWrapper">
        <div class="image">
        <div>
            <v-img :src=profileURL></v-img>
            
        </div>
        </div>
        <div class="mixes">
            <div>
                <Stream :pagePart="customerMixes"></Stream>
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

import createStreamMixin from '../mixins/createStreamMixin'
import { mapGetters } from 'vuex'
import Stream from '@/components/Stream.vue'

export default {

    components: {
        Stream,
    },

    computed: {
        ...mapGetters([
            'profileURL'
        ])
    },

    mixins: [
        createStreamMixin
    ],

    created: function () {

    // if (this.$store.getters.mixLoaded == false) {
      //retreive timeline, and save it in state
      console.log("loading mixes")
      this.pullID("mixes")
      //}else{
        console.log("already loaded")
      //}
      
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


