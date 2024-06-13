const userAgent = navigator.userAgent || window.opera;

if (/android/i.test(userAgent)) {
    if(/mobile/.test(userAgent))
        window.location.href = 'tel.html' 
    else
        window.location.href = "tab.html"
} else if(/iPhone|iPad/.test(userAgent) && !window.MSStream){
    if(/iPad/.test(userAgent))
        window.location.href = "tab.html"
    else
        window.location.href = 'tel.html'
} else {
    window.location.href = 'PCmedio.html'
}





