const jwt=require("jsonwebtoken")

require("dotenv").config()
const Authorization=(req,res,next)=>{
    try {
    const {token}=req.headers
    if(!token){
        return res.status(400).json({msg:"Please provide the token"})
    }
    console.log(token);
const CheckToken=jwt.verify(token,process.env.JWT_PRIVATEKEY)
console.log(CheckToken);
if(!CheckToken){
return req.status(401).json({error:"Unauthorized"})
}
req.body.id=CheckToken.id
req.body.sender=CheckToken.sender
next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:error})
    }

}
module.exports=Authorization