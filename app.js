// Slogans in drei Sprachen
const slogans = {
  de: "MUT & STOLZ",
  fr: "COURAGE & FIERTÉ",
  en: "COURAGE & PRIDE"
};

let lang = "de";

// Dummy-Spielerliste
let alleSpieler = [
  {name:"Max", icon:"logo/wiki_mini.png"},
  {name:"Leo", icon:"logo/wiki_mini.png"},
  {name:"Tom", icon:"logo/wiki_mini.png"}
];

// Trainings werden lokal gespeichert
let trainings = JSON.parse(localStorage.getItem("trainings") || "[]");

// Feedbacks: {trainingId, spieler, rating, kommentar}
let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");

// Aktueller Benutzer: {rolle, name}
let user = null;

// --- Sprachumschaltung ---
function setLang(l) {
  lang = l;
  render();
}

window.onload = render;

// --- Render-Funktionen ---
function render() {
  document.getElementById("app").innerHTML = `
    <h1>${slogans[lang]}</h1>
    <div style="display:flex;justify-content:center;gap:24px;flex-wrap:wrap;">
      <button onclick="showLogin('coach')">Coach</button>
      <button onclick="showLogin('spieler')">Spieler</button>
    </div>
  `;
}

// --- Login ---
function showLogin(rolle) {
  let extra = rolle==="spieler" ? `
    <div style="margin-bottom:12px;">
      <label>Dein Name:</label>
      <select id="spielerName" style="width:100%;margin-top:6px;">
        ${alleSpieler.map(s=>`<option>${s.name}</option>`).join("")}
      </select>
    </div>
  ` : '';
  document.getElementById("app").innerHTML = `
    <h2>${rolle === "coach" ? "Coach-Login" : "Spieler-Login"}</h2>
    ${extra}
    <button onclick="login('${rolle}')">Weiter</button>
    <button onclick="render()">Zurück</button>
  `;
}
function login(rolle) {
  if (rolle==="coach") {
    user = {rolle:"coach", name:"Coach"};
    renderCoach();
  } else {
    const name = document.getElementById("spielerName").value;
    user = {rolle:"spieler", name};
    renderSpieler();
  }
}

// --- Coach-Dashboard ---
function renderCoach() {
  document.getElementById("app").innerHTML = `
    <h2>Coach-Dashboard</h2>
    <button onclick="renderNewTraining()">Neues Training anlegen</button>
    <h3>Trainingsübersicht</h3>
    <div>
      ${trainings.length === 0 ? "<p>Noch keine Trainings vorhanden.</p>" : trainings.map((t,i)=>`
        <div class="training-entry">
          <b>${t.titel}</b> (${t.kategorie||""}, ${t.datum||""})<br>
          <span>${t.beschreibung||""}</span><br>
          <b>Zugewiesen an:</b> ${t.spieler.join(", ")}
          <br>
          <button onclick="renderEditTraining(${i})">Bearbeiten</button>
          <button onclick="deleteTraining(${i})">Löschen</button>
          <br>
          <b>Feedback:</b>
          <ul>
            ${feedbacks.filter(f=>f.trainingId===t.id).map(f=>
              `<li>${f.spieler}: ${"★".repeat(f.rating)}${"☆".repeat(5-f.rating)} – <i>${f.kommentar||""}</i></li>`
            ).join("") || "<li>Noch kein Feedback.</li>"}
          </ul>
        </div>
      `).join("")}
    </div>
    <button onclick="logout()">Logout</button>
  `;
}

function renderNewTraining() {
  document.getElementById("app").innerHTML = `
    <h2>Neues Training anlegen</h2>
    <form onsubmit="saveTraining(event)">
      <label>Titel:<br><input id="t-titel" required></label><br>
      <label>Beschreibung:<br><textarea id="t-beschreibung"></textarea></label><br>
      <label>Kategorie:<br><input id="t-kategorie"></label><br>
      <label>Datum:<br><input type="date" id="t-datum"></label><br>
      <label>Zuweisen an:<br>
        <select id="t-spieler" multiple size="3" style="width:100%;">
          ${alleSpieler.map(s=>`<option>${s.name}</option>`).join("")}
        </select>
      </label><br>
      <button type="submit">Speichern</button>
      <button type="button" onclick="renderCoach()">Abbrechen</button>
    </form>
  `;
}

function saveTraining(e) {
  e.preventDefault();
  const titel = document.getElementById("t-titel").value;
  const beschreibung = document.getElementById("t-beschreibung").value;
  const kategorie = document.getElementById("t-kategorie").value;
  const datum = document.getElementById("t-datum").value;
  const spieler = Array.from(document.getElementById("t-spieler").selectedOptions).map(opt=>opt.value);
  trainings.push({
    id: Date.now()+"",
    titel, beschreibung, kategorie, datum, spieler
  });
  localStorage.setItem("trainings", JSON.stringify(trainings));
  renderCoach();
}

