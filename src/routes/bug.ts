import { Router } from "express";
import Bug from "../db/bug/bug";
import { validateBugPost, validateBugUpdate } from "../middleware/validateFields";

const bugRouter = Router()

bugRouter.patch("/",validateBugUpdate,async(req,res,next)=>{
    try{
        let body = req.body
        const bug = new Bug(body.name,body.status,body.severity,body.note)
        bug.id = body.id
        await bug.save(body.projectID)
        res.json({err:false,message:"Bug updated"})
    }
    catch(err){
        next(err)
    }
})

bugRouter.post("/",validateBugPost,async(req,res,next)=>{
    try{
        let body = req.body
        const newBug  = new Bug(body.name,body.status,body.severity,body.note)
        await newBug.save(body.projectID)
        res.json({err:false,message:"Bug Added"})
    }
    catch(err){
        next(err)
    }
})

export default bugRouter