require("dotenv").config({path: __dirname + '/.env'});
const express = require("express");
const mysql = require("../../mysql");
const router = express.Router();
const arduino = require("../../arduino");
var five = require("johnny-five");
/*var board = new five.Board({port: "COM5"});*/

/*const board = arduino.connectBoard("COM5");*/

router.get("/", (req, res) => {  
    let led;  

    if(board.isReady){
        led = new five.Led(8);
      
        board.repl.inject({
          led
        });
    }

    if(typeof(led) !== "undefined"){
        arduino.strobe(led);
    }
    
    res.render("pages/arduino");
});


module.exports = router;