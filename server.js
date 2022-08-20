const express = require("express");
const cors = require("cors");
const { Server } = require("http");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));




app.get("/", (req, res) => {
    res.header("Content-Type", "application/json");
    res.send("Bella Elia");
    res.end();
});





app.listen(port, () => console.log(`Listeniong on port ${port}`));

