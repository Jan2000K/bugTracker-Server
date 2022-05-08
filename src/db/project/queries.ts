import { pgQuery } from "../queryClass";

export async function allProjects(): Promise<queryReturn> {
  return await new pgQuery(
    'SELECT p."projectID", p.name "projectName", b."bugID", b.name "bugName", b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID";',
    []
  ).exec();
}

export async function getProjectByIDs(arrayOfIDs: number[]) {

    let queryString =  `SELECT p."projectID", p.name projectName, b."bugID", b.name bugName, b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID" WHERE p."projectID" IN (`
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
    console.log(queryString)
    return await new pgQuery(
        queryString,
        arrayOfIDs
      ).exec();
}
