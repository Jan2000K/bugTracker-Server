import { pgQuery } from "../queryClass"
import User from "./user"

export async function getUsersByIDs(arrayOfIDs: number[]) {
    let queryString =
        'SELECT "userID", "username" FROM public."User" WHERE "userID" IN ('
    let param = "$"
    for (let i = 0; i < arrayOfIDs.length; i++) {
        let paramNumber = i + 1
        if (i + 1 === arrayOfIDs.length) {
            queryString = queryString + param + paramNumber
        } else {
            queryString = queryString + param + paramNumber + ","
        }
    }
    queryString = queryString + ");"

    return await new pgQuery<userNoPassword>(queryString, arrayOfIDs).exec()
}

export async function getAllUsers() {
    return await new pgQuery<userNoPassword>(
        'SELECT "userID", "username" FROM public."User";',
        []
    ).exec()
}

export async function updateUser(user: User) {
    let hashPass = await User.hashPassword(user.password)
    await new pgQuery(
        'UPDATE "public.User" SET "username" =$1, "password"=$2',
        [user.username, hashPass]
    ).exec()
    return true
}

export async function insertUser(user: User) {
    let hashPass = await User.hashPassword(user.password)

    await new pgQuery(
        'INSERT INTO public."User" ("username","password") VALUES ($1,$2);',
        [user.username, hashPass]
    ).exec()
}

export async function deleteUsersByIDs(arrayOfIDs: number[]) {
    let queryString = `DELETE FROM public."User" WHERE "userID" IN (`
    let paramd = "$"
    for (let i = 0; i < arrayOfIDs.length; i++) {
        let paramNumber = i + 1
        if (i + 1 === arrayOfIDs.length) {
            queryString = queryString + paramd + paramNumber + ");"
        } else {
            queryString = queryString + paramd + paramNumber + ","
        }
    }
    await new pgQuery(queryString, arrayOfIDs).exec()
}
export async function getUserByName(name: string) {
    return await new pgQuery<user>(
        'SELECT * FROM public."User" WHERE "username"=$1',
        [name]
    ).exec()
}
