/*
    Costanti e classi
*/

const SEMI = ["bastoni", "coppe", "denari", "spade"];

class Mazzo {
    carte = [];

    constructor() {
        for (const seme of SEMI) {
            for (let valore = 1; valore <= 10; valore++) {
                this.carte.push({ seme, valore });
            }
        }
    }

    mescola() {
        for (let i = this.carte.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.carte[i], this.carte[j]] = [this.carte[j], this.carte[i]];
        }
    }

    pesca() {
        if (this.isEmpty) {
            throw new Error("Mazzo vuoto!");
        }
        return this.carte.pop();
    }

    get size() {
        return this.carte.length;
    }

    get isEmpty() {
        return this.carte.length === 0;
    }
}

function creaPunteggioVuoto() {
    return {
        primiera: 0,
        "sette bello": 0,
        carte: 0,
        ori: 0,
        scope: 0,
        napoleone: 0
    };
}

/*
    Stato partita
*/

let mazzo;
let banco_carte = [];
let giocatore_carte = [];
let bot_carte = [];
let giocatore_mazzo = [];
let bot_mazzo = [];
let carta_selezionata = null;
let ultima_presa_giocatore = false;

let player_starts = Math.random() >= 0.5;
let player_turn = player_starts;

let punteggio_mano_giocatore = creaPunteggioVuoto();
let punteggio_mano_bot = creaPunteggioVuoto();

let modalita_partita = null;
let scelta_prima_mano = true;

let totale_match = {
    giocatore: 0,
    bot: 0
};

let storico_mani = [];
let numero_mano = 1;
let risultato_mano_corrente = null;

let listenerConfirmAggiunto = false;
let div_inizio = document.querySelector("#inizio h2");

let punti_obiettivo_match = 11; // 11 o 21

let carte_uscite = [];

let memoria_denari = {
    giocatore: [],
    bot: []
};

let intervalHighlightPrese = null;
let indiceHighlightCorrente = 0;

/*
    Avvio e reset mano
*/

function aggiornaMessaggioInizio() {
    const div_inizio = document.querySelector("#inizio h2");
    div_inizio.textContent = player_starts ? "Inizi tu" : "Inizia il bot";
    div_inizio.classList.remove("dissolvenza");
    void div_inizio.offsetWidth;
    div_inizio.classList.add("dissolvenza");
}

function inizializzaMano() {
    mazzo = new Mazzo();
    mazzo.mescola();

    banco_carte = [];
    giocatore_carte = [];
    bot_carte = [];
    giocatore_mazzo = [];
    bot_mazzo = [];
    carta_selezionata = null;
    ultima_presa_giocatore = false;

    punteggio_mano_giocatore = creaPunteggioVuoto();
    punteggio_mano_bot = creaPunteggioVuoto();

    carte_uscite = [];

    memoria_denari = {
        giocatore: [],
        bot: []
    };

    renderTable();
    aggiornaMessaggioInizio();
}

function avviaPrimaPartita() {
    inizializzaMano();
    startGame();
}

avviaPrimaPartita();

function preparaNuovaMano() {
    document.getElementById("endgame").style.display = "none";

    numero_mano++;
    player_starts = !player_starts;
    player_turn = player_starts;

    inizializzaMano();
    startGame();
}

function riavviaGioco() {
    modalita_partita = null;
    scelta_prima_mano = true;

    totale_match = {
        giocatore: 0,
        bot: 0
    };

    storico_mani = [];
    numero_mano = 1;

    player_starts = Math.random() >= 0.5;
    player_turn = player_starts;

    document.getElementById("endgame").style.display = "none";

    inizializzaMano();
    startGame();
}

/*
    Flusso partita
*/

function startGame() {
    let carta;
    distribuisci();

    setTimeout(() => {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                renderTable();
                banco_carte.push(carta = mazzo.pesca());
                pescaggioBanco(carta, i);
            }, i * 500);
        }

        setTimeout(() => {
            renderTable();

            if (!listenerConfirmAggiunto) {
                document.getElementById("confirm").addEventListener("click", () => {
                    if (!carta_selezionata) {
                        return;
                    }
                    confermaCarta();
                });
                listenerConfirmAggiunto = true;
            }

            gestisciTurno();
        }, 2000);
    }, 3500);
}

function distribuisci() {
    let carta;

    for (let i = 0; i < 3; i++) {
        if (player_starts) {
            setTimeout(() => {
                renderTable();
                giocatore_carte.push(carta = mazzo.pesca());
                animazionePescaggio(carta, true);
            }, 500 + 1000 * i);

            setTimeout(() => {
                renderTable();
                bot_carte.push(mazzo.pesca());
                animazionePescaggio(null, false);
                renderTable();
            }, 1000 + 1000 * i);
        } else {
            setTimeout(() => {
                renderTable();
                bot_carte.push(mazzo.pesca());
                animazionePescaggio(null, false);
            }, 500 + 1000 * i);

            setTimeout(() => {
                renderTable();
                giocatore_carte.push(carta = mazzo.pesca());
                animazionePescaggio(carta, true);
                renderTable();
            }, 1000 + 1000 * i);
        }
    }
}

