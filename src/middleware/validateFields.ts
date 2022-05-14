import { NextFunction, Request, Response } from "express";
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
