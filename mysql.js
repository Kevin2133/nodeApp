require("dotenv").config({path: __dirname + '/.env'});
const session = require("express-session")
const mysql = require("mysql2");
const MySqlStore = require("express-mysql-session")(session);


//create conn to db

function getPool(){
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
    return pool;
}



/*functions anq queries*/

async function addUser (user){
    const pool = getPool();
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
            await pool.promise().query(insertUser);
        }

        pool.end();
        return alreadyExists;
    }catch(err){
        console.log("Error has occured addUser" + err);
    }
}

async function getUser (user){
    const pool = getPool();
    const getUser = `SELECT username, pswd, admin
    FROM credenziali 
    WHERE credenziali.username = '${user.username}'`;

    try{
        const [users] = await pool.promise().query(getUser);

        pool.end();    
        if(users.length > 0){
            return users[0];
        }else{
            return null;
        }
    
    }catch{
        console.log("Error has occured");
    }
}

async function getPosts (){
    const pool = getPool();
    const getPosts = "SELECT * FROM post ORDER BY post.id DESC"
    const getImg = "SELECT postId, imgId, main, nome FROM post_immagini, immagini WHERE post_immagini.imgId = immagini.id ORDER BY postId DESC, main ASC";    

    try{
        var [posts] = await pool.promise().query(getPosts);
        var [images] = await pool.promise().query(getImg); 
        var postImages;

        pool.end();   
        
        for(var post of posts){
            postImages = [];
            for(var img of images){
                if(img.postId === post.id){
                    postImages.push(img);
                }
            }
            post.images = postImages;
        }
        
        return posts;
    }catch(err){
        console.log("Error has occured getPosts" + err);
    }
}

async function getPostById (id){
    const pool = getPool();

    const getPosts = `SELECT * FROM post WHERE post.id = ${id} ORDER BY post.id DESC`
    const getImg = `SELECT postId, imgId, main, nome FROM post_immagini, immagini WHERE post_immagini.imgId = immagini.id AND post_immagini.postId = ${id} ORDER BY postId DESC, main ASC`;    

    try{
        var [posts] = await pool.promise().query(getPosts);
        var [images] = await pool.promise().query(getImg); 
        var postImages;   
        
        pool.end();
         
        
        for(var post of posts){
            postImages = [];
            for(var img of images){
                if(img.postId === post.id){
                    postImages.push(img);
                }
            }
            post.images = postImages;
        }

        
        return posts[0];
    }catch(err){
        console.log("Error has occured:" + err);
    }
}

async function getUser (user){
    const pool = getPool();
    const getUser = `SELECT username, pswd, admin
    FROM credenziali 
    WHERE credenziali.username = '${user.username}'`;

    try{
        const [users] = await pool.promise().query(getUser);

        pool.end();    
        if(users.length > 0){
            return users[0];
        }else{
            return null;
        }
    
    }catch(err){
        console.log("Error has occured getPostById" + err);
    }
}

async function getImmagini(){
    const pool = getPool();
    const getImg = "SELECT * FROM immagini;"

    try{
        var [immagini] = await pool.promise().query(getImg); 
        
        
        return immagini;
    }catch(err){
        console.log("Error has occured:" + err);
    }
}

async function addImage (immagine){
    const pool = getPool();    
    const insertImmagine = `INSERT INTO immagini(nome) VALUES ('${immagine.filename}')`;

    try{          
        await pool.promise().query(insertImmagine);

        pool.end();
    }catch(err){
        console.log("Error has occured getImmagini" + err);
    }
}

async function addPost (post){
    const pool = getPool();
    
    const insertPost = `INSERT INTO post(titolo, descrizione, data) VALUES ('${post.titolo}', '${post.descrizione}', NOW())`;
    const getPostId = `SELECT id FROM POST WHERE descrizione = '${post.descrizione}';`

    try{    
        await pool.promise().query(insertPost);

        [id] = await pool.promise().query(getPostId);

        pool.end();

        return id[0].id;
    }catch(err){
        console.log("Error has occured addPost" + err);
    }


}

async function attachImages (images){
    const pool = getPool();

    for(var i = 0; i < images.length; i++){
        var attachImage = `INSERT INTO post_immagini VALUES ('${images[i].postId}', '${images[i].imgId}', '${images[i].main}')`;

        try{    
            await pool.promise().query(attachImage);


        }catch(err){
            console.log("Error has occured attachImages " + err);
        }
    }

    pool.end();
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

    


module.exports.addUser = addUser;
module.exports.getUser = getUser;
module.exports.sessionStore = sessionStore;
module.exports.getPosts = getPosts;
module.exports.getPostById = getPostById;
module.exports.addImage = addImage;
module.exports.addPost = addPost;
module.exports.attachImages = attachImages;
module.exports.getImmagini = getImmagini;