function gestisciTurno() {
    let pescaggio = false;
    carta_selezionata = null;
    aggiornaBottone();
    fermaCicloHighlight();

    if (giocatore_carte.length === 0 && bot_carte.length === 0) {
        if (mazzo.isEmpty) {
            if (ultima_presa_giocatore) {
                banco_carte.forEach(c => giocatore_mazzo.push(c));
            } else {
                banco_carte.forEach(c => bot_mazzo.push(c));
            }

            banco_carte = [];
            renderTable();

            setTimeout(endGame, 1500);
            return;
        } else {
            pescaggio = true;
            distribuisci();
            renderTable();
        }
    }

    if (pescaggio) {
        setTimeout(() => {
            if (player_turn) {
                console.log("Turno: GIOCATORE");
                giocatoreGioca();
            } else {
                console.log("Turno: BOT");
                setTimeout(botGioca, 800);
            }
        }, 3000);
    } else {
        if (player_turn) {
            console.log("Turno: GIOCATORE");
            giocatoreGioca();
        } else {
            console.log("Turno: BOT");
            setTimeout(botGioca, 800);
        }
    }
}

function endGame() {
    risultato_mano_corrente = calcolaPunteggioMano();

    if (scelta_prima_mano) {
        mostraSceltaPrimaMano();
        return;
    }

    if (modalita_partita === "a11") {
        aggiungiManoAStorico(risultato_mano_corrente, true);

        const partitaFinita =
            (totale_match.giocatore >= punti_obiettivo_match  || totale_match.bot >= punti_obiettivo_match ) &&
            totale_match.giocatore !== totale_match.bot;

        if (partitaFinita) {
            mostraRiepilogoFinale(true);
        } else {
            mostraRiepilogoManoA11();
        }
        return;
    }

    if (modalita_partita === "singola") {
        aggiungiManoAStorico(risultato_mano_corrente, false);
        mostraRiepilogoFinale(false);
    }
}

/*
    Rendering tavolo
*/

function renderTable() {
    let div_bot = document.getElementById("bot");
    let div_gioc = document.getElementById("giocatore");
    let div_banco = document.getElementById("banco_c");

    div_bot.innerHTML = "";
    div_banco.innerHTML = "";
    div_gioc.innerHTML = "";

    let img;

    bot_carte.forEach(element => {
        img = document.createElement("img");
        img.src = "assets/images/carte/retro.jpg";
        img.alt = "Retro carta";
        img.classList.add("carta");
        div_bot.appendChild(img);
    });

    giocatore_carte.forEach(element => {
        img = document.createElement("img");
        img.src = "assets/images/carte/" + element.valore + "_" + element.seme + ".jpg";
        img.alt = "Carta di valore " + element.valore + " e di seme " + element.seme;
        img.classList.add("carta");
        div_gioc.appendChild(img);
    });

    banco_carte.forEach(element => {
        img = document.createElement("img");
        img.src = "assets/images/carte/" + element.valore + "_" + element.seme + ".jpg";
        img.alt = "Carta di valore " + element.valore + " e di seme " + element.seme;
        img.classList.add("carta");
        div_banco.appendChild(img);
    });

    let counter_mazzo = document.getElementById("counterBanco");
    counter_mazzo.textContent = mazzo.size;

    let div_mazzo = document.getElementsByClassName("gioc_mazzetto");
    div_mazzo[0].innerHTML = "";
    img = document.createElement("img");

    if (giocatore_mazzo.length > 0) {
        img.src = "assets/images/carte/retro.jpg";
        img.alt = "Retro carta";
        img.classList.add("carta");
        div_mazzo[0].appendChild(img);
    } else {
        div_mazzo[0].innerHTML += '<div class="mazzetto_vuoto"></div>';
    }

    div_mazzo[0].innerHTML += "<span id='counterG'>" + giocatore_mazzo.length + "</span>";

    div_mazzo = document.getElementsByClassName("bot_mazzetto");
    div_mazzo[0].innerHTML = "";
    img = document.createElement("img");

    if (bot_mazzo.length > 0) {
        img.src = "assets/images/carte/retro.jpg";
        img.alt = "Retro carta";
        img.classList.add("carta");
        div_mazzo[0].appendChild(img);
    } else {
        div_mazzo[0].innerHTML += '<div class="mazzetto_vuoto"></div>';
    }

    div_mazzo[0].innerHTML += "<span id='counterBot'>" + bot_mazzo.length + "</span>";
}

/*
    Animazioni
*/

