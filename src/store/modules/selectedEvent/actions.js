import * as firebase from "firebase";
const database = firebase.firestore();

export default {
  getEventDetails({ commit }, eventName) {
    var mixes = [];
    database
      .collection("events")
      .where("name", "==", eventName)
      .get()
      .then(response => {
        const eventData = response.docs[0].data();
        eventData["sID"] = response.docs[0].id;
        eventData["eID"] = response.docs[0].id;
        return eventData;
      })
      .then(response => {
        database
          .collection("events")
          .doc(response.eID)
          .collection("mixes")
          .get()
          .then(mixDocs => {
            mixDocs.forEach(mixDoc => {
              mixes.push(mixDoc.data());
            });
            response["mixes"] = mixes;
            console.log("response");
            console.log(response);
            return response;
          })
          .then(response => {
            commit("setEventData", response);
          });
      });
  },

  actionSetSelectedeID({ commit }, payload) {
    commit("setSelectedeID", payload);
  },

  getEventDetailsID({ commit }, eID) {
    //receives an eventID
    var mixes = [];
    //queries the 'events' collection with the eID
    database
      .collection("events")
      .doc(eID)
      .get()
      .then(response => {
        const eventData = response.data();
        eventData["eID"] = response.id;
        //returns the event data, I.E. passes it to the next then statement as the 'response'
        return eventData;
      })
      .then(eventData => {
        //the mixes subCollection of the event is queried
        database
          .collection("events")
          .doc(eID)
          .collection("mixes")
          .get()
          .then(mixDocs => {
            //each mix returned if iterated through
            mixDocs.forEach(mixDoc => {
              var mix = mixDoc.data();
              mix["mID"] = mixDoc.id;
              //and pushed to a mixes array
              mixes.push(mix);
            });
            //the mixes array is written to the eventData object as 'mixes'
            eventData["mixes"] = mixes;
            return eventData;
          })
          .then(response => {
            //the setEventData mutation is called to save the eventData to state
            commit("setEventData", response);
          });
      });
  }
};
