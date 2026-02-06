let soldi = 990
let puntata = 10
const soldi_div = document.querySelector("div#soldi")
const puntata_div = document.querySelector("div#puntata")
const importo_div = document.querySelector("div#importo span")
const mano_div = document.querySelector("div#mano")
const controlli_div = document.querySelector("div#controlli")
const next_div = document.querySelector("div#next_game")

let main = document.addEventListener("DOMContentLoaded" , function(){
    soldi_div.querySelector("span").innerHTML = soldi
    importo_div.innerHTML = puntata

    let buttons = puntata_div.querySelectorAll("button")

    for(let i=0; i<buttons.length; i++){
        if(i==3)
            continue

        buttons[i].addEventListener("click", function(){
            let type = buttons[i].getAttribute("id").substring(0,3)
            let num = buttons[i].getAttribute("id").substring(4)
            num = parseInt(num)

            if(type == "dec"){
                if(puntata <= num){
                    soldi += puntata - 10
                    puntata = 10    
                } else {
                    puntata -= num
                    soldi += num
                }
            } else {
                if(num > soldi){
                    puntata += soldi
                    soldi = 0   
                } else {
                    puntata += num
                    soldi -= num
                }
            }

            aggiornaSP()
        })
    }

    buttons[3].addEventListener("click", function(){
        puntata_div.hidden = true
        mano_div.hidden = false

        start_game()
    })

})

function aggiornaSP() {
    soldi_div.querySelector("span").innerHTML = soldi
    importo_div.innerHTML = puntata
}

let carte_giocate_g = []
let carte_giocate_b = []

function start_game(){
    assicurazione_attiva = false
    assicurazione_importo = 0
    carte_giocate_g = []
    carte_giocate_b = []

    // 1. PRIMA CARTA GIOCATORE (200ms)
    setTimeout(() => {
        let seme = Math.floor(Math.random()*4)
        let numero = Math.floor((Math.random()*13)+1)
        carte_giocate_g.push([seme, numero])
        pescaCarta(seme, numero, "mano")
    }, 200);

    // 2. PRIMA CARTA BANCO (600ms)
    setTimeout(() => {
        do{
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(carte_giocate_g[0][0]!=seme && carte_giocate_g[0][1]!=numero){
                carte_giocate_b.push([seme, numero])
                pescaCarta(seme, numero, "carte")
                break;
            }
        }while(true)
    }, 600);

    // 3. SECONDA CARTA GIOCATORE (1000ms)
    setTimeout(() => {
        do{
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(carte_giocate_g[0][0]!=seme && carte_giocate_g[0][1]!=numero){
                if(carte_giocate_b[0][0]!=seme && carte_giocate_b[0][1]!=numero){
                    carte_giocate_g.push([seme, numero])
                    pescaCarta(seme, numero, "mano")
                    break;
                }
            }
        }while(true)
    }, 1000);

    // 4. SECONDA CARTA BANCO COPERTA (1400ms)
    setTimeout(() => {
        do{
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(carte_giocate_g[0][0]!=seme && carte_giocate_g[0][1]!=numero){
                if(carte_giocate_b[0][0]!=seme && carte_giocate_b[0][1]!=numero){
                    if(carte_giocate_g[1][0]!=seme && carte_giocate_g[1][1]!=numero){
                        carte_giocate_b.push([seme, numero])
                        aggiungiCartaCoperta()
                        break;
                    }   
                }
            }
        }while(true)
    }, 1400);

    //Controllare il black jack del banco
    setTimeout(() => {
        if(carte_giocate_b[0][1] == 1 && soldi >= (puntata / 2)){
            //Mostrare overlay assicurazione
            apriAssicurazione()

            let si_button = document.getElementById("assicurazione_si")
            let no_button = document.getElementById("assicurazione_no")

            si_button.addEventListener("click", function(){
                assicurazione_attiva = true
                assicurazione_importo = puntata / 2
                soldi -= assicurazione_importo
                aggiornaSP()
                chiudiAssicurazione()

                check_game_end()
            })
            no_button.addEventListener("click", function(){
                chiudiAssicurazione()

                check_game_end()
            })
        } else {
            check_game_end()
        }
    }, 1800);
}

