//import firebase from 'firebase'
//const database = firebase.firestore()
import createPlaylistMixin from "../mixins/createPlaylistMixin";
import { mapGetters } from "vuex";
import * as firebase from "firebase";
const database = firebase.firestore();
const storage = firebase.storage();

export default {
  computed: {
    ...mapGetters({
      profileURL: "profileURL",
      uID: "uID",
      name: "name",
      clickeduID: "clickeduID",
      selectedUser: "selectedUser"
    })
  },

  methods: {
    getShowPageData(sID) {
      //takes the showID of the selectedShow

      //several variables are predefined for later
      var showDataProducers = null;
      var showName = null;
      var suggestedMixesObj = [];
      var mixCount = null;

      //queries the 'shows' collecton for the show
      database
        .collection("shows")
        .doc(sID)
        .get()
        .then(response => {
          const showData = response.data();
          //sets the values of the predefined variables
          showDataProducers = showData.producers;
          showName = showData.name;
          mixCount = showData.mixCount;

          //set basic show info to state
          this.$store.commit("setShowData", showData);
        })
        .then(() => {
          //get suggested mixes from producers of the show
          //loop through the producers variable and use each producer's userID to query their 'mixes' subCollection
          showDataProducers.forEach(artist => {
            var uID = artist.uID;
            database
              .collection("users")
              .doc(uID)
              .collection("mixes")
              .limit(mixCount + 12)
              .get()
              .then(response => {
                var suggestedMixes = response.docs;

                //iterate through each mix in the response
                suggestedMixes.forEach(mix => {
                  var mixData = mix.data();
                  mixData["mID"] = mix.id;
                  //check to see if the mix is part of the selectedShow, if so,
                  //it should not be added to this collection, as it needs to appear in another part of page
                  //and there is no reason to show the same mix on the page twice
                  if (mixData.show) {
                    if (mixData.show !== showName) {
                      suggestedMixesObj.push(mixData);
                    }
                  } else {
                    //if the mix is not part of the selectedShow, add it to the suggestedMixesObj array
                    suggestedMixesObj.push(mixData);
                  }
                });

                //set suggested mixes from producers to state
                this.$store.commit("setSuggestedShowMixes", suggestedMixesObj);
              });
          });
        });

      
    var mixesObj = [];
    //queries the selectedShow's 'mixes' subCollection to gather the shows mixes
      database
        .collection("shows")
        .doc(sID)
        .collection("mixes")
        .get()
        .then(response => {
          const mixes = response.docs;
          mixes.forEach(mix => {
            //the mixes in the response are iterated through
            var mixData = mix.data();
            mixData["mID"] = mix.id;
            //and added to the mixesObj
            mixesObj.push(mixData);
          });
          //the set of mixes is saved to state
          this.$store.commit("setShowMixes", mixesObj);
        });
    },

    newupdateShowImage(show, image) {
      //Will receive an image file
      //and the sID of the user
      const sID = show.sID;
      console.log(show);
      const producers = show.producers;

      var imageStorageRef = storage.ref("showImage/" + sID + ".jpeg");

      return imageStorageRef
        .put(image)
        .then(() => {
          return imageStorageRef.getDownloadURL().then(function(URL) {
            return URL;
          });
        })
        .then(response => {
          const showPromise = database
            .collection("shows")
            .doc(sID)
            .update({
              imageURL: response
            });

          var producersPromises = [showPromise];

          producers.forEach(producer => {
            var uID = producer.uID;
            producersPromises.push(
              database
                .collection("users")
                .doc(uID)
                .collection("shows")
                .doc(sID)
                .update({
                  imageURL: response
                })
            );
          });
          const updateShowIndex = firebase
            .functions()
            .httpsCallable("updateShowIndex");
          const callFunction = updateShowIndex({
            imageURL: response,
            objectID: sID
          });
          producersPromises.push(callFunction);
          return producersPromises;
        })
        .then(producersPromises => {
          return Promise.all(producersPromises).then(response => {
            console.log(response);
          });
        });
    },

    updateEventImage(event, image) {
      //Will receive an image file
      //and the sID of the user
      const eID = event.eID;
      console.log(event);
      const producers = event.producers;

      var imageStorageRef = storage.ref("eventImage/" + eID + ".jpeg");

      return imageStorageRef
        .put(image)
        .then(() => {
          return imageStorageRef.getDownloadURL().then(function(URL) {
            return URL;
          });
        })
        .then(response => {
          const eventPromise = database
            .collection("events")
            .doc(eID)
            .update({
              imageURL: response
            });

          var producersPromises = [eventPromise];

          producers.forEach(producer => {
            var uID = producer.uID;
            producersPromises.push(
              database
                .collection("users")
                .doc(uID)
                .collection("events")
                .doc(eID)
                .update({
                  imageURL: response
                })
            );
          });
          const updateEventIndex = firebase
            .functions()
            .httpsCallable("updateEventIndex");
          const callFunction = updateEventIndex({
            imageURL: response,
            objectID: eID
          });
          producersPromises.push(callFunction);
          return producersPromises;
        })
        .then(producersPromises => {
          return Promise.all(producersPromises).then(response => {
            console.log(response);
          });
        });
    },

    updateShowImage(sID, image) {
      //Will receive an image file
      //and the uID of the user

      var imageStorageRef = storage.ref("userShowImage/" + sID + ".jpeg");

      return imageStorageRef
        .put(image)
        .then(() => {
          return imageStorageRef.getDownloadURL().then(function(URL) {
            return URL;
          });
        })
        .then(response => {
          //Update the profile URL field for the user, in every location they appear, and call a function to change the profile URL in algolia

          var updatePromises = [];

          //Get every location a user is in
          //users collection

          const userPromise = database
            .collection("shows")
            .doc(sID)
            .update({
              imageURL: response
            });

          //in the following subcollection

          database
            .collection("shows")
            .doc(sID)
            .get()
            .then(response => {
              const producers = response.data().producers;
              updatePromises.push(userPromise);
              producers.forEach(producer => {
                updatePromises.push(
                  database
                    .collection("users")
                    .doc(producer.uID)
                    .collection("shows")
                    .doc(sID)
                    .update({
                      imageURL: response
                    })
                );
              });
            })
            .then(() => {
              return Promise.all(updatePromises);
            });
        });
    }
  },

  mixins: [createPlaylistMixin]
};
