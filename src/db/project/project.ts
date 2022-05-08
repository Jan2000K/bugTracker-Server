import { DatabaseError, QueryArrayResult, QueryResult, QueryResultRow } from "pg"
import { pgQuery } from "../queryClass"
import { getProjectByIDs } from "./queries"

export default class project {
    id:number
    name:string
    bugs:bug[]
    bugStats:bugStats
    constructor(name:string,bugs:bug[],bugStats:bugStats) {
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
            /*
            Fill projectArray with query Data
            */
            
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