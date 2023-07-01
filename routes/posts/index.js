require("dotenv").config({path: __dirname + '/.env'});
const express = require("express");
const mysql = require("../../mysql");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
    destination: `${__dirname}/../../public/img/uploads`,   
    filename: (req, file, cb) => {
        const filename = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    } 
});

const uploadImg = multer({storage}).array("images[]");



router.get("/", async (req, res) => {  
    const posts = await mysql.getPosts();
    const immagini = await mysql.getImmagini();     

    res.render("pages/post", {btn_path: req.session.btn_path, posts: posts, admin: req.session.isAdmin, immagini: immagini});
});

router.post("/", async (req, res) => {
    try{
        const post = {
            titolo: req.body.titolo,
            descrizione: req.body.descrizione
        }

        console.log(post.titolo);

        const id = await mysql.addPost(post);

        res.status(200);
        res.json({
            postAdded: true,
            id: id,
        });
        res.end();
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({
            postAdded: false
        });
        res.end();
    }
});

router.get("/:id", async (req, res) => {
    const nlRe = /\n/g;
    var  post = await mysql.getPostById(req.params.id);   
    post.descrizione = post.descrizione.replaceAll(nlRe, "<br>")
    res.render("pages/full-post", {btn_path: req.session.btn_path, post: post});
});

router.post("/images", async (req, res) => {
    uploadImg(req,res, async function(err) {
        //console.log(req.body);
        const immagini = req.files;
        if(err) {
            res.status(500);
            return res.end();
        }
        /*Upload filename to db*/
        try{
            for(var i = 0; i < immagini.length; i++){
                await mysql.addImage(immagini[0]);
            }            
            
        }catch(err){
            console.log(err);
        }
        res.status(200);
        res.end();
    });
});

router.post("/post-images", async (req, res) => {
    try{
        const images = req.body;
        
        await mysql.attachImages(images);

        res.status(200);
        res.json({
            imagesAttached: true, 
            redirect_path: "/posts",           
        });
        res.end();
    }catch(err){
        console.log(err);
        res.status(500);
        res.json({
            imagesAttached: false,
            redirect_path: "/posts",
        });
        res.end();
    }
});


module.exports = router;