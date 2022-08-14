import { deleteBugByIDs, getBugsByIDs, saveBug, updateBug } from "./queries"

export default class Bug {
    id: number
    name: string
    status: bugStatus
    severity: bugSeverity
    note: string | null
    constructor(
        name: string,
        status: bugStatus,
        severity: bugSeverity,
        note: string | null
    ) {
        this.id = 0
        if (name.length < 1) {
            throw new Error("Bug name empty in constructor")
        }
        this.name = name
        if (status !== "Closed" && status !== "Open" && status !== "Testing") {
            throw new Error(
                `Invalid bug status value in constructor "${status}".`
            )
        }
        this.status = status
        if (
            severity !== "High" &&
            severity !== "Medium" &&
            severity !== "Low"
        ) {
            throw new Error(
                `Invalid bug severity value in constructor "${severity}"`
            )
        }
        this.severity = severity
        this.note = note
    }
    save = async (projectID?: number) => {
        //if saving a newly created bug it must also have parent project ID
        if (this.id === 0) {
            if (projectID === undefined) {
                throw new Error("Missing project ID for Bug creation")
            }
            return await saveBug(projectID, this)
        } else {
            return await updateBug(this)
        }
    }

    static load = async (arrayOfIDs: number[]) => {
        let bugArray: Bug[] = []
        let res = await getBugsByIDs(arrayOfIDs)
        for (let x = 0; x < res.length; x++) {
            let item = res[x]
            let tempBug = new Bug(
                item.name,
                item.status,
                item.severity,
                item.note
            )
            tempBug.id = item.id
            bugArray.push(tempBug)
        }
        return bugArray
    }

    static delete = async (arrayOfIDs: number[]) => {
        await deleteBugByIDs(arrayOfIDs)
        return true
    }

    static isValidBug = (bugObj: Object): boolean => {
        let requiredFields = ["id", "name", "status", "severity", "note"]
        //valid values for bug severity
        let severity = ["Low", "Medium", "High"]
        //valid values for bug status
        let status = ["Open", "Closed", "Testing"]
        if (typeof bugObj === "object" && bugObj !== null) {
            //gets all the keys of the object that is being validated
            const keys = Object.keys(bugObj)
            //Go through all the keys and if the key is not included in the required Fields, return false
            for (let i = 0; i < keys.length; i++) {
                if (!requiredFields.includes(keys[i])) {
                    return false
                }
            }
            const bug = bugObj as bug

            if (isNaN(bug.id) || bug.id < 0) return false
            if (
                (typeof bug.name === "string" &&
                    typeof bug.note === "string") ||
                (typeof bug.note === null &&
                    typeof bug.severity === "string" &&
                    typeof bug.status === "string")
            ) {
                if (bug.name.length < 1) {
                    return false
                }
                if (
                    !severity.includes(bug.severity) ||
                    !status.includes(bug.status)
                ) {
                    return false
                }
            }
        } else {
            return false
        }
        return true
    }
}
