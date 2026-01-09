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