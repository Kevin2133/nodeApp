const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;


//Setup Cors
app.use(cors({
    origin: '*'
}));


//Setup static files
app.use(express.static(__dirname + "/public"));


//set views
app.set("views", "./views");
app.set("view engine", "ejs");


//Handling routes
app.get("/", (req, res) => {
    res.render("pages/index");
});

app.get("/posts", (req, res) => {
    res.render("pages/template");
});





app.listen(port, () => console.log(`Listening on port ${port}`));

