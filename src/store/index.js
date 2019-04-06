import Vue from 'vue';
import Vuex from 'vuex';

import selectedUser from './modules/selectedUser';
import selectedMix from './modules/selectedMix';
import player from './modules/player';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    
    player,
    selectedMix,
    selectedUser,
  },
});
