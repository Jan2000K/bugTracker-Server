import 'dotenv/config'

import { Express, json, Application } from "express"
import { allProjects } from './db/project/queries';
import { pgQuery } from './db/queryClass';
import User from './db/user/user';
import projectRouter from './routes/project';
process.env.NODE_ENV = 'development';
const session = require("express-session");
const express = require("express");

const app:Application = express()
const port = process.env.PORT || 5000

app.use(express.json())




app.use("/project",projectRouter)

app.listen(port, () => console.log("Server is runnning on port " + port));
