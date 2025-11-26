// ✅ Import ONLY db from firebase-config.js
import { db } from "./firebase-config.js";

// ✅ Firestore helpers
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ⭐ Reverse Geocode using OpenStreetMap + CORS Proxy
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    // CORS bypass proxy
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const res = await fetch(proxy);
    const data = await res.json();
    return data;

  } catch (err) {
    console.error("❌ Reverse geocode failed:", err);
    return {};
  }
}


// ⭐ Save full location to Firestore
async function saveLocation(fullData) {
  try {
    await addDoc(collection(db, "locations"), fullData);
    console.log("✅ Saved full location:", fullData);
  } catch (err) {
    console.error("❌ Error saving to Firestore:", err);
  }
}


// ⭐ Main function triggered by ENTER button
export function requestLocation() {
  navigator.geolocation.getCurrentPosition(
    async pos => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const acc = pos.coords.accuracy;

      console.log("📍 Raw Location:", lat, lon, "Acc:", acc);

      // Reverse Geocode
      const geo = await reverseGeocode(lat, lon);

      const fullData = {
        lat,
        lon,
        accuracy: acc,
        timestamp: new Date().toISOString(),

        // Address fields
        address: geo.display_name || "",
        road: geo.address?.road || "",
        area: geo.address?.suburb || "",
        city: geo.address?.city || geo.address?.town || geo.address?.village || "",
        state: geo.address?.state || "",
        country: geo.address?.country || "",
        postal_code: geo.address?.postcode || ""
      };

      await saveLocation(fullData);

      // Redirect to homepage AFTER saving
      window.location.href = "index.html";
    },

    err => {
      console.warn("❌ Permission denied:", err);
      alert("Please allow location and tap ENTER again.");
    },

    { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
  );
}
