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
    
    requestAnimationFrame(() => {
        // VIEWPORT + SCROLL sempre
        const mazzoRect = mazzo.getBoundingClientRect();
        const destRect = destinazione.getBoundingClientRect();
        
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        
        const zIndex = 1000 + pescateInCorso;
        
        // POSIZIONE ASSOLUTA mazzo (viewport + scroll)
        const mazzoAbsX = mazzoRect.left + scrollX;
        const mazzoAbsY = mazzoRect.top + scrollY;
        
        cartaImg.style.position = 'fixed';
        cartaImg.style.left = mazzoAbsX + 'px';
        cartaImg.style.top = mazzoAbsY + 'px';
        cartaImg.style.width = '50px';
        cartaImg.style.height = '71px';
        cartaImg.style.opacity = '0';
        cartaImg.style.zIndex = zIndex;
        cartaImg.style.transition = 'none';
        cartaImg.style.transform = `scale(0.6) rotate(-${pescateInCorso * 3}deg)`;
        
        document.body.appendChild(cartaImg);
        
        requestAnimationFrame(() => {
            // POSIZIONE ASSOLUTA destinazione
            const destAbsX = destRect.left + scrollX + (destRect.width / 2) - 25;
            const destAbsY = destRect.top + scrollY + (destRect.height / 2) - 35.5;
            
            // DELTA ESATTO (assoluto - assoluto = viewport puro)
            const deltaX = destAbsX - mazzoAbsX;
            const deltaY = destAbsY - mazzoAbsY;
            
            cartaImg.style.transition = 'all 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            cartaImg.style.opacity = '1';
            cartaImg.style.transform = `
                scale(1) 
                rotate(0deg) 
                translateX(${deltaX + pescateInCorso * 8}px) 
                translateY(${deltaY}px)
            `;
        });
        
        setTimeout(() => {
            destinazione.appendChild(cartaImg);
            // Reset pulito
            cartaImg.style.cssText = `
                position: static;
                left: auto;
                top: auto;
                width: auto;
                height: 71.28px;
                opacity: 1;
                transform: none;
                transition: none;
                zIndex: auto;
            `;
            pescateInCorso++;
        }, 950);
    });
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
    

    if(soldi < puntata){
        double_button.disabled = true
    }

    //Black Jack
    if(sommaCarte(carte_giocate_g) == 21){
        start_dealer(true)
    }

    hit_button = resettaEventiHit()

    hit_button.addEventListener("click", function(){
        hit_button.disabled = true
        stand_button.disabled = true
        double_button.disabled = true

        do {
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(controllaCarte(seme, numero)){
                carte_giocate_g.push([seme, numero])
                pescaCarta(seme, numero, "mano")

                if(sommaCarte(carte_giocate_g) > 21){
                    mostraPerso()
                    end_game()
                } else {
                    hit_button.disabled = false
                    stand_button.disabled = false
                    if(soldi >= puntata){
                        double_button.disabled = false
                    }
                }

                break;
            }
        } while(true)  
    })

    stand_button = resettaEventiStand()

    stand_button.addEventListener("click", function(){
        //Passa al banco
        start_dealer(false)
    })

    double_button = resettaEventiDouble()

    double_button.addEventListener("click", function(){
        //Raddoppia la puntata e pesca una carta sola
        soldi -= puntata
        puntata *= 2
        aggiornaSP()

        hit_button.disabled = true
        stand_button.disabled = true
        double_button.disabled = true

        do {
            let seme = Math.floor(Math.random()*4)
            let numero = Math.floor((Math.random()*13)+1)
            if(controllaCarte(seme, numero)){
                carte_giocate_g.push([seme, numero])
                pescaCarta(seme, numero, "mano")
                if(sommaCarte(carte_giocate_g) > 21){
                    mostraPerso()
                    end_game()
                } else {
                    start_dealer(false)
                }
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