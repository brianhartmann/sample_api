const AWS = require('aws-sdk');
const config = require('../config.js');
const bodyParser = require('body-parser')

var express = require("express");
var app = express();
app.listen(3000, () => {
 console.log("Server running on port 3000");
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

   app.get("/health", (req, res, next) => {
    res.status(200).send("App is live");
   });

   app.get('/person/:name', (req, res, next) => {
    var ddb = new AWS.DynamoDB(config.aws_remote_config);
    var params = {
        TableName: config.aws_table_name,
        "Key": {
            'username': {'S': req.params.name}
        }
    };
    console.log(params)
    ddb.getItem(params, function(err, data) {
        if (err) {
            res.status.status(400).json(err);
        } else {
            let item = data.Item;
            let weight = item.weight.N
            let name = item.username.S
            res.status(200).send(`Your username is: ${name} and your weight is: ${weight}`);
        }
    })
   });

app.post("/newperson", (req, res, next) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const Item = {...req.body}
    var params = {
        TableName: config.aws_table_name,
        Item: Item
    };

    // Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
        if (err) {
            res.status(400).send({
                success: false,
                message: err
            });
        } else {
            res.status(201).send({
                success: true,
                message: 'Added person',
            });
        }
    });

});

app.get("/*", (req, res, next) => {
    res.status(404).send("Oops. This link does not exist");
   });

module.exports = app