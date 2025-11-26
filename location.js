// location.js — improved GPS sampling + BigDataCloud reverse geocode + Firestore save

// Import Firestore DB export from your firebase-config.js
import { db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/**
 * Try to get the best GPS fix by watching position for a short time,
 * collecting samples and returning the sample with the smallest accuracy.
 *
 * Returns a GeolocationPosition object (same shape as getCurrentPosition/watchPosition).
 */
function getBestPosition(options = {}) {
  const {
    maxWait = 20000,        // total max time waiting (ms)
    minAcceptableAccuracy = 50, // accept when accuracy <= this (meters)
    maxSamples = 6
  } = options;

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));

    let best = null;
    let samples = 0;
    let done = false;

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        samples++;
        // console.log('sample', samples, pos.coords.accuracy);
        if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;

        // If we hit good accuracy early, resolve immediately
        if (pos.coords.accuracy <= minAcceptableAccuracy) {
          done = true;
          navigator.geolocation.clearWatch(watchId);
          return resolve(best);
        }

        // If we've sampled enough, resolve with best so far
        if (samples >= maxSamples && !done) {
          done = true;
          navigator.geolocation.clearWatch(watchId);
          return resolve(best);
        }
      },
      err => {
        if (!done) {
          done = true;
          navigator.geolocation.clearWatch(watchId);
          reject(err);
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 }
    );

    // Global timeout fallback
    setTimeout(() => {
      if (!done) {
        done = true;
        navigator.geolocation.clearWatch(watchId);
        if (best) return resolve(best);
        return reject(new Error("Timed out obtaining position"));
      }
    }, maxWait);
  });
}

/**
 * Reverse geocode using BigDataCloud (CORS-friendly).
 * Returns the parsed JSON or an empty object on failure.
 */
async function reverseGeocodeBigData(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Reverse geocode failed: " + resp.status);
    const j = await resp.json();
    return j;
  } catch (err) {
    console.warn("Reverse geocode error:", err);
    return {};
  }
}

/**
 * Save structured location to Firestore
 */
async function saveLocationToFirestore(obj) {
  try {
    const docRef = await addDoc(collection(db, "locations"), obj);
    console.log("✅ Saved to Firestore:", docRef.id, obj);
    return docRef.id;
  } catch (err) {
    console.error("❌ Error saving to Firestore:", err);
    throw err;
  }
}

/**
 * Public handler to call when user taps ENTER (or any user gesture).
 * This will:
 *  - get best position (several samples),
 *  - if accuracy is too bad, retry or show message,
 *  - reverse geocode via BigDataCloud,
 *  - save everything to Firestore,
 *  - return the Firestore doc id (promise).
 */
export async function requestLocation(options = {}) {
  const {
    maxWait = 25000,               // how long to wait for better fixes
    minAcceptableAccuracy = 50,     // meters, what we consider "good"
    maxSamples = 6                  // how many samples to collect
  } = options;

  if (!navigator.geolocation) {
    alert("Geolocation not supported by this device/browser.");
    throw new Error("Geolocation not supported");
  }

  try {
    // 1) Try to get best position using watchPosition
    const pos = await getBestPosition({
      maxWait,
      minAcceptableAccuracy,
      maxSamples
    });

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    console.log("📍 Best sample:", { lat, lon, accuracy });

    // If accuracy is extremely large (e.g. > 5000m), warn user and allow retry
    if (accuracy > 5000) {
      const retry = confirm(
        "Location accuracy is very poor (" + Math.round(accuracy) + " m). " +
        "Try again outdoors or enable precise location? Choose OK to retry."
      );
      if (retry) {
        // try once more with slightly longer wait
        return requestLocation({ maxWait: maxWait + 15000, minAcceptableAccuracy, maxSamples: maxSamples + 4 });
      } else {
        // still save the poor position but flag it
        console.warn("Saving poor accuracy position as user chose not to retry.");
      }
    }

    // 2) Reverse geocode (BigDataCloud)
    const geo = await reverseGeocodeBigData(lat, lon);

    // 3) Build object to save
    const record = {
      lat,
      lon,
      accuracy,
      timestamp: new Date().toISOString(),

      // BigDataCloud fields (may be empty if API didn't return them)
      locality: geo.locality || "",
      city: geo.city || geo.locality || "",
      principalSubdivision: geo.principalSubdivision || geo.principalSubdivision || "",
      state: geo.principalSubdivision || geo.principalSubdivision || "",
      countryName: geo.countryName || "",
      postcode: geo.postcode || "",
      formatted: buildFormatted(geo),
      rawGeo: geo // keep full response for debugging
    };

    // 4) Save
    await saveLocationToFirestore(record);

    return record;

  } catch (err) {
    console.error("requestLocation failed:", err);
    alert("Could not get location: " + (err.message || err));
    throw err;
  }
}

/**
 * Helper to make a readable formatted address from BigDataCloud response
 */
function buildFormatted(geo) {
  if (!geo) return "";
  const parts = [];
  if (geo.locality) parts.push(geo.locality);
  if (geo.city && geo.city !== geo.locality) parts.push(geo.city);
  if (geo.principalSubdivision) parts.push(geo.principalSubdivision);
  if (geo.countryName) parts.push(geo.countryName);
  if (geo.postcode) parts.push(geo.postcode);
  return parts.filter(Boolean).join(", ");
}

// If you still want a simple automatic trigger in index.html:
// window.addEventListener("click", () => requestLocation().catch(()=>{}), { once: true });
