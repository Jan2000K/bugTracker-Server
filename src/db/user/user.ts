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
}