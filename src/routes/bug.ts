import { Router } from "express";
import Bug from "../db/bug/bug";
import { deleteBugByIDs } from "../db/bug/queries";
import { checkSession } from "../middleware/auth/auth";
import { validateBugPost, validateBugUpdate, validateIDQueryParams } from "../middleware/validateFields";
import { idArrayRequest } from "../types/types";
const bugRouter = Router()

bugRouter.patch("/",checkSession,validateBugUpdate,async(req,res,next)=>{
    try{
        let body = req.body
        const bug = new Bug(body.name,body.status,body.severity,body.note)
        bug.id = body.id
        await bug.save()
        res.json({err:false,message:"Bug updated"})
    }
    catch(err){
        next(err)
    }
})

bugRouter.post("/",checkSession,validateBugPost,async(req,res,next)=>{
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

bugRouter.delete("/",checkSession,validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
    try{
        await deleteBugByIDs(req.idArray!)
        res.json({err:false,message:"Deletion successful"})
    }
    catch(err){
        next(err)
    }
})

export default bugRouter