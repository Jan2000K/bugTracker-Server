import { FieldDef, QueryResult, QueryResultRow } from "pg";

import { Request, Response } from "express";
import session, { Session, SessionData } from "express-session";

declare global {
  type queryReturn = {
    err: boolean;
    data: QueryResultRow | null;
  };

  type generatedUpdate = {
    sql: string;
    values: any[];
  };

  interface jsonResponse {
    err: boolean;
    data: string | QueryResultRow | null;
  }

  type Send<T = Response> = (body?: jsonResponse) => T;

  interface CustomResponse extends Response {
    json: Send<this>;
  }

  interface project{
    id:number,
    name:string,
    bugs:bug[],
    bugStats:bugStats
}

interface bug{
    id:number,
    name:string,
    status:bugStatus,
    severity:bugSeverity,
    note:string,
}

interface projectQueryReturn{
  projectID:number,
  projectName:string,
  bugID:number,
  bugName:string,
  severity:bugSeverity,
  status:bugStatus,
  note:null | string
}



interface bugStats{
    open:number,
    highPriority:number,
    mediumPriority:number,
    lowPriority:number
}

type bugStatus = "Open"  | "Testing" | "Closed"

type bugSeverity = "Low" | "Medium" | "High"



  declare module "express-session" {
    interface SessionData {
      adminID: number;
      adminType: adminRoles;
      memberID: number;
    }
  }
}

export default global