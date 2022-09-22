
function passwordCheck(){
    var password = prompt("Please enter insitutional code here.");
    if (password==="4444"){
        window.location="magicfull.html";
        document.cookie = "authenticated=true; path=/";
    } else{
        while(password !=="4444"){
            password = prompt("That was incorrect, Please enter insitutional code again.");
        }
        window.location="magicfull.html";
    }
}
window.onload=passwordCheck;

// function credentials 
// const credentials="credentials.txt"

// function CodeCheck(){
// var code = prompt("Please enter your institutional code here:");
// 	if (code==="HHmma1973722") {
// 		window.location=magicfull.html;
// 		} else{
// 			while(code !=="HHmma1973722"){
// 				code=prompt("Please enter institutional code here:");
// 			}
// 		}
// window.onload=CodeCheck;		


// }




// var code;
// var code1 = "HHmma1973722";
// code=prompt("Please enter your institutional code here:","");
// 	if (password==HHmma1973722) {
// 		window.location= "magicfull.html";
// 	} else{
// 		window.location= "index.html"
// 	}