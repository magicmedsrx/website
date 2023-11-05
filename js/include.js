// when updating the pdf names increment the version number in institution.html, important!
const INSTITUTION_PDF_NAME = "MAGICFULL11.05.23.pdf";
const PATIENT_PDF_NAME = "MAGICSHORT05.22.23.pdf";

let IS_MOBILE = false;

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
    let expires = "Expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + "; Path=/institution.html; SameSite=Strict; Secure";
}


function removeCookie() {
    document.cookie = "Authentication=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/institution.html; SameSite=Strict; Secure";
    location.href = '/';
}


function checkCookie(authenticated=false) {
    if (getCookie('Authentication') == 'true' || authenticated) {
        document.getElementById("userInput").setAttribute('style', 'display: none');

        if (IS_MOBILE) {
            window.location = "./pdf/institution/" + INSTITUTION_PDF_NAME + "#toolbar=0";
        } else {
            document.getElementById("iframeContainer").innerHTML = '<iframe id="iframe" src="./pdf/institution/' + INSTITUTION_PDF_NAME + '#toolbar=0"></iframe>';
        }

        document.getElementById("logOut").setAttribute('style', 'display: block');
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
        checkCookie(true);
    } else if (sResult == false) {
        alert("Incorrect password");
    } else {
        alert("User does not exist");
    }
}


function checkMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        IS_MOBILE = true;

        let mobileElement = document.getElementById("mobilePDF");
        mobileElement.innerHTML = '<a href="./pdf/patient/' + PATIENT_PDF_NAME + '#toolbar=0">PATIENTS</a>';
    }
}


function showElement(element) {
    element.style.display = "block";
}


function hideElement(element) {
    element.style.display = "none";
}

function setPillImgHeight() {
    const reference = document.querySelector('.guideInfoText');
    const  target = document.querySelector('.pillImg');
    target.setAttribute('height', reference.offsetHeight);
    target.setAttribute('height', reference.offsetHeight);
    console.log(reference.offsetHeight);
}
