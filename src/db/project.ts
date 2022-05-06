import { DatabaseError, QueryResult } from "pg"
import { pgQuery } from "./queryClass"

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

    save = async ():Promise<Boolean>=>{
        var success = true
        if(this.id===0){
            let result:queryReturn =await new pgQuery('INSERT INTO public."Project"("name") VALUES ($1);',[this.name]).exec()
            if(result.err){
                success = false
            }
        }
        return success

    }

    static load=(arrayOfIDs:number[]):project[]|boolean=>{
        var success = true
        /*
        SELECT * FROM public."Project"
        WHERE "projectID" IN (12);
        */

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