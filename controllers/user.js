import User from "../models/User";
import bcrypt from "bcryptjs";


exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body //variable name should match from schema
        if(!email || !password){
            return res.status(400).json({message:"Email or password not sent" })
        }
        const user=await user.findOne({email}) //please match findone from mongoose library
        if(!email)return res.status(404).json({message:"user not found "})
        const hashedPassword=await bcrypt.compareSync(password,user.password)
        if(!hashedPassword)return res.status(400).json({message:"password compare failed"})
        return res.status(200).json({message:"Login Sucessfully "})
        
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}

exports.createUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body//take all variable from user schema 
        const exixtingUser=await user.findOne({email})
        if(exixtingUser) return res.status(400).json({message:"User Already Exists"})
        const hashesdPassword=await bcrypt.hash(password,10)
        const user=await user.create({name,email,password:hashesdPassword})//check from mongoose librarey
        if(!user)return res.status(400).json({message:"user Not Created "})
            return res.status(200).json({message:"User created Sucessfully"})
    } catch (error) {
       return res.status(500).json({message:"Internal Server Error "}) 
    }
}

exports.getAllUser=async(req,res)=>{
    try {
        const user=await user.getAll()//check from mongoose library
        if(!user)return res.status(400).json({message:"User not Found"})
        return res.status(200).json({message:"Sucessfully get User",user})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
}