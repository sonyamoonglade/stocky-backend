import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { pg_conn } from "./provider-name";
require('dotenv').config()

const dbProvider= {
  provide: pg_conn,
  useValue: new Pool({
    user:process.env.DB_USERNAME,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),

  })
}


@Module({
  providers:[dbProvider],
  exports:[dbProvider]
})

export class DbModule{}