function animazionePescaggio(carta, giocatore) {
    const main = document.querySelector("main");
    const mainRect = main.getBoundingClientRect();
    const mazzo = document.getElementById("banco_m").getBoundingClientRect();

    const img = document.createElement("img");
    img.src = giocatore
        ? "assets/images/carte/" + carta.valore + "_" + carta.seme + ".jpg"
        : "assets/images/carte/retro.jpg";
    img.classList.add("carta", "toanimate");

    img.style.left = (mazzo.left + mazzo.width / 2 - mainRect.left) + "px";
    img.style.top = (mazzo.top + mazzo.height / 2 - mainRect.top) + "px";

    const dest = document.getElementsByClassName(giocatore ? "div_giocatore" : "div_bot")[0].getBoundingClientRect();
    const targetX = (dest.left + dest.width / 2 - mainRect.left) - parseFloat(img.style.left);
    const targetY = giocatore
        ? (dest.top + dest.height / 2 - mainRect.top - 80) - parseFloat(img.style.top)
        : (dest.top + dest.height / 2 - mainRect.top - 40) - parseFloat(img.style.top);

    img.style.setProperty("--tx", targetX + "px");
    img.style.setProperty("--ty", targetY + "px");

    main.appendChild(img);
    img.classList.add("vola-alla-mano");

    img.addEventListener("animationend", () => img.remove(), { once: true });
}

function pescaggioBanco(carta, n) {
    const main = document.querySelector("main");
    const mainRect = main.getBoundingClientRect();
    const mazzo = document.getElementById("banco_m").getBoundingClientRect();

    const img = document.createElement("img");
    img.src = "assets/images/carte/" + carta.valore + "_" + carta.seme + ".jpg";
    img.classList.add("carta", "toanimate");

    img.style.left = (mazzo.left + mazzo.width / 2 - mainRect.left) + "px";
    img.style.top = (mazzo.top + mazzo.height / 2 - mainRect.top) + "px";

    const dest = document.getElementsByClassName("div_banco")[0].getBoundingClientRect();
    const targetX = (dest.left + dest.width / 2 - mainRect.left - 160 + (55 * n)) - parseFloat(img.style.left);
    const targetY = (dest.top + dest.height / 2 - mainRect.top - 40) - parseFloat(img.style.top);

    img.style.setProperty("--tx", targetX + "px");
    img.style.setProperty("--ty", targetY + "px");

    main.appendChild(img);
    img.classList.add("vola-alla-mano");

    img.addEventListener("animationend", () => img.remove(), { once: true });
}

function animazioneCarta(carta, giocatore) {
    const main = document.querySelector("main");
    const banco = document.getElementsByClassName("div_banco")[0].getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();

    const img = document.createElement("img");
    img.src = "assets/images/carte/" + carta.valore + "_" + carta.seme + ".jpg";
    img.classList.add("carta", "toanimate");

    if (giocatore) {
        const divGiocatore = document.getElementsByClassName("div_giocatore")[0].getBoundingClientRect();
        img.style.left = (divGiocatore.left + divGiocatore.width / 2 - mainRect.left) + "px";
        img.style.top = (divGiocatore.top + divGiocatore.height / 2 - mainRect.top - 70) + "px";
    } else {
        img.style.left = (mainRect.width / 2) + "px";
        img.style.top = "0px";
    }

    const targetX = (banco.left + banco.width / 2) - mainRect.left - img.offsetWidth / 2;
    const targetY = (banco.top + banco.height / 2) - mainRect.top - img.offsetHeight / 2 - 40;

    img.style.setProperty("--tx", `${targetX - parseFloat(img.style.left)}px`);
    img.style.setProperty("--ty", `${targetY - parseFloat(img.style.top)}px`);

    main.appendChild(img);
    img.classList.add("vola-al-banco");

    img.addEventListener("animationend", () => img.remove(), { once: true });
}

function higlightCarte(presa) {
    const carte = document.querySelectorAll("#banco_c .carta");

    presa.forEach(cartaPresa => {
        const index = banco_carte.findIndex(c =>
            c.seme === cartaPresa.seme && c.valore === cartaPresa.valore
        );

        carte[index].classList.add("highlighted");
    });
}

/*
    Turno giocatore
*/

function giocatoreGioca() {
    const imgs = document.querySelectorAll("#giocatore img");

    giocatore_carte.forEach((element, i) => {
        imgs[i].classList.add("toplay");

        imgs[i].addEventListener("click", () => {
            if (carta_selezionata?.element === element) {
                imgs[i].classList.remove("selected");
                carta_selezionata = null;
                fermaCicloHighlight();
            } else {
                if (carta_selezionata) {
                    carta_selezionata.img.classList.remove("selected");
                }

                imgs.forEach(img => img.classList.remove("selected"));
                imgs[i].classList.add("selected");
                carta_selezionata = { element, img: imgs[i] };

                const prese = calcolaPrese(element, banco_carte);
                avviaCicloHighlight(prese);
            }

            aggiornaBottone();
        });
    });
}

function aggiornaBottone() {
    const btn = document.getElementById("confirm");
    btn.disabled = !(player_turn && carta_selezionata !== null);
}

function confermaCarta() {
    fermaCicloHighlight();

    if (!carta_selezionata) {
        return;
    }

    const carta = carta_selezionata.element;
    carta_selezionata = null;

    const prese = calcolaPrese(carta, banco_carte);

    console.log(carta);

    if (prese.length === 0) {
        cartaAlBanco(carta);
    } else if (prese.length === 1) {
        eseguiPresa(carta, prese[0]);
    } else {
        mostraOpzioni(carta, prese);
    }
}

