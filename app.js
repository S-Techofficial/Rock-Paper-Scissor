const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/gameDB',{useNewUrlParser:true, useUnifiedTopology:true});



const userSchema = {
    username:{type:String,trim:true,default:''},
    password:{type:String,default:''},
    bio:{type:String,default:''},
    score:{type:Number,default:0}
}


const User = mongoose.model('User',userSchema);

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.set('useFindAndModify', false);


app.get("/signup",(req,res) => {
    res.render("signup");
})

app.post("/signup",(req,res) => {
    const name = req.body.username;
    const password = req.body.password;
    const player = new User({
        username:name,
        password:password
    });
    player.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("profile",{user:player});
        }
    });
});


app.get("/login",(req,res) => {
    res.render("login");
})

app.post("/login",(req,res) => {
    const name = req.body.username;
    const password = req.body.password;
    User.findOne({username:name},function(err,foundUser){
        if(!err){
            if(foundUser.password === password){
                res.render("play",{user:foundUser});
            }
        }else{
            res.redirect("/login");
        }
    });
});




app.get("/:userId",(req,res) => {
    const id = req.params.userId;
    User.findOne({_id:id},function(err,foundUser){
        if(!err){
            res.render("play",{user:foundUser});
        }
    })
});


app.post("/:userId",(req,res) => {
    const id = req.params.userId;
    const scoreData = Number(req.body.highScore);
    User.findOneAndUpdate({_id:id},{$set:{score:scoreData}},function(err,foundUser){
        if(err){
            console.log(err);
        }
    });
})



app.get("/profile/:profileId",(req,res) => {
    const requestId = req.params.profileId;
    User.findOne({_id:requestId},function(err,foundUser){
        if(!err){
            res.render("profile",{user:foundUser});
            console.log(foundUser);
        }    
    });
});

app.get("/profile/:profileId/edit",(req,res) => {
    const requestId = req.params.profileId;
    res.render("edit",{user:requestId});
});

app.post("/profile/:profileId/edit",(req,res) => {
    const requestId = req.params.profileId;
    const editedBio = req.body.bioPara;
    User.findOneAndUpdate({_id:requestId},{$set:{bio:editedBio}},(err,foundUser) => {
        res.render("profile",{user:foundUser});
    });
})

app.get("/rank/:userId",(req,res) => {
    const userId = req.params.userId;
    User.find({"score":{$ne:null}},function(err,result){
        if(!err){
            res.render("rank",{profile:result,id:userId});
        }else{
            console.log(err);
        }
    });
});


app.listen(3000,function(){
    console.log("Port started on 3000");
});