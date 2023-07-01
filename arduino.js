const five = require("johnny-five");

function connectBoard(port){
     const board = new five.Board({
        port: "COM5"
    });    

    return board;
}


function turnLedOn(led){
    led.on();
}

function turnLedOff(led){
    led.off();
}

function strobe(led){
    led.strobe();
}

function stopStrobe(led){
    led.stop().off();
}

module.exports.turnLedOn = turnLedOn;
module.exports.turnLedOff = turnLedOff;
//module.exports.createLed = createLed;
module.exports.connectBoard = connectBoard;
module.exports.strobe = strobe;
module.exports.stopStrobe = stopStrobe;