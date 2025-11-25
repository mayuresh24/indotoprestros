import { db, collection, addDoc } from "./firebase-config.js";

// ✅ Save to Firestore
async function saveLocation(lat, lon, acc) {
  try {
    await addDoc(collection(db, "locations"), {
      lat,
      lon,
      accuracy: acc,
      timestamp: new Date().toISOString()
    });
    console.log("✅ Location saved!");
  } catch (err) {
    console.error("❌ Error saving:", err);
  }
}

// ✅ Ask for location AFTER first tap
function requestLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    saveLocation(
      pos.coords.latitude,
      pos.coords.longitude,
      pos.coords.accuracy
    );
  }, err => {
    console.warn("User denied or blocked:", err);
  });
}

// ✅ Browser rule: user must interact once
window.addEventListener("click", requestLocation, { once: true });
