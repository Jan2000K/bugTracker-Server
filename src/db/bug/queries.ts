import { pgQuery } from "../queryClass";

export async function saveBug(projectID:number,bugInstance:bug) {
    return await new pgQuery('INSERT INTO public."Bug"(name, status, severity, note, "projectID")VALUES ($1, $2, $3, $4, $5);',[bugInstance.name,bugInstance.status,bugInstance.severity,bugInstance.note,projectID]).exec()
}

export async function updateBug(bugInstance:bug){
    return await new pgQuery('UPDATE public."Bug" SET  name=$1, status$2, severity=$3, note=$4 WHERE "bugID"=$5;',[bugInstance.name,bugInstance.status,bugInstance.severity,bugInstance.note,bugInstance.id]).exec()

}