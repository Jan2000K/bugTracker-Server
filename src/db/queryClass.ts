import { DatabaseError, PoolClient, QueryResult } from "pg";

import { pool } from "./pool";

export class pgQuery<T> {
  sql: string;
  val: Array<string | number>;
  constructor(sqlStatement: string, values: Array<any>) {
    this.sql = sqlStatement;
    this.val = values;
  }
  exec = async (): Promise<T[]> => {
    let queryRes!:T[]
     await pool
      .query(this.sql, this.val)
      .then((res: QueryResult<T>) => {
        queryRes = res.rows
      })
      .catch((err: DatabaseError) => {
         throw new Error(err.message)
      });
      return queryRes
      
  };
}
