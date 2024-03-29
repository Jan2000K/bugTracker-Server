import { PoolClient } from "pg"

const { Pool } = require("pg")

//export a pool with connection data to database
export const pool: PoolClient = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})
