import firebase from "firebase/app";
import 'firebase/firestore'

let firebaseConfig = {
    apiKey: "AIzaSyAQ7fL8-Z4Mo9MRHuQ2X9xHGtO8bvlWpug",
    authDomain: "nutrition-care-1.firebaseapp.com",
    databaseURL: "https://nutrition-care-1.firebaseio.com",
    projectId: "nutrition-care-1",
    storageBucket: "nutrition-care-1.appspot.com",
    messagingSenderId: "913874288573",
    appId: "1:913874288573:web:98f78554bd3eb9e6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
export default db;