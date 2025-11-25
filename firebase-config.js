  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC6EOX2i_6vCqz-EwiopQyd0qwtsomOppw",
    authDomain: "sample-4d3c3.firebaseapp.com",
    projectId: "sample-4d3c3",
    storageBucket: "sample-4d3c3.firebasestorage.app",
    messagingSenderId: "1064954656144",
    appId: "1:1064954656144:web:34252bec01b29ae5aaaf15",
    measurementId: "G-ZBQ1PHV7BF"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
