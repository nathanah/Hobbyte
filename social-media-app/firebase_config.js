// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");


//<!-- The core Firebase JS SDK is always required and must be listed first -->
src="https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js";

//<!-- TODO: Add SDKs for Firebase products that you want to use
//     https://firebase.google.com/docs/web/setup#available-libraries -->
// Your web app's Firebase configuration

var firebaseConfig = {
    apiKey: "AIzaSyDbor4DxPmmOfsBNvd1CoRLUXgCiLaUk_8",
    authDomain: "hobyte-4e08c.firebaseapp.com",
    databaseURL: "https://hobyte-4e08c.firebaseio.com",
    projectId: "hobyte-4e08c",
    storageBucket: "hobyte-4e08c.appspot.com",
    messagingSenderId: "361566556420",
    appId: "1:361566556420:web:cdeedf44697ec542ac0051"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.database();

 // let db = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
  export function writeUserData(userId, name, email) {
    firebase.firebase().ref('users/' + userId).set({
      username: name,
      email: email
    });
  }
  
  