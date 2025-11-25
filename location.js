// ✅ Import ONLY db from firebase-config.js
import { db } from "./firebase-config.js";

// ✅ Import Firestore helpers DIRECTLY from CDN
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ✅ Save location to Firestore
async function saveLocation(lat, lon, acc) {
  try {
    await addDoc(collection(db, "locations"), {
      lat,
      lon,
      accuracy: acc,
      timestamp: new Date().toISOString()
    });
    console.log("✅ Location saved to Firestore!");
  } catch (err) {
    console.error("❌ Error saving location:", err);
  }
}

// ✅ Runs ONLY after first tap
function requestLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      saveLocation(
        pos.coords.latitude,
        pos.coords.longitude,
        pos.coords.accuracy
      );
    },
    err => {
      console.warn("❌ Permission denied or blocked:", err);
    }
  );
}

// ✅ Browser requirement: user interaction
window.addEventListener("click", requestLocation, { once: true });
