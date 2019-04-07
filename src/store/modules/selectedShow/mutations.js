import Vue from 'vue'

export default {

  


  setSelectedsID(state, payload) {
    Vue.set(state, 'sID' , payload)
  },

  setShowData(state, showData) {   
    Object.keys(showData).forEach(key => {
      
      Vue.set(state, key, showData[key] )
    })
    
  },
  setShowMixes(state, mixes){
    Vue.set(state, 'mixes', mixes )
  },
  setSuggestedShowMixes(state, mixes){
    
    Vue.set(state, 'suggestedMixes', mixes )
  },


  
};

