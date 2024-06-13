/*const userAgent = navigator.userAgent || window.opera;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const platform = navigator.platform;
const maxTouchPoints = navigator.maxTouchPoints || 0;

console.log("User Agent: ", userAgent);
console.log("Platform: ", platform);
console.log("Max Touch Points: ", maxTouchPoints);

if (/android/i.test(userAgent)) {
    if (/mobile/i.test(userAgent)) {
        console.log("Redirecting to tel.html");
        window.location.href = 'tel.html';
    } else {
        console.log("Redirecting to tab.html");
        window.location.href = 'tab.html';
    }
} else if (/iPhone|iPad|iPod/i.test(userAgent) && isTouchDevice) {
    if (/iPad/i.test(userAgent)) {
        console.log("Redirecting to tab.html");
        window.location.href = 'tab.html';
    } else {
        console.log("Redirecting to tel.html");
        window.location.href = 'tel.html';
    }
} else if (isTouchDevice && /Macintosh/i.test(userAgent) && maxTouchPoints > 1) {
    // Gestisce iPad che si presentano come Mac (iPadOS 13 e successivi)
    console.log("Redirecting to tab.html (iPad detected as Mac)");
    window.location.href = 'tab.html';
} else {
    console.log("Redirecting to PCmedio.html");
    window.location.href = 'PCmedio.html';
}*/

/* FUNZIONI DI device.js */
if(device.mobile()){
    window.location.href = 'tel.html';
}

if(device.tablet()){
    window.location.href = 'tab.html';
}

if(device.desktop()){
    window.location.href = 'PCmedio.html';
}