//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    let data = {
        "Name": firstName + " " + lastName,
        "Email": email 
    };

    // console.log(firstName + ", " + lastName + ", " + email);
    // console.log("----------");
    // console.log(data);
    let jsonData = JSON.stringify(data);
    console.log("----------");
    console.log(jsonData);

    const url = "https://api.mailjet.com/v3/REST/contact";

    const options = {
        method: "POST",
        auth: "daily:2c92688731400b760684e3760efb912b"
    };
    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});



//api key
// 2c92688731400b760684e3760efb912b