function check_game_end(){
    if(sommaCarte(carte_giocate_b) == 21){
        //Banco ha black jack
        mostraCartaCoperta()

        if(assicurazione_attiva){
            soldi += assicurazione_importo * 2
            aggiornaSP()
        }

        mostraPerso()

        end_game()
    } else {
        start_player()
    }
}

let pescateInCorso = 0

function pescaCarta(seme, numero, destinazioneId) {
    pescateInCorso++;
    
    const src = getSrcCarta(seme, numero)
    
    const cartaImg = document.createElement('img');
    cartaImg.src = src;
    cartaImg.id = `carta_${Date.now()}_${pescateInCorso}`;
    cartaImg.onerror = () => { cartaImg.src = 'carte/back.png'; };
    
    animaPescata(cartaImg, destinazioneId);
    
    setTimeout(() => {
        pescateInCorso--;
        if(pescateInCorso === 0) {
            console.log('Tutte le pescate terminate!');
        }
    }, 900);
    
    return { seme, numero };
}

function animaPescata(cartaImg, destinazioneId) {
    const destinazione = document.getElementById(destinazioneId);
    const mazzo = document.getElementById('mazzo');
    
    const mazzoRect = mazzo.getBoundingClientRect();
    const destRect = destinazione.getBoundingClientRect();
    
    const zIndex = 1000 + pescateInCorso;
    
    cartaImg.style.position = 'fixed';
    cartaImg.style.left = mazzoRect.left + window.scrollX + 'px';
    cartaImg.style.top = mazzoRect.top + window.scrollY + 'px';
    cartaImg.style.width = '50px';
    cartaImg.style.height = '71px';
    cartaImg.style.opacity = '0';
    cartaImg.style.transform = `scale(0.5) rotate(-${pescateInCorso * 2}deg)`;
    cartaImg.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    cartaImg.style.zIndex = zIndex;
    
    document.body.appendChild(cartaImg);
    
    setTimeout(() => {
        cartaImg.style.opacity = '1';
        
        // CENTRO del div destinazione (non sinistra!)
        const centroDestX = destRect.left + (destRect.width / 2) - 25; // 25 = metà carta 50px
        const centroDestY = destRect.top + (destRect.height / 2) - 35; // 35 = metà carta 71px
        
        cartaImg.style.transform = `
            scale(1) 
            rotate(0deg) 
            translateX(${(centroDestX - mazzoRect.left) + pescateInCorso * 5}px) 
            translateY(${(centroDestY - mazzoRect.top)}px)
        `;
    }, 100);
    
    setTimeout(() => {
        destinazione.appendChild(cartaImg);
        cartaImg.style.position = 'static';
        cartaImg.style.transform = 'none';
        cartaImg.style.transition = 'none';
        cartaImg.style.zIndex = 'auto';
        cartaImg.style.height = '';
    }, 900);
}

function getSrcCarta(seme, numero) {
    const semi = ['spades', 'hearts', 'diamonds', 'clubs'];
    const nomiNumero = {1: 'ace', 11: 'jack', 12: 'queen', 13: 'king'};
    let numStr = numero > 10 || numero == 1 ? nomiNumero[numero] : numero;
    
    // AGGIUNGI "2" DOPO il seme: king_of_spades2.png
    if (numero >= 11 && numero <= 13) {
        return `carte/${numStr}_of_${semi[seme]}2.png`;
    }
    
    return `carte/${numStr}_of_${semi[seme]}.png`;
}

function aggiungiCartaCoperta() {
    const cartaImg = document.createElement('img');
    cartaImg.src = 'carte/back.png';
    cartaImg.id = 'banco_coperta';
    cartaImg.style.width = '50px';
    cartaImg.style.height = '71px';
    
    // USA STESSA animazione pescaCarta!
    animaPescata(cartaImg, 'carte');
}

function mostraCartaCoperta() {
    const imgCoperta = document.getElementById('banco_coperta');
    if (!imgCoperta) return;
    if (carte_giocate_b.length < 2) return;

    // ultima carta del banco = quella coperta
    const [seme, numero] = carte_giocate_b[carte_giocate_b.length - 1];

    imgCoperta.src = getSrcCarta(seme, numero);
    imgCoperta.id = ''; // non è più "coperta"
}

