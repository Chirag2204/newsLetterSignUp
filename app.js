const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));//to provide path of static files like images stylesheets etc.

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signUp.html");
})

app.post("/",function(req,res){
   var firstName = req.body.firstName;
   var lastName = req.body.lastName;
   var email = req.body.email;
   var password = req.body.password;

   var url = "https://us1.api.mailchimp.com/3.0/lists/414e49f658";
//way to send data to mailchimp
   var data = {
     members : [
       {
         email_address : email,
         status: "subscribed",
         merge_fields : {
           FNAME: firstName,
           LNAME: lastName
         }
       }
     ]
   };

   var jsonData = JSON.stringify(data);
   var options = {
     method : "POST",//for post request using https
     auth : "cc2204:c3dfb68f4706275d094e9f757507fb8b-us1"//for athentication using api Key
   }

//to post request using https
   var request = https.request(url,options,function(response){
      response.on("data",function(data){
        console.log(JSON.parse(data));
        if(response.statusCode == 200){
          res.sendFile(__dirname+"/success.html");
        }else{
          res.sendFile(__dirname+"/failure.html");
        }
      })
   })
 request.write(jsonData);//to post our data in mailchimp
 request.end();
})

app.post("/failure",function(req,res){
   res.redirect("/");
})

app.post("/success",function(req,res){
   res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(req,res){
  console.log("Server called successfully");
})

//apikey : c3dfb68f4706275d094e9f757507fb8b-us1
//listId : 414e49f658
