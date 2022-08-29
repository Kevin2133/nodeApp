require("dotenv").config({path: __dirname + '/.env'});
const express = require("express");
const session = require("express-session");
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const cors = require("cors");
const mysql = require("./mysql");
const app = express();
const port = process.env.PORT || 3000;

const users = [];

//Setup Cors
//app.use(cors({
//    origin: '*'
//}));


//setup json
app.use(express.json({limit: "2mb"}));


//Setup static files
app.use(express.static(__dirname + "/public"));

//setup session
app.use(session({
    secret: process.env.SESS_SECRET,
    store: mysql.sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*2
    }
}));

//setup middleware to check if logged
const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else{
        res.redirect("/login");
    }
};


//set views
app.set("views", "./views");
app.set("view engine", "ejs");


//Handling routes

/*EJS Pages*/
app.get("/", (req, res) => {
    var btn_path = "./login-btn";
    if(req.session.isAuth){
        btn_path = "./logout-btn";
    }
    res.render("pages/index", {btn_path: btn_path});
});

app.get("/posts", (req, res) => {
    res.render("pages/post");
});

app.get("/sign-up", (req, res) => {
    res.render("pages/sign_up");
});

app.get("/login", (req, res) => {
    res.render("pages/login");
});

/*backend services*/

app.post("/sign-up", async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);        

        const user = {
            username: username, 
            password: hashedPassword, 
            admin: 0
        };

        const pool = mysql.pool;
        
        const alreadyExists = await mysql.addUser(user, pool);

        if(alreadyExists){
            res.status(409);            
        }else{
            res.status(200);
        }

        res.json({
            exists: alreadyExists,
            signed: !alreadyExists,
            redirect_path: "/login"
        });        
        res.end();            

    }catch{
        res.status(500).end();
    }  
});

app.post("/login", async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const user = {
            username: username,
            password: password
        }

        const pool = mysql.pool;

        const dbUser = await mysql.getUser(user, pool);

        var exists = false, login = false;

        if(!(dbUser === null)){
            exists = true;
            login = await bcrypt.compare(password, dbUser.pswd);
            
            if(login){
                req.session.isAuth = true;              
            }
            
            res.status(200);            
        }else{            
            res.status(404);
        }

        res.json({
            exists: exists,                
            login: login,
            redirect_path: "/"              
        });
        res.end();
    }catch{
        res.status(500);
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;        
    });

    res.json({
        redirect_path: "/"
    });
})

app.get("/logged", isAuth, (req, res) => {
    res.write("Looks like you are logged in!");
    res.end();
})




app.listen(port, () => console.log(`Listening on port ${port}`));



