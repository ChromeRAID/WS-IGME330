/* #2 - The rest of the Firebase setup code goes here */
// Your web app's Firebase configuration
  // Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAajUn4yXP77CnJZFKQckx9O1NqLr0ynAo",
    authDomain: "fir-exer-f2cb4.firebaseapp.com",
    databaseURL: "https://fir-exer-f2cb4.firebaseio.com",
    projectId: "fir-exer-f2cb4",
    storageBucket: "fir-exer-f2cb4.appspot.com",
    messagingSenderId: "1084930185158",
    appId: "1:1084930185158:web:49c19f1f8e992b8bc444c7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//initializes the firebase database used for all firebase interactions
let database = firebase.database();
