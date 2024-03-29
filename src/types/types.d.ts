import { FieldDef, QueryResult, QueryResultRow } from "pg"

import { Request, Response } from "express"
import session, { Session, SessionData } from "express-session"

declare global {
    type generatedUpdate = {
        sql: string
        values: any[]
    }

    interface jsonResponse {
        err: boolean
        data: string | QueryResultRow | null
    }

    type Send<T = Response> = (body?: jsonResponse) => T

    interface CustomResponse extends Response {
        json: Send<this>
    }

    interface project extends projectNoStats {
        bugStats: bugStats
    }

    interface projectNoStats {
        id: number
        name: string
        bugs: bug[]
    }

    interface bug {
        id: number
        name: string
        status: bugStatus
        severity: bugSeverity
        note: string | null
    }

    interface projectQueryReturn {
        projectID: number
        projectName: string
        bugID: number
        bugName: string
        severity: bugSeverity
        status: bugStatus
        note: null | string
    }

    interface bugStats {
        open: number
        highPriority: number
        mediumPriority: number
        lowPriority: number
    }

    type bugStatus = "Open" | "Testing" | "Closed"

    type bugSeverity = "Low" | "Medium" | "High"

    interface userNoPassword {
        userID: number
        username: string
    }

    interface user extends userNoPassword {
        password: string
    }
}
declare module "express-session" {
    interface SessionData {
        userID: number
    }
}
interface idArrayRequest extends Request {
    idArray?: number[]
}
