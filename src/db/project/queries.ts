import Bug from "../bug/bug";
import { pgQuery } from "../queryClass";
import Project from "./project";

export async function allProjects(): Promise<queryReturn> {
  return await new pgQuery(
    'SELECT p."projectID", p.name "projectName", b."bugID", b.name "bugName", b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID";',
    []
  ).exec();
}

export async function getProjectByIDs(arrayOfIDs: number[]) {

  let queryString = `SELECT p."projectID", p.name "projectName", b."bugID", b.name "bugName", b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID" WHERE p."projectID" IN (`
  let param = "$"
  for (let i = 0; i < arrayOfIDs.length; i++) {
    let paramNumber = i + 1
    if (i + 1 === arrayOfIDs.length) {
      queryString = queryString + param + paramNumber
    }
    else {
      queryString = queryString + param + paramNumber + ","
    }
  }
  queryString = queryString + ");"
  return await new pgQuery(
    queryString,
    arrayOfIDs
  ).exec();
}

export async function deleteProjectsByIDs(arrayOfIDs: number[]) {
  let queryString = `DELETE FROM public."Project" WHERE "projectID" = $1;`
  for (let i = 0; i < arrayOfIDs.length; i++) {
    let res: queryReturn = await new pgQuery(queryString, [arrayOfIDs[i]]).exec()
    if (res.err) {
      return res
    }
  }
  return {
    err: false,
    data: `Deleted projects with IDs: ${arrayOfIDs}`
  }
}

export async function saveProjectData(project: project):Promise<queryReturn> {
  let res = await new pgQuery('INSERT INTO public."Project"("name") VALUES ($1) RETURNING "projectID";', [project.name]).exec()
  if (res.err) {
    return res
  }
  else{
    if(res.data!==null){
      console.log(res.data)
      project.id = res.data[0].projectID
    }
  }
  let bugResult =await saveBugs(project.bugs,project.id)
  if(bugResult.err){
      return bugResult
  }
  return {
    err:false,
    data:null
  } 

}

export async function updateProjectData(project:Project):Promise<queryReturn> {
  let res = await new pgQuery('UPDATE public."Project" SET "name"=$1 WHERE "projectID"=$2;', [project.name,project.id]).exec()
  if (res.err) {
    return res
  }
  let bugResult =await saveBugs(project.bugs,project.id)
  if(bugResult.err){
      return bugResult
  }
  project.calculateBugStats()
  return {
    err:false,
    data:null
  } 

}

async function saveBugs(bugs:bug[],projectID:number):Promise<queryReturn>{
  //first Delete all bugs of a project
  let deletRes = await deleteAllBugs(projectID)
  if(deletRes.err){
    return deletRes
  }
  //then add Bugs in the db from the bugs array
  for (let i = 0; i < bugs.length; i++) {
    let currBug = bugs[i]
    let singleBug = new Bug(currBug.name, currBug.status, currBug.severity, currBug.note)
    singleBug.id = currBug.id
    let result = await singleBug.save(projectID)
    if (result.err) {
      return result
    }
  }
  return {
    err:false,
    data:null
  }
}

async function deleteAllBugs(projectID:number){
  return await new pgQuery('DELETE FROM public."Bug" WHERE "projectID" =$1',[projectID]).exec()
}
