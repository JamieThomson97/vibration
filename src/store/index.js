import Vue from 'vue';
import Vuex from 'vuex';

import selectedMix from './modules/selectedMix';
import selectedUser from './modules/selectedUser';
import selectedEvent from './modules/selectedEvent';
import selectedShow from './modules/selectedShow';
import player from './modules/player';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    
    player,
    selectedShow,
    selectedMix,
    selectedUser,
    selectedEvent
  },
});
