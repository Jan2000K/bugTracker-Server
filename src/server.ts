import 'dotenv/config'

import { Express, json, Application } from "express"
import { SessionOptions } from 'express-session';
import {pool} from "./db/pool"
import User from './db/user/user';
import bugRouter from './routes/bug';
import projectRouter from './routes/project';
import userRouter from './routes/user';
const session = require("express-session");
const express = require("express");
const pgSession = require('connect-pg-simple')(session);
const app:Application = express()
const port = process.env.PORT || 5000

let sessionOptions:SessionOptions ={
    store: new pgSession({
        pool:pool,
    }),
    secret:process.env.SESS_KEY as string,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:900000, // 15 minutes in miliseconds
        secure:false,
        httpOnly:true
    },
    name:"BTssid"

}
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie!.secure = true
  }
  
  app.use(session(sessionOptions))

app.use(express.json())




app.use("/project",projectRouter)


app.use("/bug",bugRouter)

app.use("/user",userRouter)



app.listen(port, () => console.log("Server is runnning on port " + port));
