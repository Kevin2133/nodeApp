require("dotenv").config({path: __dirname + '/.env'});
const express = require("express");
const session = require("express-session");
//const cors = require("cors");
const mysql = require("./mysql");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes/index");


//Setup Cors
//app.use(cors({
//    origin: '*'
//}));


//setup json
app.use(express.json({limit: "2mb"}));


//Setup static files
app.use(express.static(__dirname + "/public"));
app.use("/posts", express.static(__dirname + "/public"));


//setup session
app.use(session({
    secret: process.env.SESS_SECRET,
    store: mysql.sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 1000*60*60*5
    }
}));

//Middleware ti check if logged
const isAuth = (req, res, next) => {
    var btn_path = "./login-btn";
    if(req.session.isAuth){
        btn_path = "./logout-btn";
    }
    req.session.btn_path = btn_path;
    next()
}

app.use(isAuth);


//set views
app.set("views", "./views");
app.set("view engine", "ejs");


app.use("/", router); 
/* uses / because it is the main router*/


app.listen(port, () => console.log(`Listening on port ${port}`));



