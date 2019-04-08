import Vue from 'vue'

export default {

  

  setEventData(state, eventData) {      

    console.log('set event data')
    console.log(eventData)
    Object.keys(eventData).forEach(key => {
      Vue.set(state, key, eventData[key])
    })
    console.log('set eventdata')
    
  },
  setEventMixes(state, mixes){
    console.log('set event mixes')
    console.log(mixes)
    Vue.set(state , 'mixes', mixes )
  },

      
  setSelectedeID(state, payload) {
    Vue.set(state, 'eID' , payload)
  },
  
};

