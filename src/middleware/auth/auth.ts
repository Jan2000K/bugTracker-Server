import { NextFunction, request, Request, response, Response } from "express";

export function isAlreadyLogged(req:Request,res:Response,next:NextFunction){
    if(req.session.userID){
        res.json({err:true,message:"Already logged in"})
    }
    else{
        next()
    }
}

export function checkSession(req:Request,res:Response,next:NextFunction){
    if(!req.session.userID){
        res.status(401).json({err:true,messaage:"Not logged in!"})
    }
    else{
        next()
    }
}