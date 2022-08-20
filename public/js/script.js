const url = "https://easycodingkevapi.herokuapp.com/";

async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    
    show(data);
}

function show(data){
    const div = document.getElementById("apiRes");
    const lnbr = document.createElement("br");
    var nome = document.createElement("p"), cognome = document.createElement("p"), livello = document.createElement("p");
    console.log(data);
    nome.innerHTML = data.name;
    div.appendChild(nome);
    //div.appendChild(lnbr);
    cognome.innerHTML = data.surname;
    div.appendChild(cognome);
    //div.appendChild(lnbr);
    livello.innerHTML = data.level;
    div.appendChild(livello);
}


window.onload = () => {
};

