import * as bcrypt from "bcrypt"

import {deleteUsersByIDs, getUserByName, getUsersByIDs, insertUser, updateUser} from "./queries"
export default class User{
    id:number
    username:string
    password:string

    constructor(username:string,password:string){
        this.id = 0
        if(username.length<1){
           throw new Error("Username empty in constructor") 
        }
        this.username = username
        this.password = password
    }

    save = async ()=>{
        if(this.id===0){
            await insertUser(this)

        }
        else{
            await updateUser(this)
        }
        
    }
    static load = async (arrayOfIDs:number[])=>{
        return await getUsersByIDs(arrayOfIDs)
    }
    static hashPassword = async (password:string)=>{
        let hashedPass =""
        try{
        let genSalt = await bcrypt.genSalt(12)
        hashedPass = await bcrypt.hash(password,genSalt)
        }
        catch(e){
            throw new Error("Failure to hash a password in static User fnc hashPassword");
            
        }
        return hashedPass
    }
    static delete = async (arrayOfIDs:number[])=>{
        await deleteUsersByIDs(arrayOfIDs)
    }
    static validatePassword(password:string):{passed:boolean,message:string}{
        let specialChars = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
        if(password.length<6){
            return(
                {
                passed:false,
                message:"Password must be atleast 6 characters long!"
                }
            )
        }
        let hasSpecialChars = false
        for(let i=0;i<password.length;i++){
            if(specialChars.includes(password[i])){
                hasSpecialChars = true
                break
            }
        }
        if(!hasSpecialChars){
            return(
                {
                passed:false,
                message:"Password must contain atleast one special character"
                }
            )
        }
        return {passed:true, message:"OK"}
    }

    checkAuth = async ():Promise<{passed:boolean,userID?:number}>=>{
        let queriedUsers = await getUserByName(this.username)
        if(queriedUsers.length<1){
            return(
                {
                    passed:false
                }
            )
        }
        let firstUserPass = queriedUsers[0].password

        let passedAuth = false
        try{
            const bcRes = await bcrypt.compare(this.password,firstUserPass)
            if(bcRes){
                
                passedAuth = true
            }
        }
        catch(e){
            throw new Error("Failed comparing passwords in User function checkAuth")
        }
        if(passedAuth){
            return(
                {
                    passed:true,
                    userID:queriedUsers[0].userID
                }
            )
        }
        else{
            return(
                {passed:false}
            )
        }
    }
}