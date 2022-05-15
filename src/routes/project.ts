import { Router } from "express"
import Project from "../db/project/project"
import {  validateIDQueryParams, validateProject } from "../middleware/validateFields"
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

projectRouter.post("/",validateProject,async(req,res,next)=>{
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

projectRouter.patch("/",validateProject,async(req,res,next)=>{
    try{
        const body = req.body
        const project = new Project(body.name,body.bugs)
        project.id = req.body.id
        res.json({err:false,message:"Project Updated"})
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