function cartaAlBanco(carta) {
    fermaCicloHighlight();

    giocatore_carte = giocatore_carte.filter(c => c !== carta);

    renderTable();
    animazioneCarta(carta, true);

    setTimeout(() => {
        banco_carte.push(carta);
        registraCartaUscita(carta);

        player_turn = false;

        renderTable();
        gestisciTurno();
    }, 1000);
}

function eseguiPresa(carta, scelta) {
    fermaCicloHighlight();

    giocatore_mazzo.push(carta);
    giocatore_carte = giocatore_carte.filter(c => c !== carta);

    renderTable();
    higlightCarte(scelta);
    animazioneCarta(carta, true);

    setTimeout(() => {
        scelta.forEach(c => {
            giocatore_mazzo.push(c);
        });

        banco_carte = banco_carte.filter(c => !scelta.includes(c));

        if (banco_carte.length === 0 && (bot_carte.length > 0 || giocatore_carte.length > 0 || !mazzo.isEmpty)) {
            scopa(true);
        }

        registraCartaUscita(carta);
        scelta.forEach(registraCartaUscita);
        registraDenariPresi("giocatore", [carta, ...scelta]);

        ultima_presa_giocatore = true;
        player_turn = false;

        renderTable();
        gestisciTurno();
    }, 1000);
}

function mostraOpzioni(carta, scelte) {
    let div_options = document.getElementsByClassName("div_options");
    let opzioni_disp = document.getElementById("opzioni");

    opzioni_disp.innerHTML = "";

    scelte.forEach(scelta => {
        const elem_scelta = document.createElement("button");

        for (let i = 0; i < scelta.length; i++) {
            if (i > 0) {
                elem_scelta.textContent += " + ";
            }
            elem_scelta.textContent += scelta[i].valore + " " + scelta[i].seme + " ";
        }

        elem_scelta.classList.add("play_button");
        opzioni_disp.appendChild(elem_scelta);

        elem_scelta.addEventListener("click", () => {
            div_options[0].style.visibility = "hidden";
            eseguiPresa(carta, scelta);
        });
    });

    div_options[0].style.visibility = "visible";
}

/*
    Turno bot
*/

function botGioca() {
    fermaCicloHighlight();

    const mossa = calcolaMossaBot();

    if (mossa.scelta === "none") {
        botCartaAlBanco(mossa.carta);
    } else {
        botEffettuaPresa(mossa.carta, mossa.scelta);
    }
}

function botCartaAlBanco(carta) {
    bot_carte = bot_carte.filter(c => c !== carta);
    animazioneCarta(carta, false);

    setTimeout(() => {
        banco_carte.push(carta);
        registraCartaUscita(carta);

        player_turn = true;

        renderTable();
        gestisciTurno();
    }, 1000);
}

function botEffettuaPresa(carta, presa) {
    bot_mazzo.push(carta);
    bot_carte = bot_carte.filter(c => c !== carta);

    renderTable();
    higlightCarte(presa);
    animazioneCarta(carta, false);

    setTimeout(() => {
        presa.forEach(c => {
            bot_mazzo.push(c);
        });

        banco_carte = banco_carte.filter(c => !presa.includes(c));

        if (banco_carte.length === 0 && (bot_carte.length > 0 || giocatore_carte.length > 0 || !mazzo.isEmpty)) {
            scopa(false);
        }

        registraCartaUscita(carta);
        presa.forEach(registraCartaUscita);
        registraDenariPresi("bot", [carta, ...presa]);

        ultima_presa_giocatore = false;
        player_turn = true;

        renderTable();
        gestisciTurno();
    }, 1000);
}

function calcolaMossaBot() {
    let migliore_mossa = null;
    let migliore_score = -Infinity;

    for (let i = 0; i < bot_carte.length; i++) {
        const carta = bot_carte[i];
        const opzioni = calcolaPrese(carta, banco_carte);

        if (opzioni.length === 0) {
            const score = valutaButto(carta);

            if (score > migliore_score) {
                migliore_mossa = { carta: carta, scelta: "none" };
                migliore_score = score;
            }
        } else {
            opzioni.forEach(presa => {
                const score = valutaPresa(carta, presa);

                if (score > migliore_score) {
                    migliore_mossa = { carta: carta, scelta: presa };
                    migliore_score = score;
                }
            });
        }
    }

    return migliore_mossa;
}

