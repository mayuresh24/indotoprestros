import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function loadLocations() {
  const table = document.querySelector("#locationsTable tbody");
  table.innerHTML = "";

  const q = query(collection(db, "locations"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);

  snap.forEach(doc => {
    const d = doc.data();

    const row = `
      <tr>
        <td>${d.timestamp || ""}</td>
        <td>${d.lat || ""}</td>
        <td>${d.lon || ""}</td>
        <td>${d.accuracy || ""}</td>
        <td>${d.city || ""}</td>
        <td>${d.state || ""}</td>
        <td>${d.country || ""}</td>
        <td>${d.postal_code || ""}</td>
        <td>${d.formatted || ""}</td>
      </tr>
    `;

    table.insertAdjacentHTML("beforeend", row);
  });
}

loadLocations();
