require("dotenv").config({path: __dirname + '/.env'});
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const cors = require("cors");
const mysql = require("../mysql");
const express = require("express");
//const arduino = require("../arduino");

const router = express.Router();



const postsRouter = require("./posts/index");
router.use("/posts", postsRouter);

/*const arduinoRouter = require("./arduino/index");
router.use("/arduino", arduinoRouter);*/



//setup middleware to check if admin 
const isAdmin = (req, res, next) => {
    if(req.session.isAdmin){
        next();
    }else{
        res.redirect("/");
    }
};

/*EJS Pages*/
router.get("/", (req, res) => {  
    //arduino.turnLedOff();
    res.render("pages/index", {btn_path: req.session.btn_path});
});

router.get("/sign-up", (req, res) => {
    res.render("pages/sign_up");
});

router.get("/login", (req, res) => {
    res.render("pages/login");
});

router.get("/admin", isAdmin, (req, res) => {
    res.write("Looks like you are the boss here!");
    res.end();
})


/*backend services*/

router.post("/sign-up", async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);        

        const user = {
            username: username, 
            password: hashedPassword, 
            admin: 0
        };
        
        const alreadyExists = await mysql.addUser(user);

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

router.post("/login", async (req, res) => {
    try{
        var redirect_path = "/"
        const username = req.body.username;
        const password = req.body.password;
        const user = {
            username: username,
            password: password
        }


        const dbUser = await mysql.getUser(user);

        var exists = false, login = false;

        if(!(dbUser === null)){
            exists = true;
            login = await bcrypt.compare(password, dbUser.pswd);
            
            if(login){
                req.session.isAuth = true;              
            }

            if(dbUser.admin === 1){
                req.session.isAdmin = true;
            }
            
            res.status(200);            
        }else{            
            res.status(404);
        }

        res.json({
            exists: exists,                
            login: login,
            redirect_path: redirect_path              
        });
        res.end();
    }catch{
        res.status(500);
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;        
    });

    res.json({
        redirect_path: "/"
    });
});


module.exports = router;