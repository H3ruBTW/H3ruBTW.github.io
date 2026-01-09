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
let X = 360
let Y = 520
let pixelCasella = 40
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
                case -4:
                    ctx.fillStyle = "orange"
                    ctx.fillRect((j*pixelCasella), (i*pixelCasella), pixelCasella, pixelCasella)
                    // Disegnare il palo della bandiera
                    // Disegnare il palo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+15, (i*pixelCasella)+10);
                    ctx.lineTo((j*pixelCasella)+15, (i*pixelCasella)+40);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'black';
                    ctx.stroke();

                    // Disegnare il triangolo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+15, (i*pixelCasella)+10);
                    ctx.lineTo((j*pixelCasella)+35, (i*pixelCasella)+20);
                    ctx.lineTo((j*pixelCasella)+15, (i*pixelCasella)+30);
                    ctx.closePath();
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    break

                case -3:
                    ctx.fillStyle = "green"
                    ctx.fillRect((j*pixelCasella), (i*pixelCasella), pixelCasella, pixelCasella)
                case -2:
                case -1:
                    // Disegnare il palo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+15, (i*pixelCasella)+10);
                    ctx.lineTo((j*pixelCasella)+15, (i*pixelCasella)+40);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'black';
                    ctx.stroke();

                    // Disegnare il triangolo della bandiera
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+15, (i*pixelCasella)+10);
                    ctx.lineTo((j*pixelCasella)+35, (i*pixelCasella)+20);
                    ctx.lineTo((j*pixelCasella)+15, (i*pixelCasella)+30);
                    ctx.closePath();
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    break
                
                case 0:
                case 1:
                    ctx.fillStyle = "lightgray"

                    ctx.fillRect((j*pixelCasella)+5, (i*pixelCasella)+5, 30, 30)

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
                    ctx.arc((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2), 12, 0, 2 * Math.PI);
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
                    ctx.lineTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+38);
                    ctx.stroke();
                    
                    // Spikes - left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+2, (i*pixelCasella)+(pixelCasella/2));
                    ctx.stroke();
                    
                    // Spikes - right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+38, (i*pixelCasella)+(pixelCasella/2));
                    ctx.stroke();
                    
                    // Spikes - top left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+6, (i*pixelCasella)+6);
                    ctx.stroke();
                    
                    // Spikes - top right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+34, (i*pixelCasella)+6);
                    ctx.stroke();
                    
                    // Spikes - bottom left
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+6, (i*pixelCasella)+34);
                    ctx.stroke();
                    
                    // Spikes - bottom right
                    ctx.beginPath();
                    ctx.moveTo((j*pixelCasella)+(pixelCasella/2), (i*pixelCasella)+(pixelCasella/2));
                    ctx.lineTo((j*pixelCasella)+34, (i*pixelCasella)+34);
                    ctx.stroke();
                    break
                
                case 2:
                    ctx.fillStyle="white"
                    ctx.fillRect(j*pixelCasella, i*pixelCasella, pixelCasella, pixelCasella)


                    if(bombe[i][j]!=0){
                        switch(bombe[i][j]){
                            case 1:
                                ctx.font = "30px Arial"
                                ctx.fillStyle = "blue"
                                ctx.fillText("1", (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break

                            case 2:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "green"
                                ctx.fillText("2",  (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break
                            
                            case 3:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "red"
                                ctx.fillText("3",  (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break
                            
                            case 4:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "#483D8B"
                                ctx.fillText("4",  (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break
                            
                            case 5:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "orange"
                                ctx.fillText("5",  (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break

                            case 6:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "yellow"
                                ctx.fillText("6", (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break

                            case 7:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "#4682B4"
                                ctx.fillText("7",  (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break

                            case 8:
                                ctx.font = "30px arial"
                                ctx.fillStyle = "black"
                                ctx.fillText("8", (j*pixelCasella)+11, (i*pixelCasella)+30)
                                break
                        }
                    }
                    break
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", prePartita)

let nBandiere = 25 //proporzionale al campo minato di google

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



    disegnaTabella()
}

canvas.addEventListener("touchend", touchend)

let evento

function touchend(event){
    const canvasArea = canvas.getBoundingClientRect()
    let eventX = Math.floor((event.changedTouches[0].clientX - canvasArea.left)/pixelCasella)
    let eventY = Math.floor((event.changedTouches[0].clientY - canvasArea.top)/pixelCasella)

    if(matrice[eventY][eventX]<2){
        console.log("Il touchend è avvenuto a: " + eventX + "/" + eventY);

        evento = event

        scelta.hidden = false
        scelta.style.left = (eventX*pixelCasella + canvasArea.left) + "px"
        scelta.style.top = (eventY*pixelCasella + canvasArea.top + pixelCasella) + "px"
    }

    
}

canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault(); // Previene la visualizzazione del menu contestuale
    touchend(event)
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
    canvas.removeEventListener("touchend", touchend)
    clearInterval(id)

    if(!vittoria){
        for(let i=0; i<nMaty; i++){
            for(let j=0; j<nMatx; j++){
                if(matrice[i][j]==1)
                    matrice[i][j]+=3

                if(matrice[i][j]==-2 || matrice[i][j]==-1)
                    matrice[i][j]-=2
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

/* CELLE TELEFONO */
let scelta = document.getElementById("scelta")
let c1 = document.getElementById("c1")
let c2 = document.getElementById("c2")
let c3 = document.getElementById("c3")

let ctx1 = c1.getContext('2d')
let ctx2 = c2.getContext('2d')
let ctx3 = c3.getContext('2d')

scelta.hidden = true

// Disegnare il palo della bandiera
ctx1.beginPath();
ctx1.moveTo(15, 10);
ctx1.lineTo(15, 40);
ctx1.lineWidth = 3;
ctx1.strokeStyle = 'black';
ctx1.stroke();

// Disegnare il triangolo della bandiera
ctx1.beginPath();
ctx1.moveTo(15, 10);
ctx1.lineTo(35, 20);
ctx1.lineTo(15, 30);
ctx1.closePath();
ctx1.fillStyle = 'red';
ctx1.fill();

ctx2.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
ctx2.beginPath();
ctx2.arc(20, 20, 10, 0, Math.PI * 2); // Draw a circle with radius 10 at the center (20, 20)
ctx2.fillStyle = 'rgba(0, 0, 255, 0.5)'; // Set color and transparency
ctx2.fill();
ctx2.closePath();

// Draw the cross lines
ctx2.beginPath();
ctx2.moveTo(20, 0); // Vertical line
ctx2.lineTo(20, 40);
ctx2.moveTo(0, 20); // Horizontal line
ctx2.lineTo(40, 20);
ctx2.strokeStyle = 'black';
ctx2.stroke();
ctx2.closePath();

ctx3.fillStyle = "red"
ctx3.strokeStyle = "white"

ctx3.fillRect(0, 0, 40, 40)

ctx3.lineWidth = 4

ctx3.beginPath()
ctx3.moveTo(5, 5)
ctx3.lineTo(35, 35)
ctx3.stroke()

ctx3.beginPath()
ctx3.moveTo(35, 5)
ctx3.lineTo(5, 35)
ctx3.stroke()

c1.addEventListener("touchend", function(){
    const canvasArea = canvas.getBoundingClientRect()
    let eventX = Math.floor((evento.changedTouches[0].clientX - canvasArea.left)/pixelCasella)
    let eventY = Math.floor((evento.changedTouches[0].clientY - canvasArea.top)/pixelCasella)

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
    scelta.hidden = true
    disegnaTabella()

    if(controlloDiGioco())
        fineGioco(true)

})

c2.addEventListener("touchend", function(){
    const canvasArea = canvas.getBoundingClientRect()
    let eventX = Math.floor((evento.changedTouches[0].clientX - canvasArea.left)/pixelCasella)
    let eventY = Math.floor((evento.changedTouches[0].clientY - canvasArea.top)/pixelCasella)

    if(matrice[eventY][eventX]>-1){

        matrice[eventY][eventX]+=2

        if(matrice[eventY][eventX]==3)
            fineGioco(false)

        if(bombe[eventY][eventX]==0 && matrice[eventY][eventX]==2)
            espansione0(eventY, eventX)
    } else {
        matrice[eventY][eventX]+=2
        nBandiere++
        aggiornaBandiere()
    }

    scelta.hidden = true
    disegnaTabella()

    if(controlloDiGioco())
        fineGioco(true)
})

c3.addEventListener("touchend", function(){
    scelta.hidden = true
})
