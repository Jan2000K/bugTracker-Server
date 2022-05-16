import e, { NextFunction, Request, Response } from "express";
import Bug from "../db/bug/bug";
import Project from "../db/project/project";
import { idArrayRequest } from "../types/types";

export function validateProject(req:Request,res:Response,next:NextFunction){
    let body = req.body
    if(!Project.isValidProject(body)){
        res.json({err:true,msg:"Posted parameters failed field validation"})
    }
    else{
        next()
    }
}

export function validateIDQueryParams(req:idArrayRequest,res:Response,next:NextFunction){
    if(!req.query){
        res.json({err:true,message:"Missing queryParams"})
    }
    else if(!req.query["ids"]){
        res.json({err:true,message:"Missing query Parameter: ids"})
    }
    else{
        const param = req.query["ids"] as string
        const splitParams = param.split(",")
        let idsArray = []
        let passed = true
        for(let i=0;i<splitParams.length;i++){
            try{
                idsArray.push(parseInt(splitParams[i]))
            }
            catch(err){
                passed=false
                break
            }
        }
        if(!passed){
            res.json({err:true,message:"Invalid ID values"})
        }
        else{
            req.idArray = idsArray
            next()
        }
    }
}


export function validatePatchIDs(req:Request,res:Response,next:NextFunction){
    let body = req.body
    let passedBugs = true
    for(let x=0;x<body.bugs.length;x++){
        let bugInstance  = body.bugs[x] as bug
        if(bugInstance.id===0){
            passedBugs = false
        }
    }
    if(!passedBugs){
        res.json({err:false,message:"Bug IDs have cannot be 0 when updating bugs"})
    }
    else if(body.id===0){
        res.json({err:true,message:"Project ID cannot be 0 when updating"})
    }
    else{
        next()
    }
}

export function validatePostIDs(req:Request,res:Response,next:NextFunction){
    let body = req.body
    let passedBugs = true
    for(let x=0;x<body.bugs.length;x++){
        let bugInstance  = body.bugs[x] as bug
        if(bugInstance.id!==0){
            passedBugs = false
        }
    }
    if(!passedBugs){
        res.json({err:false,message:"Bug IDs must be set to zero when posting a new project"})
    }
    else if(body.id!==0){
        res.json({err:true,message:"Project ID must be set to zero when posting a new project"})
    }
    else{
        next()
    }
}

export function validateBugUpdate(req:Request,res:Response,next:NextFunction){
    let body = req.body
    const requiredKeys = ["id","name","status","severity","note","projectID"]
    const reqObjKeys = Object.keys(body)
    let hasKeys = true
    for(let x=0;x<requiredKeys.length;x++){
            if(!reqObjKeys.includes(requiredKeys[x])){
                hasKeys = false
                break
            }
        }
        if(!hasKeys){
            res.json({err:true,message:"Invalid keys in request object"})
        }
        else if(isNaN(body.id) || body.id<1  || !Bug.isValidBug({id:body.id,name:body.name,status:body.status,severity:body.severity,note:body.note})){
          res.json({err:true,message:"Invalid Bug object format"})  
        }
        else if(isNaN(body.projectID) && body.projectID<1){
            res.json({err:true,message:"Invalid projectID value"})
        }
        else{
            next()
        }
}

export function validateBugPost(req:Request,res:Response,next:NextFunction){
    let body = req.body
    const requiredKeys = ["id","name","status","severity","note","projectID"]
    const reqObjKeys = Object.keys(body)
    let hasKeys = true
    for(let x=0;x<requiredKeys.length;x++){
            if(!reqObjKeys.includes(requiredKeys[x])){
                hasKeys = false
                break
            }
        }
        if(!hasKeys){
            res.json({err:true,message:"Invalid keys in request object"})
        }
        else if(isNaN(body.id) || body.id!==0  || !Bug.isValidBug({id:body.id,name:body.name,status:body.status,severity:body.severity,note:body.note})){
          res.json({err:true,message:"Invalid Bug object format"})  
        }
        else if(isNaN(body.projectID) && body.projectID<1){
            res.json({err:true,message:"Invalid projectID value"})
        }
        else{
            next()
        }
}
