const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

document.addEventListener("DOMContentLoaded", disegnaTabella)

function disegnaTabella(){

    ctx.fillStyle = "white"

    ctx.fillRect(0, 0, X, Y)

    disegnaCella()

    ctx.lineWidth=2

    ctx.strokeStyle = "black"

    for(let i=pixelCasella; i<Y; i+=pixelCasella){
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(X, i)
        ctx.stroke()
        ctx.closePath()
    }

    for(let i=pixelCasella; i<X; i+=pixelCasella){
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, Y)
        ctx.stroke()
        ctx.closePath()
    }
}

// INIZIALIZZAZIONE DI TUTTE LE VARIABILI UTILI PER DIMENSIONI, ECC.
let X = canvas.getAttribute("width")
let Y = canvas.getAttribute("height")
let pixelCasella = 30
let nMatx = X/pixelCasella
let nMaty = Y/pixelCasella
let matrice = new Array()
let bombe = new Array()

for(let i=0; i<nMaty; i++){

    matrice[i] = new Array(nMatx)

    for(let j=0; j<nMatx; j++){
        matrice[i][j]=0
    }

    bombe[i] = new Array(nMatx)

    for(let j=0; j<nMatx; j++){
        bombe[i][j]=0
    }
}

function disegnaCella(){
    for(let i=0; i<nMaty; i++){
        for(let j=0; j<nMatx; j++){
            switch(matrice[i][j]){
                case -2:
                case -1:
                    // Disegnare il palo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+7, (i*pixelCasella)+5);
                    ctx.lineTo((j*pixelCasella)+7, (i*pixelCasella)+25);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'black';
                    ctx.stroke();

                    // Disegnare il triangolo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+7, (i*pixelCasella)+5);
                    ctx.lineTo((j*pixelCasella)+20, (i*pixelCasella)+10);
                    ctx.lineTo((j*pixelCasella)+7, (i*pixelCasella)+15);
                    ctx.closePath();
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    break
                
                case 0:
                case 1:
                    ctx.fillStyle = "lightgray"

                    ctx.fillRect((j*pixelCasella)+5, (i*pixelCasella)+5, 20, 20)

                    ctx.lineWidth=4

                    ctx.strokeStyle = "#d3d3d3"
                    
                    ctx.beginPath()
                    ctx.moveTo((j*pixelCasella), (i*pixelCasella))
                    ctx.lineTo((j*pixelCasella)+pixelCasella, (i*pixelCasella)+pixelCasella)
                    ctx.stroke()
                    ctx.closePath()

                    ctx.beginPath()
                    ctx.moveTo((j*pixelCasella)+pixelCasella, (i*pixelCasella))
                    ctx.lineTo((j*pixelCasella), (i*pixelCasella)+pixelCasella)
                    ctx.stroke()
                    ctx.closePath()
                    break

                case 3:
                    ctx.fillStyle = "red"
                    ctx.fillRect((j*pixelCasella), (i*pixelCasella), pixelCasella, pixelCasella)
                case 4:
                    // Disegnare il corpo della bomba
                    ctx.beginPath();
                    ctx.arc((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2), 8, 0, 2 * Math.PI);
                    ctx.fillStyle = 'black';
                    ctx.fill();

                    // Disegnare i "spikes" della bomba
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    
                    // Spikes - top
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+2);
                    ctx.stroke();
                    
                    // Spikes - bottom
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+28);
                    ctx.stroke();
                    
                    // Spikes - left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+2, (i*pixelCasella)+(pixelCasella/2));
                    ctx.stroke();
                    
                    // Spikes - right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+28, (i*pixelCasella)+(pixelCasella/2));
                    ctx.stroke();
                    
                    // Spikes - top left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+6, (i*pixelCasella)+6);
                    ctx.stroke();
                    
                    // Spikes - top right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+24, (i*pixelCasella)+6);
                    ctx.stroke();
                    
                    // Spikes - bottom left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+6, (i*pixelCasella)+24);
                    ctx.stroke();
                    
                    // Spikes - bottom right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+24, (i*pixelCasella)+24);
                    ctx.stroke();
                    break
                
                case 2:
                    ctx.fillStyle="white"
                    ctx.fillRect(j*pixelCasella, i*pixelCasella, pixelCasella, pixelCasella)


                    if(bombe[i][j]!=0){
                        switch(bombe[i][j]){
                            case 1:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "blue"
                                ctx.fillText("1", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break

                            case 2:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "green"
                                ctx.fillText("2", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break
                            
                            case 3:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "red"
                                ctx.fillText("3", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break
                            
                            case 4:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "#483D8B"
                                ctx.fillText("4", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break
                            
                            case 5:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "orange"
                                ctx.fillText("5", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break

                            case 6:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "yellow"
                                ctx.fillText("6", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break

                            case 7:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "#4682B4"
                                ctx.fillText("7", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break

                            case 8:
                                ctx.font = "20px Arial"
                                ctx.fillStyle = "black"
                                ctx.fillText("8", (j*pixelCasella)+9, (i*pixelCasella)+22)
                                break
                        }
                    }
                    break
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", prePartita)

let nBandiere = 104 //proporzionale al campo minato di google

function prePartita(){
    for(let i=0; i<nBandiere; i++){

        let num = Math.floor(Math.random()*nMaty)
        let num2 = Math.floor(Math.random()*nMatx)

        if(matrice[num][num2]!=1)
        {
            matrice[num][num2]=1
        }
        else
        {
            i--
        }
    }

    console.log(matrice);

    for(let i=0; i<nMaty; i++){
        for(let j=0; j<nMatx; j++){
            if(matrice[i][j]==1)
            {
                continue
            }

            //Cella alto-sinistra
            try {
                if(matrice[i-1][j-1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella alto
            try {
                if(matrice[i-1][j]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella alto-destra
            try {
                if(matrice[i-1][j+1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella sinistra
            try {
                if(matrice[i][j-1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella destra
            try {
                if(matrice[i][j+1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella basso-sinistra
            try {
                if(matrice[i+1][j-1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella basso
            try {
                if(matrice[i+1][j]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}

            //Cella basso-destra
            try {
                if(matrice[i+1][j+1]==1){
                    bombe[i][j]++
                }
                
            } catch (error) {}
        }
    }

    console.log(bombe);

    disegnaTabella()
}

canvas.addEventListener("click", click)

function click(event){
    const canvasArea = canvas.getBoundingClientRect()
    let eventX = Math.floor((event.clientX - canvasArea.left)/pixelCasella)
    let eventY = Math.floor((event.clientY - canvasArea.top)/pixelCasella)

    console.log("Il click è avvenuto a: " + eventX + "/" + eventY);

    if(matrice[eventY][eventX]<2){
        if(event.button === 0 && matrice[eventY][eventX]>-1){
            //click sinistro
            matrice[eventY][eventX]+=2
            console.log("Sinistro");

            if(matrice[eventY][eventX]==3)
                fineGioco(false)

            if(bombe[eventY][eventX]==0 && matrice[eventY][eventX]==2)
                espansione0(eventY, eventX)

        } else if(event.button === 2){
            //click destro
            if(matrice[eventY][eventX]>=0){
                if(nBandiere>0){
                    matrice[eventY][eventX]-=2
                    nBandiere--
                    aggiornaBandiere()
                }
            } else {
                matrice[eventY][eventX]+=2
                nBandiere++
                aggiornaBandiere()
            }
            console.log("destro");

        }
    }

    disegnaTabella()

    if(controlloDiGioco())
        fineGioco(true)
}

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault(); // Previene la visualizzazione del menu contestuale
    click(event)
})


/* AGGIORNA STATISTICHE */
let s = 0
let temp = document.getElementById("out1")
temp.value = s

const id = setInterval(() => {
    s++
    temp.value = s
}, 1000)

let band = document.getElementById("out2")
band.value = nBandiere

function aggiornaBandiere(){
    band.value = nBandiere
}


/* FINE GIOCO */
let body = document.getElementById("body")
let vitt = document.getElementById("fineV")
let scon = document.getElementById("fineS")
vitt.hidden = true
scon.hidden = true

function fineGioco(vittoria){
    canvas.removeEventListener("click", click)
    clearInterval(id)

    if(!vittoria){
        for(let i=0; i<nMaty; i++){
            for(let j=0; j<nMatx; j++){
                if(matrice[i][j]==1)
                    matrice[i][j]+=3
            }
        }
        disegnaTabella()
    }

    setTimeout(function (){
        
        body.setAttribute("class", "sfocato")

        if(vittoria){
            vitt.hidden = false
        } else {
            scon.hidden = false
        }
    }, 3000)
}

function controlloDiGioco(){
    for(let i=0; i<nMaty; i++){
        for(let j=0; j<nMatx; j++){
            if(matrice[i][j]==0 || matrice[i][j]==1)
                return false
        }
    }

    return true
}

//FUNZIONE CHE QUANDO VIENE USATA ESPANDE IL TERRITORIO DEGLI SPAZI SENZA BOMBE
function espansione0(i, j){

    //Cella alto-sinistra
    try {
        if(matrice[i-1][j-1]==0){

            matrice[i-1][j-1]+=2
            disegnaTabella()

            if(bombe[i-1][j-1]==0){
                espansione0(i-1, j-1)
            }
        }

        if(matrice[i-1][j-1]==-2){

            matrice[i-1][j-1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i-1][j-1]==0){
                espansione0(i-1, j-1)
            }
        }
        
    } catch (error) {}

    //Cella alto
    try {
        if(matrice[i-1][j]==0){

            matrice[i-1][j]+=2
            disegnaTabella()

            if(bombe[i-1][j]==0){
                espansione0(i-1, j)
            }
        }

        if(matrice[i-1][j]==-2){

            matrice[i-1][j]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i-1][j]==0){
                espansione0(i-1, j)
            }
        }
        
    } catch (error) {}

    //Cella alto-destra
    try {
        if(matrice[i-1][j+1]==0){

            matrice[i-1][j+1]+=2
            disegnaTabella()

            if(bombe[i-1][j+1]==0){
                espansione0(i-1, j+1)
            }
        }

        if(matrice[i-1][j+1]==-2){

            matrice[i-1][j+1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i-1][j+1]==0){
                espansione0(i-1, j+1)
            }
        }
        
    } catch (error) {}

    //Cella sinistra
    try {
        if(matrice[i][j-1]==0){

            matrice[i][j-1]+=2
            disegnaTabella()

            if(bombe[i][j-1]==0){
                espansione0(i, j-1)
            }
        }

        if(matrice[i][j-1]==-2){

            matrice[i][j-1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i][j-1]==0){
                espansione0(i, j-1)
            }
        }
        
    } catch (error) {}

    //Cella destra
    try {
        if(matrice[i][j+1]==0){

            matrice[i][j+1]+=2
            disegnaTabella()

            if(bombe[i][j+1]==0){
                espansione0(i, j+1)
            }
        }

        if(matrice[i][j+1]==-2){

            matrice[i][j+1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i][j+1]==0){
                espansione0(i, j+1)
            }
        }
        
    } catch (error) {}

    //Cella basso-sinistra
    try {
        if(matrice[i+1][j-1]==0){

            matrice[i+1][j-1]+=2
            disegnaTabella()

            if(bombe[i+1][j-1]==0){
                espansione0(i+1, j-1)
            }
        }

        if(matrice[i+1][j-1]==-2){

            matrice[i+1][j-1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i+1][j-1]==0){
                espansione0(i+1, j-1)
            }
        }
        
    } catch (error) {}

    //Cella basso
    try {
        if(matrice[i+1][j]==0){

            matrice[i+1][j]+=2
            disegnaTabella()

            if(bombe[i+1][j]==0){
                espansione0(i+1, j)
            }
        }

        if(matrice[i+1][j]==-2){

            matrice[i+1][j]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i+1][j]==0){
                espansione0(i+1, j)
            }
        }
        
    } catch (error) {}

    //Cella basso-destra
    try {
        if(matrice[i+1][j+1]==0){

            matrice[i+1][j+1]+=2
            disegnaTabella()

            if(bombe[i+1][j+1]==0){
                espansione0(i+1, j+1)
            }
        }

        if(matrice[i+1][j+1]==-2){

            matrice[i+1][j+1]+=4
            disegnaTabella()

            nBandiere++
            aggiornaBandiere()

            if(bombe[i+1][j+1]==0){
                espansione0(i+1, j+1)
            }
        }
        
    } catch (error) {}
}

// DIFFICOLTà
let attivo = false
let scel = document.getElementById("scel")
let diff = document.getElementById("diff")
diff.hidden = true

scel.addEventListener("click", function(){
    if(attivo){
        diff.hidden = true
        attivo = false
    } else {
        diff.hidden = false
        attivo = true
    }
})