function valutaStrategiaNapoleone(carta, presa = []) {
    const carteCoinvolte = [carta, ...presa];

    const denariCoinvolti = carteCoinvolte
        .filter(c => c.seme === "denari")
        .map(c => c.valore);

    const denariBot = [...memoria_denari.bot];
    const denariGiocatore = [...memoria_denari.giocatore];

    let score = 0;

    if (denariBot.includes(1) && denariBot.includes(2) && denariCoinvolti.includes(3)) {
        score += 40;
    }

    if (denariBot.includes(1) && denariCoinvolti.includes(2)) {
        score += 20;
    }

    if (denariBot.includes(2) && denariCoinvolti.includes(1)) {
        score += 20;
    }

    if (denariBot.includes(1) && denariBot.includes(2) && denariBot.includes(3) && denariCoinvolti.includes(4)) {
        score += 15;
    }

    if (denariGiocatore.includes(1) && denariGiocatore.includes(2) && denariCoinvolti.includes(3)) {
        score += 25;
    }

    if (denariGiocatore.includes(1) && denariCoinvolti.includes(2)) {
        score += 12;
    }

    if (denariGiocatore.includes(2) && denariCoinvolti.includes(1)) {
        score += 12;
    }

    return score;
}

function valutaButto(carta) {
    let score = 0;

    if (carta.seme === "denari") {
        score -= 15;
    }

    switch (carta.valore) {
        case 7:
            score -= 15;
            break;

        case 6:
            score -= 10;
            break;

        case 1:
            score -= 9;
            break;

        default:
            break;
    }

    const bancoDopoScarto = [...banco_carte, carta];
    score -= valutaRischioPerGiocatore(bancoDopoScarto);

    score -= carta.valore;

    return score;
}

function valutaPresa(carta, presa) {
    let score = 0;

    const banco_rimasto = banco_carte.filter(c =>
        !presa.some(p => p.seme === c.seme && p.valore === c.valore)
    );

    if (banco_rimasto.length === 0) {
        score += 100;
    }

    score += presa.length * 5;

    if (carta.seme === "denari" && carta.valore === 7) {
        score += 30;
    }
    if (presa.some(c => c.seme === "denari" && c.valore === 7)) {
        score += 30;
    }

    const lascia_7_denari = banco_rimasto.some(c => c.seme === "denari" && c.valore === 7);
    if (lascia_7_denari) {
        score -= 25;
    }

    if (carta.seme === "denari") {
        score += 8;
    }
    score += presa.filter(c => c.seme === "denari").length * 8;

    if (carta.valore === 7) {
        score += 10;
    }
    if (presa.some(c => c.valore === 7)) {
        score += 10;
    }
    if (carta.valore === 6) {
        score += 8;
    }
    if (presa.some(c => c.valore === 6)) {
        score += 8;
    }
    if (carta.valore === 1) {
        score += 6;
    }
    if (presa.some(c => c.valore === 1)) {
        score += 6;
    }
    if (carta.seme === "denari" && [1, 2, 3, 4, 5].includes(carta.valore)) {
        score -= 12;
    }
    if (mazzo.size <= 6) {
        score += presa.length * 3;
        score += presa.filter(c => c.seme === "denari").length * 5;
    }

    score += valutaStrategiaNapoleone(carta, presa);

    score -= valutaRischioPerGiocatore(banco_rimasto);

    score -= carta.valore;

    return score;
}

function valutaRischioPerGiocatore(bancoRimasto) {
    let rischio = 0;

    giocatore_carte.forEach(cartaGiocatore => {
        const prese = calcolaPrese(cartaGiocatore, bancoRimasto);

        if (prese.length > 0) {
            rischio += 12;
        }

        prese.forEach(presa => {
            if (bancoRimasto.filter(c => !presa.includes(c)).length === 0) {
                rischio += 40;
            }

            if (presa.some(c => c.seme === "denari" && c.valore === 7)) {
                rischio += 30;
            }

            rischio += presa.filter(c => c.seme === "denari").length * 6;
        });
    });

    return rischio;
}

/*
    Punteggi e storico
*/

function registraCartaUscita(carta) {
    carte_uscite.push({
        seme: carta.seme,
        valore: carta.valore
    });
}

function registraDenariPresi(destinatario, carte) {
    carte
        .filter(c => c.seme === "denari")
        .forEach(c => {
            memoria_denari[destinatario].push(c.valore);
        });
}

function calcolaNapoleone(mazzetto) {
    const denari = mazzetto
        .filter(c => c.seme === "denari")
        .map(c => c.valore);

    if (![1, 2, 3].every(v => denari.includes(v))) {
        return 0;
    }

    let puntiNapoleone = 3;

    for (let v = 4; v <= 10; v++) {
        if (denari.includes(v)) {
            puntiNapoleone++;
        } else {
            break;
        }
    }

    return puntiNapoleone;
}

