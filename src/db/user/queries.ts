import { pgQuery } from "../queryClass";

export async function getUsersByIDs(arrayOfIDs:number[]){
    let queryString = 'SELECT "userID", "username" FROM public."User" WHERE "userID" IN ('
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

    return await new pgQuery(queryString,arrayOfIDs).exec()
}

export async function getAllUsers(){
    return await new pgQuery('SELECT "userID", "username" FROM public."User";',[]).exec()
}
