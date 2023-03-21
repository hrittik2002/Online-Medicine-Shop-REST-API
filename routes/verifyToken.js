const jwt = require("jsonwebtoken")

const verifyToken = (req , res , next) =>{
    // store the string from the header in authHeader
    const authHeader = req.headers.token;

    if(authHeader){
        // in header there will be string like this
        // bearer shgdagjkdgjasb5465sdasd
        // here the second part of the string is token
        // store the jtw token in token
        const token = authHeader.split(" ")[1]

        // now this inbuilt-method of jwt - verify checks whether the token is correct or not
        // if the token is not correct it return an error
        // else if the token is correct it will return the user
        jwt.verify(token , process.env.JWT_SEC , (err , user)=>{
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next();
        })
    }
    // if token is not present 
    else{
        return res.status(401).json("You are not authenticated!")
    }
}

const verifyTokenAndAuthorization = (req , res , next)=>{
    verifyToken(req,res,()=>{
        // if the users is is equal to the params id and user is Admin
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }
        else{
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

const verifyTokenAndAdmin = (req , res , next)=>{
    verifyToken(req , res , ()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            res.status(403).json("You are not allowed to do that");
        }
    })
}

module.exports = { verifyToken , verifyTokenAndAdmin ,  verifyTokenAndAuthorization };