function calcolaPunteggioMano() {
    const puntiGiocatore = creaPunteggioVuoto();
    const puntiBot = creaPunteggioVuoto();

    if (giocatore_mazzo.length > 20) {
        puntiGiocatore.carte++;
    } else if (bot_mazzo.length > 20) {
        puntiBot.carte++;
    }

    const primiera = calcolaPrimiera();
    if (primiera.ris === "g") {
        puntiGiocatore.primiera++;
    } else if (primiera.ris === "b") {
        puntiBot.primiera++;
    }

    if (giocatore_mazzo.some(c => c.seme === "denari" && c.valore === 7)) {
        puntiGiocatore["sette bello"]++;
    }
    if (bot_mazzo.some(c => c.seme === "denari" && c.valore === 7)) {
        puntiBot["sette bello"]++;
    }

    const oriGiocatore = giocatore_mazzo.filter(c => c.seme === "denari").length;
    const oriBot = bot_mazzo.filter(c => c.seme === "denari").length;

    if (oriGiocatore > oriBot) {
        puntiGiocatore.ori++;
    } else if (oriBot > oriGiocatore) {
        puntiBot.ori++;
    }

    puntiGiocatore.scope = punteggio_mano_giocatore.scope;
    puntiBot.scope = punteggio_mano_bot.scope;

    puntiGiocatore.napoleone = calcolaNapoleone(giocatore_mazzo);
    puntiBot.napoleone = calcolaNapoleone(bot_mazzo);

    const totaleGiocatore = Object.values(puntiGiocatore).reduce((a, b) => a + b, 0);
    const totaleBot = Object.values(puntiBot).reduce((a, b) => a + b, 0);

    return {
        giocatore: puntiGiocatore,
        bot: puntiBot,
        totaleGiocatore,
        totaleBot,
        primiera,
        carteGiocatore: giocatore_mazzo.length,
        carteBot: bot_mazzo.length,
        oriGiocatore,
        oriBot
    };
}

function calcolaPrimiera() {
    let bestGioc = {
        bastoni: 0,
        coppe: 0,
        denari: 0,
        spade: 0
    };

    let bestBot = {
        bastoni: 0,
        coppe: 0,
        denari: 0,
        spade: 0
    };

    const PUNTI_PRIMIERA = {
        7: 21,
        6: 18,
        1: 16,
        5: 15,
        4: 14,
        3: 13,
        2: 12,
        8: 10,
        9: 10,
        10: 10
    };

    giocatore_mazzo.forEach(c => {
        const seme = c.seme;

        if (bestGioc[seme] < PUNTI_PRIMIERA[c.valore]) {
            bestGioc[seme] = PUNTI_PRIMIERA[c.valore];
        }
    });

    bot_mazzo.forEach(c => {
        const seme = c.seme;

        if (bestBot[seme] < PUNTI_PRIMIERA[c.valore]) {
            bestBot[seme] = PUNTI_PRIMIERA[c.valore];
        }
    });

    let primieraGioc = 0;
    let primieraBot = 0;

    Object.values(bestGioc).forEach(p => primieraGioc += p);
    Object.values(bestBot).forEach(p => primieraBot += p);

    if (primieraGioc > primieraBot) {
        return { ris: "g", bestGioc, bestBot };
    } else if (primieraBot > primieraGioc) {
        return { ris: "b", bestGioc, bestBot };
    }

    return { ris: null, bestGioc, bestBot };
}

function aggiungiManoAStorico(risultato, aggiornaTotale) {
    if (aggiornaTotale) {
        totale_match.giocatore += risultato.totaleGiocatore;
        totale_match.bot += risultato.totaleBot;
    }

    storico_mani.push({
        mano: numero_mano,
        totaleManoGiocatore: risultato.totaleGiocatore,
        totaleManoBot: risultato.totaleBot,
        dettaglioGiocatore: { ...risultato.giocatore },
        dettaglioBot: { ...risultato.bot },
        totaleMatchDopoMano: {
            giocatore: totale_match.giocatore,
            bot: totale_match.bot
        },
        iniziavaGiocatore: player_starts
    });
}

function renderStorico() {
    const storico = document.getElementById("storico-mani");

    if (!storico_mani.length) {
        storico.innerHTML = "";
        return;
    }

    storico.innerHTML = storico_mani.map(m => `
        <div class="storico-item">
            <h4>Mano ${m.mano}</h4>
            <p><strong>Risultato mano:</strong> Tu ${m.totaleManoGiocatore} - ${m.totaleManoBot} Computer</p>
            <p><strong>Totale cumulativo:</strong> Tu ${m.totaleMatchDopoMano.giocatore} - ${m.totaleMatchDopoMano.bot} Computer</p>
            <p><strong>Iniziava:</strong> ${m.iniziavaGiocatore ? "Tu" : "Computer"}</p>

            <div class="storico-dettagli">
                <div class="storico-colonna">
                    <h5>Tu</h5>
                    <p><strong>Primiera:</strong> ${m.dettaglioGiocatore.primiera}</p>
                    <p><strong>Sette bello:</strong> ${m.dettaglioGiocatore["sette bello"]}</p>
                    <p><strong>Carte:</strong> ${m.dettaglioGiocatore.carte}</p>
                    <p><strong>Denari:</strong> ${m.dettaglioGiocatore.ori}</p>
                    <p><strong>Scope:</strong> ${m.dettaglioGiocatore.scope}</p>
                    <p><strong>Napoleone:</strong> ${m.dettaglioGiocatore.napoleone}</p>
                </div>

                <div class="storico-colonna">
                    <h5>Computer</h5>
                    <p><strong>Primiera:</strong> ${m.dettaglioBot.primiera}</p>
                    <p><strong>Sette bello:</strong> ${m.dettaglioBot["sette bello"]}</p>
                    <p><strong>Carte:</strong> ${m.dettaglioBot.carte}</p>
                    <p><strong>Denari:</strong> ${m.dettaglioBot.ori}</p>
                    <p><strong>Scope:</strong> ${m.dettaglioBot.scope}</p>
                    <p><strong>Napoleone:</strong> ${m.dettaglioBot.napoleone}</p>
                </div>
            </div>
        </div>
    `).join("");
}

