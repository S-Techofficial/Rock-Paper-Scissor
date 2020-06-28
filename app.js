const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const bio =[];
const name = [];
let score = 0;

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    res.redirect("/");
});


app.get("/signup",function(req,res){
    res.render("signup");
});

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password===confirmPassword){
        res.redirect("/profile-edit");
    }else{
        res.send("Passwords doesnot match..please try again");
    }
});



app.get("/",function(req,res){
    res.render("play");
});

app.post("/",function(req,res){
    const scoreTemp = req.body.number;
    if(scoreTemp>score){
        score = scoreTemp;
    }else{
        score = score;
    }
})




app.get("/profile",function(req,res){
    res.render("profile",{profileBio:bio[0],profileName:name[0],profileScore:score});
});

app.get("/profile-edit",function(req,res){
    res.render("profile-edit",{profileScore:score});
});

app.post("/profile-edit",function(req,res){
    name.pop();
    name.push(req.body.profileName);
    bio.pop();
    bio.push(req.body.bioPara);
    res.render("profile",{profileBio: bio[0],profileName:name[0],profileScore:score});
})


app.get("/rank",function(req,res){
    res.render("rank",{profileName:name[0],profileScore:score});
});


app.listen(3000,function(){
    console.log("Port started on 3000");
});