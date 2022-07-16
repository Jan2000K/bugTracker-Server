import { Router } from "express";
import User from "../db/user/user";
import { checkSession, isAlreadyLogged } from "../middleware/auth/auth";
import { validateIDQueryParams, validateLoginPost } from "../middleware/validateFields";
import { idArrayRequest } from "../types/types";

const userRouter = Router()
userRouter.post("/login",validateLoginPost,isAlreadyLogged,async(req,res,next)=>{
    try{
        let body = req.body
        const userAuth = await new User(body.username,body.password).checkAuth()
        if(userAuth.passed){
            req.session.userID = userAuth.userID 
            res.json({err:false,message:"Login Success"})
        }
        else{
            res.json({err:true,message:"Invalid user credentials"})
        }
    }
    catch(err){
        next(err)
    }
})

userRouter.get("/isLogged",checkSession,(req,res)=>{
    res.json({err:false,message:"Logged In"})
})

userRouter.post("/:key",validateLoginPost,async(req,res,next)=>{
    try{
        let body = req.body
    if(req.params.key){
        if(req.params.key===process.env.ADMIN_KEY){
            await new User(body.username,body.password).save()
            res.json({err:false,message:"User created"})
        }
        else{
            res.json({err:true,message:"Invalid key"})
        }
    }
    else{
        res.json({err:true,message:"Missing authentication"})
    }
    }
    catch(err){
        next(err)
    }
})


userRouter.delete("/:key",validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
    try{
    if(req.params.key){
        if(req.params.key===process.env.ADMIN_KEY){
            await User.delete(req.idArray!)
            res.json({err:false,message:"Deletion successful"})
        }
        else{
            res.json({err:true,message:"Invalid key"})
        }
    }
    else{
        res.json({err:true,message:"Missing authentication"})
    }
    }
    catch(err){
        next(err)
    }
})
userRouter.get("/logout",checkSession,async(req,res,next)=>{
    try{
    await req.session.destroy(
        (err)=>{
            if(err)throw new Error(err)
        }
    )
    res.json({err:false,message:"Logged out"})
    }
    catch(err){
        next(err)
    }
})


export default userRouter