function renderEditTraining(idx) {
  const t = trainings[idx];
  document.getElementById("app").innerHTML = `
    <h2>Training bearbeiten</h2>
    <form onsubmit="updateTraining(event,${idx})">
      <label>Titel:<br><input id="t-titel" value="${t.titel}" required></label><br>
      <label>Beschreibung:<br><textarea id="t-beschreibung">${t.beschreibung||""}</textarea></label><br>
      <label>Kategorie:<br><input id="t-kategorie" value="${t.kategorie||""}"></label><br>
      <label>Datum:<br><input type="date" id="t-datum" value="${t.datum||""}"></label><br>
      <label>Zuweisen an:<br>
        <select id="t-spieler" multiple size="3" style="width:100%;">
          ${alleSpieler.map(s=>`<option${t.spieler.includes(s.name)?" selected":""}>${s.name}</option>`).join("")}
        </select>
      </label><br>
      <button type="submit">Änderungen speichern</button>
      <button type="button" onclick="renderCoach()">Abbrechen</button>
    </form>
  `;
}
function updateTraining(e, idx) {
  e.preventDefault();
  const titel = document.getElementById("t-titel").value;
  const beschreibung = document.getElementById("t-beschreibung").value;
  const kategorie = document.getElementById("t-kategorie").value;
  const datum = document.getElementById("t-datum").value;
  const spieler = Array.from(document.getElementById("t-spieler").selectedOptions).map(opt=>opt.value);
  trainings[idx] = {...trainings[idx], titel, beschreibung, kategorie, datum, spieler};
  localStorage.setItem("trainings", JSON.stringify(trainings));
  renderCoach();
}
function deleteTraining(idx) {
  if (confirm("Wirklich löschen?")) {
    trainings.splice(idx,1);
    localStorage.setItem("trainings", JSON.stringify(trainings));
    renderCoach();
  }
}

// --- Spieler-Dashboard ---
function renderSpieler() {
  // Eigene Trainings suchen
  const meineTrainings = trainings.filter(t=>t.spieler.includes(user.name));
  document.getElementById("app").innerHTML = `
    <h2>Willkommen, ${user.name}!</h2>
    <h3>Dein Trainingsplan</h3>
    ${meineTrainings.length === 0 ? "<p>Noch keine Trainings zugewiesen.</p>" : meineTrainings.map((t,i)=>`
      <div class="training-entry">
        <b>${t.titel}</b> (${t.kategorie||""}, ${t.datum||""})<br>
        <span>${t.beschreibung||""}</span><br>
        <button onclick="markDone('${t.id}')">Erledigt</button>
        <button onclick="renderFeedback('${t.id}')">Feedback geben</button>
        ${feedbacks.find(f=>f.trainingId===t.id && f.spieler===user.name) ? 
          `<div><b>Dein Feedback:</b> ${"★".repeat(feedbacks.find(f=>f.trainingId===t.id && f.spieler===user.name).rating)}${"☆".repeat(5-feedbacks.find(f=>f.trainingId===t.id && f.spieler===user.name).rating)}
          <i>${feedbacks.find(f=>f.trainingId===t.id && f.spieler===user.name).kommentar||""}</i></div>`:""
        }
      </div>
    `).join("")}
    <button onclick="logout()">Logout</button>
  `;
}
function markDone(trainingId) {
  alert("Super! Du hast das Training erledigt.");
}
function renderFeedback(trainingId) {
  document.getElementById("app").innerHTML = `
    <h2>Feedback geben</h2>
    <form onsubmit="saveFeedback(event,'${trainingId}')">
      <label>Wie war das Training?<br>
        <select id="f-rating">
          <option value="5">5 ★</option>
          <option value="4">4 ★</option>
          <option value="3">3 ★</option>
          <option value="2">2 ★</option>
          <option value="1">1 ★</option>
        </select>
      </label><br>
      <label>Kommentar:<br><textarea id="f-kommentar"></textarea></label><br>
      <button type="submit">Absenden</button>
      <button type="button" onclick="renderSpieler()">Abbrechen</button>
    </form>
  `;
}
function saveFeedback(e, trainingId) {
  e.preventDefault();
  const rating = parseInt(document.getElementById("f-rating").value);
  const kommentar = document.getElementById("f-kommentar").value;
  // Nur ein Feedback pro Spieler/Training
  feedbacks = feedbacks.filter(f=>!(f.trainingId===trainingId && f.spieler===user.name));
  feedbacks.push({
    trainingId,
    spieler: user.name,
    rating,
    kommentar
  });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  renderSpieler();
}

// --- Logout ---
function logout() {
  user = null;
  render();
}