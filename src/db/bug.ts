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
        this.status = status
        this.severity = severity
        this.note = note
        
    }
    
    
}