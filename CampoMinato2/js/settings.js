const settingsButton = document.querySelector("button#settings");
const settingsMenu = document.querySelector("div#background");
const settingsCloseButton = document.querySelector("button#close_settings");
const settingsSaveButton = document.querySelector("button#save_settings");

// Carica preferenza dark mode salvata
if (localStorage.getItem("dark") === "1") document.body.classList.add("dark");

if(!localStorage.getItem("rows") || !localStorage.getItem("cols") || !localStorage.getItem("percent")) {
    localStorage.setItem("rows", 12);
    localStorage.setItem("cols", 12);
    localStorage.setItem("percent", 10);
}

// Apri overlay
settingsButton.addEventListener("click", () => {
    settingsMenu.classList.add("visible");

    document.querySelector("#rows").value         = localStorage.getItem("rows");
    document.querySelector("#rows_val").textContent = localStorage.getItem("rows");

    document.querySelector("#cols").value         = localStorage.getItem("cols");
    document.querySelector("#cols_val").textContent = localStorage.getItem("cols");

    document.querySelector("#mines").value          = localStorage.getItem("percent");
    document.querySelector("#mines_val").textContent = localStorage.getItem("percent");

    document.querySelector("#dark_toggle").checked = localStorage.getItem("dark") === "1"; // ← aggiunta

    aggiornaDanger();
});


// Chiudi overlay
settingsCloseButton.addEventListener("click", () => {
    settingsMenu.classList.remove("visible");
});

// Chiudi overlay e salva con localStorage
settingsSaveButton.addEventListener("click", () => {
    localStorage.setItem("rows", document.querySelector("#rows").value);
    localStorage.setItem("cols", document.querySelector("#cols").value);
    localStorage.setItem("percent", document.querySelector("#mines").value);

    const darkVal = document.querySelector("#dark_toggle").checked ? "1" : "0";
    localStorage.setItem("dark", darkVal);
    document.body.classList.toggle("dark", darkVal === "1");


    if(window.location.pathname.endsWith("game.html")) {
        location.reload();
    }

    settingsMenu.classList.remove("visible");
});

// Chiudi cliccando fuori dalla modale
settingsMenu.addEventListener("click", (e) => {
    if (e.target === settingsMenu) {
        settingsMenu.classList.remove("visible");
    }
});

//sliders
const sliders = [
    { slider: "rows",  display: "rows_val" },
    { slider: "cols",  display: "cols_val" },
    { slider: "mines", display: "mines_val" }
];

const ratio = document.documentElement.clientWidth / (document.documentElement.clientHeight 
    - document.querySelector("header").offsetHeight 
    - document.querySelector("footer").offsetHeight);

function aggiornaDanger() {
    const r = parseInt(document.querySelector("#rows").value);
    const c = parseInt(document.querySelector("#cols").value);
    const minesVal = parseInt(document.querySelector("#mines").value);
    const minesLabel = document.querySelector("#mines_val");

    const totCelle = r * c;
    const soglia = Math.max(29, Math.round(10 + (totCelle / (30 * 60)) * 20));
    minesLabel.classList.toggle("danger", minesVal > soglia);
}

sliders.forEach(({ slider, display }) => {
    const input = document.querySelector(`#${slider}`);
    const label = document.querySelector(`#${display}`);

    input.addEventListener("input", () => {
        document.querySelectorAll(".preset").forEach(b => b.classList.remove("active"));

        label.textContent = input.value;

        if (slider === "rows") {
            // mappa rows (5-30) → cols (5-60) linearmente
            const newCols = Math.round(5 + (input.value - 5) * (60 - 5) / (30 - 5));
            document.querySelector("#cols").value = newCols;
            document.querySelector("#cols_val").textContent = newCols;
        } else if (slider === "cols") {
            // mappa cols (5-60) → rows (5-30) linearmente
            const newRows = Math.round(5 + (input.value - 5) * (30 - 5) / (60 - 5));
            document.querySelector("#rows").value = newRows;
            document.querySelector("#rows_val").textContent = newRows;
        }

        aggiornaDanger(); // ← chiamata in tutti e tre i casi
    });
});

// Preset modalità
document.querySelectorAll(".preset").forEach(btn => {
    btn.addEventListener("click", () => {
        const r = btn.dataset.rows;
        const c = btn.dataset.cols;
        const p = btn.dataset.percent;

        document.querySelector("#rows").value = r;
        document.querySelector("#rows_val").textContent = r;
        document.querySelector("#cols").value = c;
        document.querySelector("#cols_val").textContent = c;
        document.querySelector("#mines").value = p;
        document.querySelector("#mines_val").textContent = p;

        // Evidenzia il preset attivo
        document.querySelectorAll(".preset").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        aggiornaDanger();
    });
});


