/* ================================
   CONFIGURAZIONE & STATO
================================ */

const rows    = parseInt(localStorage.getItem("rows"));
const cols    = parseInt(localStorage.getItem("cols"));
const percent = parseInt(localStorage.getItem("percent"));
const totale  = Math.floor(rows * cols * percent / 100);

const matrice = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => ({
    mina: false,
    scoperta: false,
    bandiera: false,
    mineSVicine: 0
  }))
);

// Cache DOM 2D — popolata in generaTable()
const tdCache = Array.from({ length: rows }, () => Array(cols).fill(null));

let isFirst       = true;
let timerInterval = null;
let secondi       = 0;



/* ================================
   INIZIALIZZAZIONE
================================ */

document.addEventListener("DOMContentLoaded", () => {
  generaTable();
  aggiornaBandiere();
});

document.querySelector("#restart").addEventListener("click", () => {
  location.reload();
});



/* ================================
   GENERAZIONE GRIGLIA
================================ */

function generaTable() {
  const headerH    = document.querySelector("header").offsetHeight;
  const footerH    = document.querySelector("footer").offsetHeight;
  const availableH = document.documentElement.clientHeight - headerH - footerH;
  const availableW = document.documentElement.clientWidth;
  const cellSize   = Math.floor(Math.min(availableW / cols, availableH / rows));

  const table = document.querySelector("#grid");
  table.innerHTML = "";
  table.style.width  = `${cellSize * cols}px`;
  table.style.height = `${cellSize * rows}px`;

  for (let r = 0; r < rows; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < cols; c++) {
      const td = document.createElement("td");
      td.dataset.r      = r;
      td.dataset.c      = c;
      td.style.width    = `${cellSize}px`;
      td.style.maxWidth = `${cellSize}px`;
      td.style.height   = `${cellSize}px`;

      td.addEventListener("click", () => reveal(r, c));
      td.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleBandiera(r, c);
      });

      tdCache[r][c] = td; // ← salva riferimento nella cache
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}



/* ================================
   GENERAZIONE MINE
================================ */

function generaMine(r, c) {
  const n_bombe = Math.floor(rows * cols * percent / 100);
  for (let i = 0; i < n_bombe; i++) {
    let rr, cc;
    do {
      rr = Math.floor(Math.random() * rows);
      cc = Math.floor(Math.random() * cols);
    } while (matrice[rr][cc].mina || inRange(rr, cc, r, c));
    matrice[rr][cc].mina = true;
  }
}

function inRange(r, c, r2, c2) {
  return (r >= r2 - 1 && r <= r2 + 1 && c >= c2 - 1 && c <= c2 + 1);
}



/* ================================
   LOGICA DI GIOCO
================================ */

function reveal(r, c) {
  if (matrice[r][c].bandiera || matrice[r][c].scoperta) return;

  if (isFirst) {
    isFirst = false;
    generaMine(r, c);
    avviaTimer();
  }

  // Game over: cella con mina
  if (matrice[r][c].mina) {
    for (let rr = 0; rr < rows; rr++)
      for (let cc = 0; cc < cols; cc++)
        if (matrice[rr][cc].mina) matrice[rr][cc].scoperta = true;

    aggiornaTable(); // ridisegna tutto: tutte le mine vanno mostrate
    fermaTimer();

    const td   = tdCache[r][c]; // ← cache invece di querySelector
    td.classList.add("mina-cliccata");
    const rect = td.getBoundingClientRect();

    document.querySelectorAll("#grid td").forEach(td => {
      td.replaceWith(td.cloneNode(true));
    });

    setTimeout(() => {
      playSound("esplosione");
      const explosion = document.querySelector("#explosion");
      document.querySelector("#grid").classList.add("shake");
      explosion.style.left = `${rect.left + rect.width / 2}px`;
      explosion.style.top  = `${rect.top  + rect.height / 2}px`;
      explosion.hidden = false;
      setTimeout(() => {
        explosion.hidden = true;
        changeMsg("s");
      }, 1500);
    }, 50);

    return;
  }

  playSound("click");

  const celleScoperte = []; // raccoglie le celle scoperte dal flood-fill
  scopri(r, c, celleScoperte);

  // Aggiorna solo le celle effettivamente scoperte in questo click
  for (const [rr, cc] of celleScoperte) {
    aggiornaCella(rr, cc);
  }

  controllaVittoria();
}

function scopri(r, c, celleScoperte) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (matrice[r][c].scoperta) return;
  if (matrice[r][c].bandiera) return;
  if (matrice[r][c].mina)     return;

  matrice[r][c].scoperta = true;
  celleScoperte.push([r, c]); // ← traccia quali celle aggiornare

  const vicine = contaMineVicine(r, c);
  matrice[r][c].mineSVicine = vicine;
  if (vicine > 0) return;

  scopri(r - 1, c - 1, celleScoperte); scopri(r - 1, c, celleScoperte); scopri(r - 1, c + 1, celleScoperte);
  scopri(r,     c - 1, celleScoperte);                                   scopri(r,     c + 1, celleScoperte);
  scopri(r + 1, c - 1, celleScoperte); scopri(r + 1, c, celleScoperte); scopri(r + 1, c + 1, celleScoperte);
}

