INSTITUTION_PDF_NAME = "MAGICFULL 12.10.22.pdf";

function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cookieName, cookieValue, exDays) {
    const d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + "; path=/institution.html; SameSite=Strict; Secure";
}

function removeCookie() {
    document.cookie = "Authentication=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/institution.html; SameSite=Strict; Secure";
    location.href = '/';
}

function checkCookie() {
    if (getCookie('Authentication') == 'true') {
        document.getElementById("user-input").setAttribute('style', 'display: none');
        document.getElementById("iframe").innerHTML = '<iframe id="iframe" src="./pdf/institution/' + INSTITUTION_PDF_NAME + '#toolbar=0"></iframe>';
        document.getElementById("log-out").setAttribute('style', 'display: block');
    }
}
function searchArray(username, password) {
    for (let i = 0; i < CREDENTIALS.length; i++) {
        if (CREDENTIALS[i][0] == username) {
            if (CREDENTIALS[i][1] == password) {
                return true; // user exists, correct password
            } else {
                return false; // user exists, wrong password
            }
        }
    }
    return null; // user does not exist
}

function validateCredentials() {
    const USERNAME = document.getElementById("username").value;
    const PASSWORD = document.getElementById("password").value;

    const sResult = searchArray(USERNAME, PASSWORD);
    if (sResult == true) {
        setCookie('Authentication', 'true', 29);
        checkCookie();
    } else if (sResult == false) {
        alert("Incorrect password");
    } else {
        alert("User does not exist");
    }
}

function authenticate() {
    validateCredentials();
}

checkCookie();
