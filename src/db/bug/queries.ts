import { pgQuery } from "../queryClass";

export async function saveBug(projectID:number,bugInstance:bug) {
    await new pgQuery('INSERT INTO public."Bug"(name, status, severity, note, "projectID")VALUES ($1, $2, $3, $4, $5);',[bugInstance.name,bugInstance.status,bugInstance.severity,bugInstance.note,projectID]).exec()
    return true
}

export async function updateBug(bugInstance:bug){
    await new pgQuery('UPDATE public."Bug" SET  name=$1, status=$2, severity=$3, note=$4 WHERE "bugID"=$5;',[bugInstance.name,bugInstance.status,bugInstance.severity,bugInstance.note,bugInstance.id]).exec()
    return true
}

export async function deleteBugByIDs(arrayOfIDs:number[]){
    let queryString =  `DELETE  FROM public."Bug" WHERE "bugID" IN (`
    let param = "$"
    for(let i=0;i<arrayOfIDs.length;i++){
        let paramNumber = i+1
        if(i+1===arrayOfIDs.length){
        queryString = queryString+param+paramNumber
        }
        else{
            queryString = queryString+param+paramNumber+","
        }
    }
    queryString = queryString+");"
    await new pgQuery(
        queryString,
        arrayOfIDs
      ).exec();
    return true
}

export async function getBugsByIDs(arrayOfIDs:number[]){
    let queryString =  `SELECT * FROM public."Bug" WHERE "bugID" IN (`
    let param = "$"
    for(let i=0;i<arrayOfIDs.length;i++){
        let paramNumber = i+1
        if(i+1===arrayOfIDs.length){
        queryString = queryString+param+paramNumber
        }
        else{
            queryString = queryString+param+paramNumber+","
        }
    }
    queryString = queryString+");"
    return await new pgQuery<bug>(
        queryString,
        arrayOfIDs
      ).exec();
}