function contaMineVicine(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
        if (matrice[nr][nc].mina) count++;
    }
  }
  return count;
}

function toggleBandiera(r, c) {
  const cella = matrice[r][c];
  if (cella.scoperta) return;

  const pz = getBandiere();
  if (!cella.bandiera && pz >= totale) return;

  cella.bandiera = !cella.bandiera;
  playSound("bandiera");
  aggiornaBandiere();
  aggiornaCella(r, c); // ← solo la cella toccata
  
  if (pz + 1 === totale) controllaVittoria();
}

function controllaVittoria() {
  const tutteScoperte = matrice.flat().every(c =>
    (c.mina && c.bandiera) || (!c.mina && c.scoperta)
  );
  if (tutteScoperte) {
    fermaTimer();
    aggiornaTable(); // ridisegna tutto per sicurezza
    aggiornaBandiere();
    changeMsg("v");
  }
}



/* ================================
   AGGIORNAMENTO UI
================================ */

// Aggiorna una singola cella tramite cache
function aggiornaCella(r, c) {
  const td    = tdCache[r][c]; // ← zero querySelector
  const cella = matrice[r][c];

  td.textContent = "";
  td.className   = "";

  if (cella.bandiera && !cella.scoperta) {
    td.classList.add("bandiera");
    td.textContent = "🚩";
  } else if (cella.scoperta) {
    td.classList.add("scoperta");
    if (cella.mina) {
      td.classList.add("mina");
      td.textContent = "💣";
    } else if (cella.mineSVicine > 0) {
      td.textContent   = cella.mineSVicine;
      td.dataset.mines = cella.mineSVicine;
    }
  }
}

// Ridisegna tutta la griglia — usato solo per game over e vittoria
function aggiornaTable() {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      aggiornaCella(r, c);
}

function aggiornaBandiere() {
  const piazzate = getBandiere();
  document.querySelector("#bandiere").textContent = `🚩 ${piazzate} / ${totale}`;
}

function getBandiere() {
  return matrice.flat().filter(c => c.bandiera).length;
}

function changeMsg(opz) {
  const vittoria = opz === "v";
  aggiornaStats(vittoria);

  if (vittoria) 
    playSound("vittoria") 

  const streak = parseInt(localStorage.getItem("stat_streak") || 0);
  const mm = document.querySelector("#msg");

  if (vittoria) {
    let testo = `Hai vinto in ${formatTime(secondi)}! 🎉`;
    if (streak > 1) testo += `\n🔥 Streak: ${streak} vittorie di fila!`;
    mm.textContent = testo;
  } else {
    mm.textContent = "Hai perso! 💥";
    document.querySelector("#game_over").classList.add("sco");
  }

  setTimeout(() => document.querySelector("#game_over").classList.add("visible"), 2000);
  setTimeout(() => document.querySelector("#game_over").classList.remove("visible"), 4000);
}



/* ================================
   SUONI
================================ */

function playSound(tipo) {
  const ctx  = new AudioContext();
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  switch (tipo) {
    case "click":
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
      break;
    case "bandiera":
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
      break;
    case "vittoria":
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        o.start(ctx.currentTime + i * 0.15);
        o.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
      break;
    case "esplosione":
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
      break;
  }
}



/* ================================
   STATISTICHE
================================ */

function aggiornaStats(vittoria) {
  const s = {
    giocate:    parseInt(localStorage.getItem("stat_giocate")     || 0) + 1,
    vinte:      parseInt(localStorage.getItem("stat_vinte")       || 0) + (vittoria ? 1 : 0),
    perse:      parseInt(localStorage.getItem("stat_perse")       || 0) + (vittoria ? 0 : 1),
    streak:     vittoria ? parseInt(localStorage.getItem("stat_streak") || 0) + 1 : 0,
    bestStreak: Math.max(
                  parseInt(localStorage.getItem("stat_best_streak") || 0),
                  vittoria ? parseInt(localStorage.getItem("stat_streak") || 0) + 1 : 0
                )
  };

  localStorage.setItem("stat_giocate",     s.giocate);
  localStorage.setItem("stat_vinte",       s.vinte);
  localStorage.setItem("stat_perse",       s.perse);
  localStorage.setItem("stat_streak",      s.streak);
  localStorage.setItem("stat_best_streak", s.bestStreak);
}

function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}



/* ================================
   TIMER
================================ */

function avviaTimer() {
  secondi = 0;
  timerInterval = setInterval(() => {
    secondi++;
    const mm = String(Math.floor(secondi / 60)).padStart(2, "0");
    const ss = String(secondi % 60).padStart(2, "0");
    document.querySelector("#timer").textContent = `⏱️ ${mm}:${ss}`;
  }, 1000);
}

function fermaTimer() {
  clearInterval(timerInterval);
}