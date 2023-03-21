const { verifyTokenAndAuthorization , verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const router = require("express").Router();


/** UPDATE AN EXISTING USER PROFILE **/
// only admin can edit their profile so verifyTokenAndAuthorization
router.put("/:id" , verifyTokenAndAuthorization , async (req , res)=>{
    // we have to encrypt the new password before updating the database
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(user.password , process.env.PASS_SEC).toString()
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id , {
            $set : req.body
        } , 
        {new : true}
        );
        res.status(200).json(updatedUser)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

/** DELETE AN EXISTING USER PROFILE **/
// only admin can delete their profile so verifyTokenAndAuthorization
router.delete("/:id" , verifyTokenAndAuthorization , async(req , res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }
    catch{
        res.status(500).json(err)
    }
})

/** READ AN EXISTING USER PROFILE **/
// if you are logged in you can read the user profile. It is not nessesary to be admin
// so we have used verifyTokenAndAdmin
router.get("/find/:id" , verifyTokenAndAdmin , async(req , res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password , ...others} = user._doc; // dont send the password
        res.status(200).json(others)
    }
    catch{
        res.status(500).json(err)
    }
})


/** READ ALL THE USER PROFILE **/
router.get("/" , verifyTokenAndAdmin , async(req , res)=>{
    const query = req.query.new;
    try{
        // if the url contains query then return the 5 latest profiles
        // else return all the profiles
        const user = query ? await User.find().sort({_id:-1}).limit(5) : await User.find();
        res.status(200).json(user)
    }
    catch{
        res.status(500).json(err)
    }
})


/** GET USERS STATS **/
// all the users that registered last year
router.get("/stats" , verifyTokenAndAdmin , async(req , res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            { $match : { createdAt : { $gte : lastYear }}},
            {
                $project : {
                    month : { $month : "$createdAt" }
                }
            },
            {
                $group : {
                    _id : "$month",
                    total : {$sum : 1},
                }
            }

        ])
        res.status(200).json(data)
    }
    catch{
        res.status(500).json(err)
    }
})


module.exports = router