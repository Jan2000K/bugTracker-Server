import 'dotenv/config'

import { Express, json, Application } from "express"
import { pgQuery } from './db/queryClass';
import User from './db/user/user';
process.env.NODE_ENV = 'development';
const session = require("express-session");
const express = require("express");

const app:Application = express()
const port = process.env.PORT || 5000

app.use(express.json())

setTimeout(
    async()=>{
        const user = new User("admin","admin")
        let f =await user.checkAuth()
        console.log(f)
    },
    200
)

app.listen(port, () => console.log("Server is runnning on port " + port));