let assicurazione_attiva = false;
let assicurazione_importo = 0;

let hit_button = controlli_div.querySelector("button#hit")
let stand_button = controlli_div.querySelector("button#stand")
let double_button = controlli_div.querySelector("button#double")

function start_player(){
    controlli_div.hidden = false
    
    // Riabilita tutto all'inizio del turno
    hit_button.disabled = false
    stand_button.disabled = false
    double_button.disabled = false

    if(soldi < puntata){
        double_button.disabled = true
    }

    // Blackjack naturale
    if(sommaCarte(carte_giocate_g) == 21){
        controlli_div.hidden = true
        start_dealer(true)
        return; // Esci dalla funzione per sicurezza
    }

    // --- HIT ---
    hit_button = resettaEventiHit()
    hit_button.addEventListener("click", function(){
        // 1. BLOCCO IMMEDIATO DI TUTTO
        hit_button.disabled = true
        stand_button.disabled = true
        double_button.disabled = true

        do {
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(controllaCarte(seme, numero)){
                carte_giocate_g.push([seme, numero])
                
                // Usiamo un timeout per riabilitare i bottoni solo DOPO che la carta è arrivata (es. 900ms)
                // Ma nel tuo codice usi pescaCarta che ha già animazioni.
                pescaCarta(seme, numero, "mano")

                // Aspettiamo l'animazione della carta (circa 1 secondo) prima di riattivare o finire
                setTimeout(() => {
                    if(sommaCarte(carte_giocate_g) > 21){
                        mostraPerso()
                        end_game()
                    } else {
                        // RIABILITAZIONE SICURA
                        hit_button.disabled = false
                        stand_button.disabled = false
                        if(soldi >= puntata){
                            double_button.disabled = false
                        }
                    }
                }, 1000); // 1000ms = tempo sufficiente per l'animazione

                break;
            }
        } while(true)  
    })

    // --- STAND ---
    stand_button = resettaEventiStand()
    stand_button.addEventListener("click", function(){
        // 1. BLOCCO IMMEDIATO E TOTALE
        hit_button.disabled = true
        stand_button.disabled = true
        double_button.disabled = true
        
        controlli_div.hidden = true; // Spariscono i bottoni
        start_dealer(false)
    })

    // --- DOUBLE ---
    double_button = resettaEventiDouble()
    double_button.addEventListener("click", function(){
        // 1. BLOCCO IMMEDIATO E TOTALE
        hit_button.disabled = true
        stand_button.disabled = true
        double_button.disabled = true
        
        // Non nascondiamo subito i bottoni qui, aspettiamo l'animazione o la logica
        // Ma nel tuo caso vuoi farli sparire:
        controlli_div.hidden = true; 

        soldi -= puntata
        puntata *= 2
        aggiornaSP()

        do {
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(controllaCarte(seme, numero)){
                carte_giocate_g.push([seme, numero])
                pescaCarta(seme, numero, "mano")
                
                // Aspettiamo l'animazione prima di passare al dealer o finire
                setTimeout(() => {
                    if(sommaCarte(carte_giocate_g) > 21){
                        mostraPerso()
                        end_game()
                    } else {
                        start_dealer(false)
                    }
                }, 1000);

                break;
            }
        } while(true)
    })
}


function resettaEventiHit() {
    const oldBtn = controlli_div.querySelector("button#hit");
    const newBtn = oldBtn.cloneNode(true);   // copia attributi, niente listener

    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    return newBtn;
}

function resettaEventiStand() {
    const oldBtn = controlli_div.querySelector("button#stand");
    const newBtn = oldBtn.cloneNode(true);   // copia il bottone senza eventi
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    return newBtn;
}

function resettaEventiDouble() {
    const oldBtn = controlli_div.querySelector("button#double");
    const newBtn = oldBtn.cloneNode(true);   // copia il bottone senza eventi
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    return newBtn;
}

