import { DatabaseError } from "pg"
import { pgQuery } from "../queryClass"
import { deleteBugByIDs, getBugsByIDs, saveBug, updateBug } from "./queries"

export default class Bug {
    id:number
    name:string
    status:bugStatus
    severity:bugSeverity
    note:string
    constructor(name:string,status:bugStatus,severity:bugSeverity,note:string) {
        this.id=0
        if(name.trim().length<1){
            throw new Error("Bug name empty in constructor");
        }
        this.name = name
        if(status !=="Closed" && status!=="Open" && status!=="Testing"){
            throw new Error (`Invalid bug status value in constructor "${status}".`)
        }
        this.status = status
        if(severity!=="High" && severity!=="Medium" && severity!=="Low"){
            throw new Error(`Invalid bug severity value in constructor "${severity}"`)
        }
        this.severity = severity
        this.note = note   
    }
    save = async(projectID:number)=>{
        if(this.id===0){
        return await saveBug(projectID,this)
        }
        else{
            return await updateBug(this)
        }
    }

    static load = async(arrayOfIDs:number[])=>{
        let bugArray:Bug[] = []
        let res = await getBugsByIDs(arrayOfIDs)
        for(let x=0;x<res.length;x++){
            let item = res[x]
            
            let tempBug = new Bug(item.name,item.status,item.severity,item.note)
            tempBug.id = item.id
            bugArray.push(tempBug)
        }
        return{
            err:false,
            data:bugArray
        }
    }

    static delete = async(arrayOfIDs:number[])=>{
        await deleteBugByIDs(arrayOfIDs)
        return true
    }
}