function creaHtmlDettaglio(risultato) {
    return `
        <div class="riepilogo-dettaglio">
            <p><strong>Punti totali:</strong> ${risultato.totaleGiocatore}</p>
            <p><strong>Primiera:</strong> ${risultato.giocatore.primiera} pt 
            (${risultato.primiera.bestGioc.denari}, ${risultato.primiera.bestGioc.coppe}, ${risultato.primiera.bestGioc.bastoni}, ${risultato.primiera.bestGioc.spade})</p>
            <p><strong>Sette bello:</strong> ${risultato.giocatore["sette bello"]} pt</p>
            <p><strong>Carte:</strong> ${risultato.giocatore.carte} pt (${risultato.carteGiocatore})</p>
            <p><strong>Denari:</strong> ${risultato.giocatore.ori} pt (${risultato.oriGiocatore})</p>
            <p><strong>Scope:</strong> ${risultato.giocatore.scope} pt</p>
            <p><strong>Napoleone:</strong> ${risultato.giocatore.napoleone} pt</p>
        </div>
    `;
}

function creaHtmlDettaglioBot(risultato) {
    return `
        <div class="riepilogo-dettaglio">
            <p><strong>Punti totali:</strong> ${risultato.totaleBot}</p>
            <p><strong>Primiera:</strong> ${risultato.bot.primiera} pt 
            (${risultato.primiera.bestBot.denari}, ${risultato.primiera.bestBot.coppe}, ${risultato.primiera.bestBot.bastoni}, ${risultato.primiera.bestBot.spade})</p>
            <p><strong>Sette bello:</strong> ${risultato.bot["sette bello"]} pt</p>
            <p><strong>Carte:</strong> ${risultato.bot.carte} pt (${risultato.carteBot})</p>
            <p><strong>Denari:</strong> ${risultato.bot.ori} pt (${risultato.oriBot})</p>
            <p><strong>Scope:</strong> ${risultato.bot.scope} pt</p>
            <p><strong>Napoleone:</strong> ${risultato.bot.napoleone} pt</p>
        </div>
    `;
}

/*
    Endgame e riepiloghi
*/

function mostraSceltaPrimaMano() {
    const endGameDiv = document.getElementById("endgame");
    const vincitore = document.getElementById("vincitore");
    const pointsg = document.getElementById("pointsg");
    const pointsb = document.getElementById("pointsb");
    const storico = document.getElementById("storico-mani");
    const actions = document.getElementById("endgame-actions");

    endGameDiv.className = "div_end_game fadein";
    vincitore.textContent = "Prima mano conclusa";

    pointsg.innerHTML = `
        Vuoi trasformare la partita in un match a 11 o 21 punti, oppure fermarti a questa mano?
    `;

    pointsb.innerHTML = "";
    storico.innerHTML = "";

    actions.innerHTML = `
        <button id="continua-a-11" class="play_button">Continua a 11</button>
        <button id="continua-a-21" class="play_button">Continua a 21</button>
        <button id="finisci-singola" class="play_button">Fermati qui</button>
    `;

    endGameDiv.style.display = "block";

    document.getElementById("continua-a-11").onclick = () => {
        punti_obiettivo_match = 11;
        modalita_partita = "a11";
        scelta_prima_mano = false;
        aggiungiManoAStorico(risultato_mano_corrente, true);
        mostraRiepilogoManoA11();
    };

    document.getElementById("continua-a-21").onclick = () => {
        punti_obiettivo_match = 21;
        modalita_partita = "a11";
        scelta_prima_mano = false;
        aggiungiManoAStorico(risultato_mano_corrente, true);
        mostraRiepilogoManoA11();
    };

    document.getElementById("finisci-singola").onclick = () => {
        modalita_partita = "singola";
        scelta_prima_mano = false;
        aggiungiManoAStorico(risultato_mano_corrente, false);
        mostraRiepilogoFinale(false);
    };
}