function sommaCarte(mano){
    let somma = 0;
    let conteggioAssi = 0;

    for (const [, numero] of mano) {
        if (numero === 1) {              // Asso
            somma += 1;                  // contalo come 1
            conteggioAssi++;             // tieni traccia
        } else if (numero >= 11 && numero <= 13) {
            somma += 10;                 // J, Q, K valgono 10
        } else {
            somma += numero;             // 2–10
        }
    }

    // “Gonfia” gli assi a 11 quando conviene (aggiungi +10 per volta)
    while (conteggioAssi > 0 && somma + 10 <= 21) {
        somma += 10;
        conteggioAssi--;
    }

    return somma;
}

function controllaCarte(seme, numero){
    for(let i=0; i<carte_giocate_g.length; i++){
        if(carte_giocate_g[i][0]==seme && carte_giocate_g[i][1]==numero){
            return false
        }
    }

    for(let i=0; i<carte_giocate_b.length; i++){
        if(carte_giocate_b[i][0]==seme && carte_giocate_b[i][1]==numero){
            return false
        }
    }

    return true
}

function end_game(){

    controlli_div.hidden = true

    if(soldi >= 10){
        next_div.hidden = false
        let next_button = next_div.querySelector("button")
        next_button.addEventListener("click", function(){
            next_div.hidden = true
            puntata_div.hidden = false
            mano_div.hidden = true
            puntata = 10
            soldi -= 10

            const contGiocatore = document.getElementById("mano");
            const contBanco     = document.getElementById("carte");

            contGiocatore.innerHTML = "";
            contBanco.innerHTML = "";
            aggiornaSP()
        })
    } else {
        // DA MIGLIORARE
        alert("Game Over! Non hai più soldi.")
    }

}

function start_dealer(blackjack_g){
    mostraCartaCoperta()

    let delay = 1000

    if(sommaCarte(carte_giocate_b) < 17){
        do {
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(controllaCarte(seme, numero)){
                carte_giocate_b.push([seme, numero])
                setTimeout(() => {
                    pescaCarta(seme, numero, "carte")
                }, delay);
                delay += 1000
            }
        } while(sommaCarte(carte_giocate_b) < 17)
    }

    setTimeout(() => {
        if(blackjack_g){
            //Giocatore ha black jack
            if(sommaCarte(carte_giocate_b) == 21){
                //Pareggio
                mostraPareggio()
                soldi += puntata
                aggiornaSP()
            } else {
                //Vittoria 3:2
                mostraVinto()
                soldi += puntata + (puntata * 1.5)
                if(soldi%10 == 5)
                    soldi += 5
                aggiornaSP()
            }
        } else {
            //Nessun black jack
            if(sommaCarte(carte_giocate_b) > 21){
                //Vittoria
                mostraVinto()
                soldi += puntata * 2
                aggiornaSP()
            } else if(sommaCarte(carte_giocate_g) > sommaCarte(carte_giocate_b)){
                //Vittoria
                mostraVinto()
                soldi += puntata * 2
                aggiornaSP()
            } else if(sommaCarte(carte_giocate_g) == sommaCarte(carte_giocate_b)){
                //Pareggio
                mostraPareggio()
                soldi += puntata
                aggiornaSP()
            } else {
                mostraPerso()
            }

        }

        end_game()
    }, delay+1500);

    
}

const overlay = document.getElementById("assicurazione_overlay");

// mostra overlay
function apriAssicurazione() {
    overlay.classList.add('mostra');
}

// nascondi overlay
function chiudiAssicurazione() {
    overlay.classList.remove('mostra');
}

const msgVinto = document.getElementById("msg_vinto");
const msgPerso = document.getElementById("msg_perso");
const msgPareggio = document.getElementById("msg_pareggio");

function mostraVinto() {
    msgVinto.classList.remove("mostra"); // reset eventuale
    void msgVinto.offsetWidth;           // trucco per riavviare animazione
    msgVinto.classList.add("mostra");
}

function mostraPerso() {
    msgPerso.classList.remove("mostra");
    void msgPerso.offsetWidth;
    msgPerso.classList.add("mostra");
}

function mostraPareggio() {
    msgPareggio.classList.remove("mostra");
    void msgPareggio.offsetWidth;
    msgPareggio.classList.add("mostra");
}