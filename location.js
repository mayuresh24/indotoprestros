// Import DB from Firebase config
import { db } from "./firebase-config.js";

// Firestore helpers
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ⭐ Your PositionStack API key
const API_KEY = "91b2902728711cc8e6eb06f6f573182a";   // <-- put your key here

// Reverse geocode using PositionStack
async function getAddress(lat, lon) {
  try {
    const url = `http://api.positionstack.com/v1/reverse?access_key=${API_KEY}&query=${lat},${lon}&limit=1`;

    const res = await fetch(url);
    const json = await res.json();

    if (!json.data || !json.data.length) return {};

    const d = json.data[0];

    return {
      street: d.street || "",
      area: d.neighbourhood || "",
      city: d.locality || "",
      state: d.region || "",
      country: d.country || "",
      postal_code: d.postal_code || "",
      formatted: d.label || ""
    };

  } catch (err) {
    console.error("Reverse geocode failed:", err);
    return {};
  }
}

// Save record into Firebase
async function saveLocationToDB(lat, lon, acc, address) {
  try {
    await addDoc(collection(db, "locations"), {
      lat,
      lon,
      accuracy: acc,
      timestamp: new Date().toISOString(),
      ...address
    });
    console.log("✅ Location + address saved!");
  } catch (err) {
    console.error("Error saving:", err);
  }
}

// Ask for location
function requestLocation() {
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const acc = pos.coords.accuracy;

      console.log("📍 Lat/Lon:", lat, lon);

      // Get full address
      const address = await getAddress(lat, lon);

      // Save
      await saveLocationToDB(lat, lon, acc, address);
    },
    err => {
      console.warn("User blocked:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    }
  );
}

// Browser rule: run after user tap
window.addEventListener("click", requestLocation, { once: true });
