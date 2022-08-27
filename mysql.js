require("dotenv").config({path: __dirname + '/.env'});
const session = require("express-session")
const mysql = require("mysql2");
const MySqlStore = require("express-mysql-session")(session);


//create conn to db

const options = {
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}; 

const pool = mysql.createPool(options);

/*functions anq queries*/

async function addUser (user, pool){
    var alreadyExists;
    const getUser = `SELECT * 
    FROM credenziali 
    WHERE credenziali.username = '${user.username}'`;
    const insertUser = `INSERT INTO credenziali VALUES ('${user.username}', '${user.password}', '${user.admin}')`;

    try{
        const [users] = await pool.promise().query(getUser);
    
        if(users.length > 0){
            alreadyExists = true;
        }else{
            alreadyExists = false;
        }
    
        if(!alreadyExists){
            pool.promise().query(insertUser);
        }
        return alreadyExists;
    }catch{
        console.log("Error has occured");
    }
}

async function getUser (user, pool){
    const getUser = `SELECT username, pswd 
    FROM credenziali 
    WHERE credenziali.username = '${user.username}'`;

    try{
        const [users] = await pool.promise().query(getUser);
    
        if(users.length > 0){
            return users[0];
        }else{
            return null;
        }
    
    }catch{
        console.log("Error has occured");
    }
}

//store sessions
const storeSessOptn = {
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
}

const sessionStore = new MySqlStore(storeSessOptn);

    


module.exports.pool = pool;
module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.sessionStore = sessionStore;



