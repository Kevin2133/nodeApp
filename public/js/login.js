(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*SUBMIT LOGIN FORM*/
const submitBtn = document.querySelector(".login-btn");

submitBtn.addEventListener("click", controlUser);

function controlUser(){
    /*controlling email and pswd*/
    const username = String(document.getElementById("username").value);
    const password = String(document.getElementById("pswd").value);
    const url = "/login";
 
    var user, pswd;

    user = checkUsername(username);
    pswd = checkPassword(password);

    addNotValid(!user, !pswd);

    if(user && pswd){
        const data = {username, password};

        /*sending post req to server*/
        
        post(data, url);
    }   

}

function addNotValid(username, password){
    const userItem = document.getElementById("userDiv");
    const pswdItem = document.getElementById("pswdDiv");
    const userNT = document.getElementById("userNT");
    const pswdNT = document.getElementById("pswdNT");


    if(username){
        userItem.classList.add("red-border");
        userNT.style.display = "inline-block";
    }else{
        userItem.classList.remove("red-border");
        userNT.style.display = "none";        
    }

    if(password){
        pswdItem.classList.add("red-border");
        pswdNT.style.display = "inline-block";
    }else{
        pswdItem.classList.remove("red-border");
        pswdNT.style.display = "none";
    }  
}

function checkUsername (username){
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(username.match(validRegex)){
        return true;
    }

    return false;
}

function checkPassword (password){
    if((password.length >= 8) && (password.length <= 50)){
        return true;
    }
    return false;
}

function post(data, url){
    /*more of a get req that post req*/
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(url, options)
    .then((res) => res.json())
    .then((data) => {showErrors(data); redirect(data);}); 
    /*getting res if account exists and then show errors otherwise login*/      
}

function showErrors(data){
    const login = data.login;
    const exists = data.exists;
    
    const userDiv = document.getElementById("userDiv");
    const pswdDiv = document.getElementById("pswdDiv");
    const userNE = document.getElementById("userNE");
    const pswdErr = document.getElementById("pswdErr");

    if(!exists){
        userDiv.classList.add("red-border");
        userNE.style.display = "inline-block";
    }else{
        userDiv.classList.remove("red-border");
        userNE.style.display = "none";
        if(!login){
            pswdDiv.classList.add("red-border");
            pswdErr.style.display = "inline-block";
        }else{
            pswdDiv.classList.remove("red-border");
            pswdErr.style.display = "none"; 

            userDiv.classList.add("green-border");
            pswdDiv.classList.add("green-border");

            
        }
    }
}

function redirect(data){
    if(data.login){
        location.href = data.redirect_path;
    }
}

/*SUBMIT STYLE*/
const userItem = document.getElementById("userDiv");
const pswdItem = document.getElementById("pswdDiv");
const userInput = document.getElementById("username");
const pswdInput = document.getElementById("pswd");

userInput.addEventListener("click", () => {
    userItem.classList.add("visited");
});

pswdInput.addEventListener("click", () => {
    pswdItem.classList.add("visited");
});


},{}]},{},[1]);
