/*SUBMIT LOGIN FORM*/

const submitBtn = document.querySelector(".login-btn");

submitBtn.addEventListener("click", createUser);

function createUser(){
    /*controlling email and pswd*/
    const username = String(document.getElementById("username").value);
    const password = String(document.getElementById("pswd").value);
    const controlPassword = String(document.getElementById("pswdControl").value);

    const admin = 0;
    const url = "/sign-up";
 
    var user, pswd;

    user = checkUsername(username);
    pswd = checkPassword(password);
    controlPswd =  checkControlPassword(password, controlPassword);

    addNotValid(!user, !pswd, !controlPswd);

    if(user && pswd && controlPswd){        
        const data = {username, password, admin};

        /*sending post req to server*/
        
        post(data, url);
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

function addNotValid(username, password, controlPswd){
    const userItem = document.getElementById("userDiv");
    const pswdItem = document.getElementById("pswdDiv");
    const userNT = document.getElementById("userNT");
    const pswdNT = document.getElementById("pswdNT");
    const pswdControlItem = document.getElementById("pswdControlDiv");
    const pswdControlNC = document.getElementById("pswdNC");


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
    
    if(controlPswd){
        pswdControlItem.classList.add("red-border");
        pswdControlNC.style.display = "inline-block";
    }else{
        pswdControlItem.classList.remove("red-border");
        pswdControlNC.style.display = "none"; 
    }
}

function checkControlPassword (password, controlPassword){
    return password === controlPassword;
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

function redirect (data){
    if(data.signed){
        location.href = data.redirect_path;
    }
}