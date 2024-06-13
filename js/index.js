const userAgent = navigator.userAgent || window.opera;

if (/android/i.test(userAgent)) {
    if (/mobile/i.test(userAgent)) {
        window.location.href = 'tel.html';
    } else {
        window.location.href = 'tab.html';
    }
} else if (/iPad|iPhone|iPod/i.test(userAgent) && isTouchDevice) {
    if (/iPad/i.test(userAgent)) {
        window.location.href = 'tab.html';
    } else {
        window.location.href = 'tel.html';
    }
} else if (isTouchDevice && /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) {
    // Gestisce iPad che si presentano come Mac
    window.location.href = 'tab.html';
} else {
    window.location.href = 'PCmedio.html';
}





