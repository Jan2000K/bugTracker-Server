import { Router } from "express"
import Project from "../db/project/project"
import {  validateIDQueryParams, validatePatchIDs, validatePostIDs, validateProject } from "../middleware/validateFields"
import { idArrayRequest } from "../types/types"

const projectRouter = Router()

projectRouter.get("/all",async(req,res,next)=>{
    let projectArray:Project[] = []
    try{
        projectArray = await Project.getAllProjects()
        res.json({projects:projectArray})
    }
    catch(err){
        next(err)
    }
})

projectRouter.get("/",validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
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

projectRouter.post("/",validateProject,validatePostIDs,async(req,res,next)=>{
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

projectRouter.patch("/",validateProject,validatePatchIDs,async(req,res,next)=>{
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

projectRouter.delete("/",validateIDQueryParams,async(req:idArrayRequest,res,next)=>{
    try{
        await Project.delete(req.idArray!)
        res.json({err:false,message:"Projects Deleted"})
    }
    catch(err){
        next(err)
    }    
})

export default projectRouter
