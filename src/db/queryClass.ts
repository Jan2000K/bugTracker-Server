import { DatabaseError, PoolClient, QueryResult } from "pg";


const pool: PoolClient = require("../pool");

export class pgQuery {
  sql: string;
  val: Array<string | number>;
  constructor(sqlStatement: string, values: Array<any>) {
    this.sql = sqlStatement;
    this.val = values;
  }
  exec = async (): Promise<queryReturn> => {
    let queryRes!: queryReturn;
    await pool
      .query(this.sql, this.val)
      .then((res: QueryResult) => {
        if (res.rowCount > 0) {
          queryRes = {
            err: false,
            data: res.rows,
          };
        } else {
          queryRes = {
            err: false,
            data: null,
          };
        }
      })
      .catch((err: DatabaseError) => {
        queryRes = {
          err: true,
          data: err,
        };
      });
    return queryRes;
  };
}
