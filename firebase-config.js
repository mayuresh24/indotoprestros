import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6EOX2i_6vCqz-EwiopQyd0qwtsomOppw",
  authDomain: "sample-4d3c3.firebaseapp.com",
  projectId: "sample-4d3c3",
  storageBucket: "sample-4d3c3.firebasestorage.app",
  messagingSenderId: "1064954656144",
  appId: "1:1064954656144:web:34252bec01b29ae5aaaf15",
  measurementId: "G-ZBQ1PHV7BF"
};

// ✅ Initialize Firebase
export const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore
export const db = getFirestore(app);
