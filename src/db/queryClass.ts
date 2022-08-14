import { pool } from "./pool"

export class pgQuery<T> {
    sql: string
    val: Array<string | number>
    constructor(sqlStatement: string, values: Array<any>) {
        this.sql = sqlStatement
        this.val = values
    }
    //exec function that executes the query
    exec = async (): Promise<T[]> => {
        //store the result of the query in constant res
        const res = await pool.query(this.sql, this.val)
        return res.rows as T[]
    }
}
