import { Router } from "express"
import Project from "../db/project/project"
import { checkSession } from "../middleware/auth/auth"
import {  validateIDQueryParams, validatePatchIDs, validatePostIDs, validateProject } from "../middleware/validateFields"
import { idArrayRequest } from "../types/types"

const projectRouter = Router()

projectRouter.get("/all",checkSession,async(req,res,next)=>{
    let projectArray:Project[] = []
    try{
        projectArray = await Project.getAllProjects()
        res.json({err:false,message:projectArray})
    }
    catch(err){
        next(err)
    }
})

projectRouter.get("/",checkSession,validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
    try{
        const projects = await Project.load(req.idArray!)
        res.json({err:false,message:projects})
    }
    catch(err){
        next(err)

    }
})

/*
Example post JSON
{
    "id":0,
    "name":"projectName",
    "bugs":[
        {
            "id":0,
            "name":"bugName",
            "status":"Open" OR "Testing" OR "Closed",
            "severity":"Low" OR "Medium" OR "High",
            "note":"Note here" OR NULL
        }
    ]
}
*/

projectRouter.post("/",checkSession,validateProject,validatePostIDs,async(req,res,next)=>{
    try{
        const body = req.body
       
        const project = new Project(body.name,body.bugs)
        project.save()
        res.json({err:false,message:"Project saved"})
    }
    catch(err){
        next(err)
    }
})
projectRouter.patch("/updateName",checkSession,async(req,res,next)=>{
    let body = req.body
    if(body.projectID && body.name){
        if(isNaN(body.projectID) || typeof body.name!=="string"){
            res.json({err:true,message:"Invalid values"})
        }
        else{
            Project.updateName(body.name,body.projectID)
            res.json({err:false,message:"Name successfully updated"})
        }
    }
    else{
        res.json({err:true,message:"Missing required keys (name, projectID)"})
    }
})

projectRouter.patch("/",checkSession,validateProject,validatePatchIDs,async(req,res,next)=>{
    try{
        const body = req.body
        if(body.id===0){
            res.json({err:true,message:"Project ID cannot be 0 if its being updated!"})
        }
        
        else{
        const project = new Project(body.name,body.bugs)
        project.id = body.id
        await project.save()
        res.json({err:false,message:"Project Updated"})
        }
    }
    catch(err){
        next(err)
    }
})

projectRouter.delete("/",checkSession,validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
    try{
        await Project.delete(req.idArray!)
        res.json({err:false,message:"Projects Deleted"})
    }
    catch(err){
        next(err)
    }    
})

export default projectRouter
