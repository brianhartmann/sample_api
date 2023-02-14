var express = require("express");
var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

   app.get("/health", (req, res, next) => {
    res.status(200).send("App is live");
   });

   app.get("/person/brian", (req, res, next) => {
    res.json({
        "Name": "Brian",
        "Height": "5'10",
        "Weight": 160
    })
});

module.exports = app