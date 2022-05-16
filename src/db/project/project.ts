
import Bug from "../bug/bug"

import { allProjects, deleteProjectsByIDs, getProjectByIDs, saveProjectData, updateProjectData } from "./queries"

export default class Project {
    id:number
    name:string
    bugs:bug[]
    bugStats:bugStats
    constructor(name:string,bugs:bug[]) {
        this.id = 0
        if(name.trim().length===0){
            throw new Error("Project name is empty in the constructor!");
        }
        this.name = name
        this.bugs = bugs
        this.bugStats = this.calculateBugStats()
    }
    
    save = async ()=>{
        if(this.id===0){
         return await saveProjectData(this)
         
        }
        else{
        return await updateProjectData(this)
        }
    }

    static load=async(arrayOfIDs:number[]):Promise<Project[]>=>{
        let res = await getProjectByIDs(arrayOfIDs)
        let projectArray:Project[] = []
        if(res.length===0){
            return projectArray
        }
        else{            
            let projectsData = res
            //Loop through all results
            for(let i=0;i<arrayOfIDs.length;i++){
                //Create a temp array in which there is only 1 project
                let tempArr = projectsData.filter(
                    (project)=>{
                        if(project.projectID===arrayOfIDs[i]){
                            return true
                        }
                    }
                )
                if(tempArr.length===0){
                    return projectArray
                }
                //Create a new bugList in which the bugs for the curr project will be stored
                let bugList:bug[] = []
                //Loop through all results
                for(let x=0;x<tempArr.length;x++){
                    if(tempArr[x].bugID===null){
                        continue
                    }
                    let element = tempArr[x]
                    let note:string = element.note ||""
                    //Create a new instance of a Bug with data recived from the query
                    let bugInstance = new Bug(element.bugName,element.status,element.severity,note)
                    //set the id of Bug
                    bugInstance.id = element.bugID
                    bugList.push(bugInstance)
                }
                //get first project in array
                const firstProj = tempArr[0]
                //create a new project with queried data
                let generatedProject = new Project(firstProj.projectName,bugList)
                //set project ID
                generatedProject.id = firstProj.projectID
                projectArray.push(generatedProject)
            }
            return projectArray            
        }
    }

    static delete = async(arrayOfIDs:number[])=>{
     let res = await deleteProjectsByIDs(arrayOfIDs)
     return res
    }

    static getAllProjects = async():Promise<Project[]>=>{ 
        let res = await allProjects()
        let arrayOfIDs:number[] = []
        let projectArray:Project[] = []
        if(res.length===0){
            return projectArray
        }
        else{
            
            let projectsData = res
            for(let y=0;y<projectsData.length;y++){
                if(!arrayOfIDs.includes(projectsData[y].projectID)){
                    arrayOfIDs.push(projectsData[y].projectID)
                }
            }
            
            //Loop through all results
            for(let i=0;i<arrayOfIDs.length;i++){
                //Create a temp array in which there is only 1 project
                let tempArr = projectsData.filter(
                    (project)=>{
                        if(project.projectID===arrayOfIDs[i]){
                            return true
                        }
                    }
                )
                if(tempArr.length===0){
                    return projectArray
                }
                //Create a new bugList in which the bugs for the curr project will be stored
                let bugList:bug[] = []
                //Loop through all results
                for(let x=0;x<tempArr.length;x++){
                    
                    let element = tempArr[x]
                    if(element.bugID===null)continue
                    let note:string = element.note ||""
                    //Create a new instance of a Bug with data recived from the query
                    let bugInstance = new Bug(element.bugName,element.status,element.severity,note)
                    //set the id of Bug
                    bugInstance.id = element.bugID
                    bugList.push(bugInstance)
                }
                //get first project in array
                const firstProj = tempArr[0]
                //create a new project with queried data
                let generatedProject = new Project(firstProj.projectName,bugList)
                //set project ID
                generatedProject.id = firstProj.projectID
                projectArray.push(generatedProject)
            }
            return projectArray            
        }
    }
    calculateBugStats = ()=>{
        let stats:bugStats = {open:0,highPriority:0,mediumPriority:0,lowPriority:0}
        for(let i=0;i<this.bugs.length;i++){
            let bugInstance:bug = this.bugs[i]
            if(bugInstance.status==="Open" || bugInstance.status==="Testing"){
                stats.open=stats.open+1
                switch (bugInstance.severity) {
                    case "High":
                        stats.highPriority = stats.highPriority +1
                        break;
                    case "Medium":
                        stats.mediumPriority = stats.mediumPriority+1
                        break;
                    case "Low":
                        stats.lowPriority = stats.lowPriority+1
                        break;
                }
            }  
        }
    return stats    
    }

    static isValidProject = (value:Object):boolean=>{
        if(typeof value==="object" && typeof value!==null){
            if(value.hasOwnProperty("id") && value.hasOwnProperty("name") && value.hasOwnProperty("bugs")){
                let proj = value as projectNoStats
                if(isNaN(proj.id) || proj.id<0)return false
                if(typeof proj.name!=="string" || proj.name.length<1){
                    return false
                }
                if(!Array.isArray(proj.bugs))return false
                for(let i=0;i<proj.bugs.length;i++){
                    if(!Bug.isValidBug(proj.bugs[i])){
                        return false
                    }
                }
            }
            else{
                return false
            }
        }
        else{
            return false
        }
        return true
    }
}