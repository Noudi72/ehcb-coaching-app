// Sprachen
const slogans = {
  de: "MUT & STOLZ",
  fr: "COURAGE & FIERTÉ",
  en: "COURAGE & PRIDE"
};

let lang = "de";

// Dummy-Data
let spieler = [
  {name:"Max",status:"gruen"},
  {name:"Leo",status:"gelb"},
  {name:"Tom",status:"rot"}
];

function setLang(l) {
  lang = l;
  render();
}

// Initial-Render
window.onload = render;

function render() {
  document.getElementById("app").innerHTML = `
    <h1 style="text-align:center;">${slogans[lang]}</h1>
    <div style="display:flex;justify-content:center;gap:16px;">
      <button onclick="renderCoach()">Coach</button>
      <button onclick="renderPlayer()">Spieler</button>
    </div>
  `;
}

function renderCoach() {
  document.getElementById("app").innerHTML = `
    <h2>Coach Dashboard</h2>
    <ul>
      ${spieler.map(sp=>`
        <li>
          <img src="logo/wiki_mini.png" style="width:32px;vertical-align:middle;margin-right:6px;">
          <b>${sp.name}</b>
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:
            ${sp.status=="gruen"?"#2ecc40":sp.status=="gelb"?"#ffe100":"#c8102e"};
            margin-left:6px;"></span>
        </li>
      `).join("")}
    </ul>
    <button onclick="render()">Zurück</button>
  `;
}

function renderPlayer() {
  document.getElementById("app").innerHTML = `
    <h2>Spieler Dashboard</h2>
    <img src="logo/wiki_mini.png" style="width:60px;display:block;margin:12px auto;">
    <p>Dein Trainingsplan und Feedback kommen hier hin!</p>
    <button onclick="render()">Zurück</button>
  `;
}