//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

const apiKey = "2c92688731400b760684e3760efb912b";
const secretKey = "1370d678a184f319b055b435cb4f0ac0";

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
        "IsExcludedFromCampaigns": false,
        "Name": firstName + " " + lastName,
        "Email": email 
    };

    let jsonData = JSON.stringify(data);

    const options = {
      hostname: "api.mailjet.com",
      path: "/v3/REST/contact",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(apiKey + ":" + secretKey).toString('base64')
      }  
    };

    const apiRequest = https.request(options, function(response){
        console.log("Status code: " + response.statusCode);
        if(response.statusCode === 201){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        let responseData = "";
        response.on("data", function(chunk){
            responseData += chunk;
        });

        response.on("end", function(){
            console.log(responseData);
        });
    });

    apiRequest.on("error", function(error){
        console.error(error);
    });

    apiRequest.write(jsonData);
    apiRequest.end();

});

app.post("/failure", function(req, res){
   res.redirect("/"); 
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});