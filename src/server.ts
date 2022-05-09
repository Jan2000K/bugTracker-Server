import 'dotenv/config'

import { Express, json, Application } from "express"
import Project from "./db/project/project";
import { pgQuery } from './db/queryClass';
const session = require("express-session");
const express = require("express");

const app:Application = express()
const port = process.env.PORT || 5000

app.use(express.json())

setTimeout(() => {

    const ff = Project.getAllProjects()
}, 200);


app.listen(port, () => console.log("Server is runnning on port " + port));
