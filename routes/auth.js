/** AUTHENTICATION **/
const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

/*** REGISTER ***/
router.post("/register" , async (req , res)=>{
    
    // creating a new User object from the data that we get from request body 
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(), // encryting the password using cryptoJs
    })

    try{
        // saving the user object in our database
        const savedUser = await newUser.save();
        // if every thing is ok then send 201 responce with the user object
        res.status(201).json(savedUser);
    }
    catch(err){
        // in case any error then send 500 status and err as response
        console.log(err)
        res.status(500).json(err);
        return;
    }
})

/*** LOGIN ***/
router.post("/login" , async (req , res)=>{
    try{
        // find the user from the database from the username
        const user = await User.findOne({
            username : req.body.username
        });
        // if no such user exists on our database 
        if(!user){
             res.status(401).json("Wrong User Name");
             return;
        }

        // get the original passward from the database by dycrypting 
        const hashedPassword = CryptoJS.AES.decrypt(user.password , process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); // original password from the database
        const inputPassword = req.body.password; // the password from request body

        // if wrond password
        if(originalPassword != inputPassword)
        { 
            res.status(401).json("Wrong Password");
            return;
        }
        const accessToken = jwt.sign(
        {
            id : user._id,
            isAdmin : user.isAdmin
        }, 
        process.env.JWT_SEC,
        {
            expiresIn : "3d"
        }
        );

        const {password , ...others} = user._doc;
        res.status(200).json({...others , accessToken})

    }
    catch(err){
        // in case any error then send 500 status and err as response
        res.status(500).json(err)
        return;
    }
})

module.exports = router