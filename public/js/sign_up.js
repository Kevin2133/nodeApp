(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*SUBMIT LOGIN FORM*/

const submitBtn = document.querySelector(".login-btn");

submitBtn.addEventListener("click", createUser);

function createUser(){
    /*controlling email and pswd*/
    const username = String(document.getElementById("username").value);
    const password = String(document.getElementById("pswd").value);
    const admin = 0;
    const url = "/sign-up";
 
    var user, pswd;

    user = checkUsername(username);
    pswd = checkPassword(password);

    addNotValid(!user, !pswd);

    if(user && pswd){        
        const data = {username, password, admin};

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
    const options = {
        method: "POST",
        redirect: "follow",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(url, options)
    .then((res) => res.json())
    .then((data) => {addAlreadyExists(data); redirect(data);});     
}

function addAlreadyExists (data){
    const exists = data.exists;
    const userItem = document.getElementById("userDiv");
    const userAE = document.getElementById("userAE");

    if(exists){
        userItem.classList.add("yellow-border");
        userAE.style.display = "inline-block";
    }else{
        userItem.classList.remove("yellow-border");
        userAE.style.display = "none"; 
    }
}

function redirect (data){
    if(data.signed){
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
