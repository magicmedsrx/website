// when updating the pdf names increment the version number in institution.html, important!
const INSTITUTION_PDF_NAME = 'MAGICFULL09.07.24.pdf';
const PATIENT_PDF_NAME = 'MAGICSHORT05.22.23.pdf';

function getCookie(cookieName) {
	const name = cookieName + '=';
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
	return '';
}

function setCookie(cookieName, cookieValue, exDays) {
	const d = new Date();
	d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
	let expires = 'Expires=' + d.toUTCString();
	document.cookie =
		cookieName +
		'=' +
		cookieValue +
		';' +
		expires +
		'; Path=/institution.html; SameSite=Strict; Secure';
}

function removeCookie() {
	document.cookie =
		'Authentication=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/institution.html; SameSite=Strict; Secure';
	location.href = '/';
}

function checkCookie(authenticated = false) {
	if (getCookie('Authentication') == 'true' || authenticated) {
		document.getElementById('userInput').setAttribute('style', 'display: none');

		if (isMobile()) {
			window.location = './pdf/institution/' + INSTITUTION_PDF_NAME + '#toolbar=0';
		} else {
			document.getElementById('iframeContainer').innerHTML =
				'<iframe id="iframe" src="./pdf/institution/' +
				INSTITUTION_PDF_NAME +
				'#toolbar=0"></iframe>';
		}

		const logOut = document.createElement('button');
		logOut.id = 'logOut';
		logOut.type = 'button';
		logOut.innerHTML = 'Log out';
		logOut.onclick = removeCookie;
		logOut.style = 'display: block';

		document.getElementById('navContainer').appendChild(logOut);
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
	const USERNAME = document.getElementById('username').value;
	const PASSWORD = document.getElementById('password').value;

	const sResult = searchArray(USERNAME, PASSWORD);
	if (sResult == true) {
		setCookie('Authentication', 'true', 29);
		checkCookie(true);
	} else if (sResult == false) {
		alert('Incorrect password');
	} else {
		alert('User does not exist');
	}
}

function isMobile() {
	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		return true;
	}

	return false;
}

function showElement(element) {
	element.style.display = 'block';
}

function hideElement(element) {
	element.style.display = 'none';
}

function setPillImgHeight() {
	const reference = document.querySelector('.guideInfoText');
	const target = document.querySelector('.pillImg');
	target.setAttribute('height', reference.offsetHeight);
	target.setAttribute('height', reference.offsetHeight);
	console.log(reference.offsetHeight);
}

function mkNavBar() {
	const navbar = document.getElementById('navContainer');

	const scope = window.location.pathname.split('/').pop().split('.')[0];

	const links = [
		{ href: '/', text: 'HOME' },
		{ href: '/about.html', text: 'ABOUT' },
		{ href: '/institution.html', text: 'INSTITUTIONS' },
		{
			href: '/pdf/viewer.html?file=' + 'patient/' + PATIENT_PDF_NAME,
			text: 'PATIENTS',
			mobile_href: './pdf/patient/' + PATIENT_PDF_NAME + '#toolbar=0',
		},

		{ href: '/register.html', text: 'REGISTER' },
		{ href: '/medicare.html', text: 'MEDICARE' },
		{ href: '/medicaid.html', text: 'MEDICAID' },
		{ href: '/va.html', text: 'VA' },

		{
			href: 'https://youtu.be/fY1GZmP2tQY',
			text: 'TRAINING',
			target: '_blank',
			scoped_to: 'institution',
		},
	];

	links.forEach((link) => {
		if (link.scoped_to && link.scoped_to !== scope) {
			return;
		}

		const a = document.createElement('a');

		if (isMobile()) {
			a.setAttribute('href', link.mobile_href);
		} else {
			a.setAttribute('href', link.href);
		}

		if (link.target) {
			a.setAttribute('target', link.target);
		}

		a.innerHTML = link.text;
		navbar.appendChild(a);
	});
}

async function loadPDF() {
	const params = new URLSearchParams(document.location.search);
	const fileName = params.get('file');
	const iframeContainer = document.getElementById('iframeContainer');

	const displayError = (message) => {
		console.error(message);
		const error = document.createElement('h1');
		error.classList.add('pdfError');
		error.innerHTML = `Error: ${message}`;
		iframeContainer.appendChild(error);
	};

	if (!fileName) {
		return displayError('No file specified.');
	}

	try {
		const response = await fetch(fileName, { method: 'HEAD' });
		if (!response.ok) {
			return displayError('Specified file does not exist.');
		}
	} catch (err) {
		return displayError(`Unknown error: ${err.message}`);
	}

	const iframe = document.createElement('iframe');
	iframe.src = `${fileName}#toolbar=0`;
	iframeContainer.appendChild(iframe);
}
