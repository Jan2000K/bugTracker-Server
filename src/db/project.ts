import { QueryResult } from "pg"
import { pgQuery } from "./queryClass"

export default class project {
    id:number
    name:string
    bugs:bug[]
    bugStats:bugStats
    constructor(name:string,bugs:bug[],bugStats:bugStats) {
        this.id = 0
        this.name = name
        this.bugs = bugs
        this.bugStats = this.calculateBugStats()
    }

    save = async ()=>{
        if(this.id===0){
            let result:queryReturn =await new pgQuery('INSERT INTO public."Project"("name") VALUES ($1);',[this.name]).exec()
            if(result.err){
                if(result.data===null){
                    throw new Error("Error inserting data into table Project");
                }
                else{
                    throw new Error(result.data[0]);
                    
                }

                
            }
        }

    }

    static load=()=>{

    }

    static delete = (arrayOfIDs:number[])=>{

    }

    static getAllProjects = ()=>{

    }


    calculateBugStats = ()=>{
        let stats:bugStats = {open:0,highPriority:0,mediumPriority:0,lowPriority:0}
        for(let i=0;i<this.bugs.length;i++){
            let bugInstance:bug = this.bugs[i]
            if(bugInstance.status==="Open"){
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