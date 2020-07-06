const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

// // Set Storage Engine
// const storage = multer.diskStorage({
//     destination:"./public/uploads/",
//     filename: function(req,file,cb){
//         cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//     }
// })

// // Initialize upload
// const upload = multer({
//     storage:storage,
//     limits:{fileSize: 1000000},
//     fileFilter: function(req,file, cb){
//         checkFileType(file,cb);
//     }
// }).single('profileImage');

// // checkFileType function
// function checkFileType(file,cb){
//     //Allowed extensions
//     const fileType = /jpeg|jpg|png|gif/;
//     // check extension
//     const extname = fileType.test(path.extname(file.originalname).toLowerCase());
//     // check mime
//     const mimeType = fileType.test(file.mimetype);

//     if(mimeType && extname){
//         return cb(null,true);
//     }else{
//         cb("Images only!");
//     }
// }



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect('mongodb://localhost:27017/gameDB',{useNewUrlParser:true, useUnifiedTopology:true});



const userSchema = {
    username:String,
    password:String,
    bio:String,
    score:Number
}


const User = mongoose.model('User',userSchema);



app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const name = res.body.username;
    const password = res.body.password;
    User.findOne({username:name},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser.password === password){
                res.redirect("/");
            }else{
                res.redirect("/login");
            }
        }
    })
});


app.get("/signup",function(req,res){
    res.render("signup");
});

app.post("/signup",function(req,res){
    const name = res.body.username;
    const password = res.body.password; 
    const player = new User({
        username: name,
        password: password
    });
    player.save(function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/profile-edit")
});



app.get("/",function(req,res){
    res.render("play");
});

app.post("/:userId",function(req,res){
    const requestedId = req.params.userId;
    const scoreTemp = req.body.number;
    User.findOneAndUpdate({_id:requestedId},{$set:{score:scoreTemp}})
})




app.get("/profile/:userId",function(req,res){
    const requestedId = req.params.userId;
    User.findOne({_id:requestedId},function(err,foundUser){
        if(!err){
            res.render("profile",{profileBio:foundUser.bio,
                profileName:foundUser.username,
                profileScore:foundUser.score});

        }
    })
});


app.get("/profile-edit",function(req,res){
    res.render("profile-edit")
});

app.post("/profile-edit",function(req,res){
    bio= req.body.bioPara;
    // upload(req,res,(err) => {
    //     if(err){res.render("profile",{msg:err});
    //     }else{
    //         if(req.file == undefined){
    //             res.render("profile",{
    //                 msg:"No file selected!",
    //                 profileBio: bio,
    //                 profileName:name,
    //                 profileScore:score
    //             });
    //         }else{
    //             res.render("profile",{
    //                 msg:"file uploaded successfully!",
    //                 file:`uploads/${req.file.filename}`,
    //                 profileBio: bio,
    //                 profileName:name,
    //                 profileScore:score
    //             })
    //         }
    //     }
    // });
    User.findOneAndUpdate({},{$set:{bio:bio},function(err,foundUser){
        if(!err){
            res.render("profile",{profileBio:foundUser.bio,profileName:foundUser.username,profileScore:foundUser.score})
        }
    }})
    
})



app.get("/rank",function(req,res){
    User.find({},function(err,foundUser){
        if(!err){
            foundUser.forEach(function(user){
                res.render("rank",{profileUser:user});
            })
        }
    })

});


app.listen(3000,function(){
    console.log("Port started on 3000");
});