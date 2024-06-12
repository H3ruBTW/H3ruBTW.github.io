const userAgent = navigator.userAgent || window.opera;

if (/android/i.test(userAgent) || (/iPhone/.test(userAgent) && !window.MSStream)) {
    window.location.href = 'tel.html' 
} else {
    window.location.href = 'PCmedio.html'
}