function mostraRiepilogoFinale(usaTotaleMatch) {
    const endGameDiv = document.getElementById("endgame");
    const vincitore = document.getElementById("vincitore");
    const pointsg = document.getElementById("pointsg");
    const pointsb = document.getElementById("pointsb");
    const actions = document.getElementById("endgame-actions");

    const puntiFinaliGiocatore = usaTotaleMatch ? totale_match.giocatore : risultato_mano_corrente.totaleGiocatore;
    const puntiFinaliBot = usaTotaleMatch ? totale_match.bot : risultato_mano_corrente.totaleBot;

    endGameDiv.className = "div_end_game fadein";

    if (puntiFinaliGiocatore > puntiFinaliBot) {
        vincitore.textContent = "Hai vinto";
        endGameDiv.classList.add("win");
    } else if (puntiFinaliBot > puntiFinaliGiocatore) {
        vincitore.textContent = "Hai perso";
        endGameDiv.classList.add("lose");
    } else {
        vincitore.textContent = "Pareggio";
        endGameDiv.classList.add("draw");
    }

    pointsg.innerHTML = `
        <h3>Tu</h3>
        <p><b>${usaTotaleMatch ? "Totale finale match" : "Totale mano"}</b>: ${puntiFinaliGiocatore}</p>
        ${creaHtmlDettaglio(risultato_mano_corrente)}
    `;

    pointsb.innerHTML = `
        <h3>Computer</h3>
        <p><b>${usaTotaleMatch ? "Totale finale match" : "Totale mano"}</b>: ${puntiFinaliBot}</p>
        ${creaHtmlDettaglioBot(risultato_mano_corrente)}
    `;

    renderStorico();

    actions.innerHTML = `<button class="play_button" onclick="riavviaGioco()">Nuova partita</button>`;
    endGameDiv.style.display = "block";
}

function mostraRiepilogoManoA11() {
    const endGameDiv = document.getElementById("endgame");
    const vincitore = document.getElementById("vincitore");
    const pointsg = document.getElementById("pointsg");
    const pointsb = document.getElementById("pointsb");
    const actions = document.getElementById("endgame-actions");

    endGameDiv.className = "div_end_game fadein";
    vincitore.textContent = `Mano ${numero_mano} conclusa`;

    pointsg.innerHTML = `
        <h3>Tu</h3>
        <p><b>Totale match</b>: ${totale_match.giocatore}</p>
        <p><b>Obiettivo match</b>: ${punti_obiettivo_match}</p>
        ${creaHtmlDettaglio(risultato_mano_corrente)}
    `;

    pointsb.innerHTML = `
        <h3>Computer</h3>
        <p><b>Totale match</b>: ${totale_match.bot}</p>
        <p><b>Obiettivo match</b>: ${punti_obiettivo_match}</p>
        ${creaHtmlDettaglioBot(risultato_mano_corrente)}
    `;

    renderStorico();

    actions.innerHTML = `
        <button id="next-hand" class="play_button">Prossima mano</button>
    `;

    document.getElementById("next-hand").onclick = preparaNuovaMano;

    endGameDiv.style.display = "block";
}

/*
    Regole di presa
*/

function calcolaPrese(carta, banco) {
    const target = carta.valore;

    const singole = banco.filter(c => c.valore === target);
    if (singole.length > 0) {
        return singole.map(c => [c]);
    }

    const risultati = [];

    function cerca(indice, correnti, somma) {
        if (somma === target && correnti.length > 1) {
            risultati.push([...correnti]);
            return;
        }

        if (somma > target || indice >= banco.length) {
            return;
        }

        cerca(indice + 1, [...correnti, banco[indice]], somma + banco[indice].valore);
        cerca(indice + 1, correnti, somma);
    }

    cerca(0, [], 0);
    return risultati;
}

/*
    Utility
*/

function scopa(giocatore) {
    let div;

    if (giocatore) {
        punteggio_mano_giocatore.scope++;
        div = document.getElementById("scopa_g");
    } else {
        punteggio_mano_bot.scope++;
        div = document.getElementById("scopa_b");
    }

    div.classList.remove("dissolvenza");
    void div.offsetWidth;
    div.classList.add("dissolvenza");
}

function rimuoviHighlightBanco() {
    const carte = document.querySelectorAll("#banco_c .carta");
    carte.forEach(carta => {
        carta.classList.remove("highlighted", "highlight-cycle");
    });
}

function evidenziaPresa(presa) {
    rimuoviHighlightBanco();
    const carte = document.querySelectorAll("#banco_c .carta");

    presa.forEach(cartaPresa => {
        const index = banco_carte.findIndex(c =>
            c.seme === cartaPresa.seme && c.valore === cartaPresa.valore
        );

        if (index !== -1 && carte[index]) {
            carte[index].classList.add("highlight-cycle");
        }
    });
}

function fermaCicloHighlight() {
    if (intervalHighlightPrese) {
        clearInterval(intervalHighlightPrese);
        intervalHighlightPrese = null;
    }

    indiceHighlightCorrente = 0;
    rimuoviHighlightBanco();
}

function avviaCicloHighlight(prese) {
    fermaCicloHighlight();

    if (!prese || prese.length === 0) return;

    if (prese.length === 1) {
        evidenziaPresa(prese[0]);
        return;
    }

    evidenziaPresa(prese[0]);

    intervalHighlightPrese = setInterval(() => {
        indiceHighlightCorrente = (indiceHighlightCorrente + 1) % prese.length;
        evidenziaPresa(prese[indiceHighlightCorrente]);
    }, 1000);
}