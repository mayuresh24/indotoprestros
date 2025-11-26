import { db } from "./firebase-config.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function loadLocations() {
  const tableBody = document.querySelector("#locationsTable tbody");

  const q = query(
    collection(db, "locations"),
    orderBy("timestamp", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(data.timestamp).toLocaleString()}</td>
      <td>${data.lat}</td>
      <td>${data.lon}</td>
      <td>${data.accuracy}</td>
      <td>${data.city || "-"}</td>
      <td>${data.state || "-"}</td>
      <td>${data.country || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadLocations();
