import * as firebase from 'firebase';

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
 // let db = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
 function storeHighScore(userId, score) {
    firebase.database().ref('users/' + userId).set({
      highscore: score
    });
  }
  
  
  