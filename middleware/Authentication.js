const jwt=require("jsonwebtoken")

require("dotenv").config()
const Authorization=(req,res,next)=>{
    try {
    const {token}=req.headers
    console.log(token);
const CheckToken=jwt.verify(token,process.env.JWT_PRIVATEKEY)
console.log(CheckToken);
if(!CheckToken){
return req.status(401).json({error:"Unauthorized"})
}
req.body.id=CheckToken.id
next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:error})
    }

}
module.exports=Authorization