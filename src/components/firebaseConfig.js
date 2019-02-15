import firebase from 'firebase';

const config = ({
    apiKey: "AIzaSyDTiV27Aa2PUk-Eg5wasWAFvnN57gZZuvU",
    authDomain: "vibration-401b4.firebaseapp.com",
    databaseURL: "https://vibration-401b4.firebaseio.com",
    projectId: "vibration-401b4",
    storageBucket: "vibration-401b4.appspot.com",
    messagingSenderId: "297955505398"
});


export const firebaseConfig =  firebase.initializeApp(config);
