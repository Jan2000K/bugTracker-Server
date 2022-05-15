import Bug from "../bug/bug";
import { pgQuery } from "../queryClass";
import Project from "./project";

export async function allProjects(): Promise<projectQueryReturn[]> {
  return await new pgQuery<projectQueryReturn>(
    'SELECT p."projectID", p.name "projectName", b."bugID", b.name "bugName", b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID";',
    []
  ).exec();
}

export async function getProjectByIDs(arrayOfIDs: number[]) {

    let queryString =  `SELECT p."projectID", p.name "projectName", b."bugID", b.name "bugName", b.severity, b.status, b.note FROM "Project" p INNER JOIN "Bug" b  ON p."projectID" = b."projectID" WHERE p."projectID" IN (`
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
    return await new pgQuery<projectQueryReturn>(
        queryString,
        arrayOfIDs
      ).exec();
}

export async function deleteProjectsByIDs(arrayOfIDs: number[]):Promise<boolean> {
  let queryString = `DELETE FROM public."Project" WHERE "projectID" IN (`
  let paramd = '$'
  for (let i = 0; i < arrayOfIDs.length; i++) {
    let paramNumber = i+1
    if(i+1===arrayOfIDs.length){
      queryString = queryString +paramd+paramNumber+');' 
    }
    else{
      queryString = queryString +paramd+paramNumber+','
    }
  }
  await new pgQuery(queryString,arrayOfIDs).exec()
  return true
}

export async function saveProjectData(project: Project):Promise<Boolean> {
  let res = await new pgQuery<{projectID:number}>('INSERT INTO public."Project"("name") VALUES ($1) RETURNING "projectID";', [project.name]).exec()
    if(res.length>0){
      project.id = res[0].projectID
    }
  await saveBugs(project.bugs,project.id)
  return true
}

export async function updateProjectData(project:Project):Promise<Boolean> {
  await new pgQuery('UPDATE public."Project" SET "name"=$1 WHERE "projectID"=$2;', [project.name,project.id]).exec()
  await saveBugs(project.bugs,project.id)
  project.calculateBugStats()
  return true
}

async function saveBugs(bugs:bug[],projectID:number):Promise<boolean>{
  //first Delete all bugs of a project
   await deleteAllBugs(projectID)
  //then add Bugs in the db from the bugs array
  for (let i = 0; i < bugs.length; i++) {
    let currBug = bugs[i]
    let singleBug = new Bug(currBug.name, currBug.status, currBug.severity, currBug.note)
    singleBug.id = currBug.id
    await singleBug.save(projectID)

  }
  return true
}

async function deleteAllBugs(projectID:number){
   await new pgQuery('DELETE FROM public."Bug" WHERE "projectID" =$1',[projectID]).exec()
   return true
}
