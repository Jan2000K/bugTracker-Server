import { DatabaseError, QueryArrayResult, QueryResult, QueryResultRow } from "pg"
import Bug from "../bug"
import { pgQuery } from "../queryClass"
import { getProjectByIDs } from "./queries"

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

    save = async ():Promise<queryReturn>=>{
        let result!:queryReturn
        if(this.id===0){
            result=await new pgQuery('INSERT INTO public."Project"("name") VALUES ($1);',[this.name]).exec()

        }
        else{
            
        }
        return result

    }

    static load=async(arrayOfIDs:number[])=>{
        let res:queryReturn = await getProjectByIDs(arrayOfIDs)
        let projectArray:project[] = []
        if(res.data===null){
            return projectArray
        }
        else{
            
            let projectsData = res.data as projectQueryReturn[]
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
                //Create a new bugList in which the bugs for the curr project will be stored
                let bugList:bug[] = []
                //Loop through all results
                for(let x=0;x<tempArr.length;x++){
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
                const generatedProject = new Project(firstProj.projectName,bugList)
                //set project ID
                generatedProject.id = firstProj.projectID
                projectArray.push(generatedProject)
            }
            return projectArray            
        }
    }

    static delete = (arrayOfIDs:number[])=>{

    }

    static getAllProjects = ()=>{


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

}