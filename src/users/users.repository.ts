import { Repository } from "../shared/abstract/absctract.repository";
import { User, users } from "../entities/User";
import { Inject } from "@nestjs/common";
import { query_builder } from "../xander_qb/provider-name";
import { filter, QueryBuilder } from "../xander_qb/QueryBuilder";
import { pg_conn } from "../database/provider-name";
import { PoolClient } from "pg";


export class UsersRepository implements Repository<User>{

  constructor(@Inject(query_builder) private qb:QueryBuilder, @Inject(pg_conn) private db:PoolClient) {
  }

  async delete(id: number): Promise<void | undefined> {
    const deleteSql = this.qb.ofTable(users).delete<User>({where:{id}})
    await this.db.query(deleteSql)
  }

  async getById(id: number | string): Promise<User | undefined> {
    const selectSql = this.qb.ofTable(users).select<User>({where:{id: id as number}})
    const {rows} = await this.db.query(selectSql)
    return rows[0] as unknown as (User | undefined)
  }

  async save(dto: any): Promise<User | undefined> {
    const [insertSql,insertValues] = this.qb.ofTable(users).insert<User>(dto)
    const {rows}  = await this.db.query(insertSql,insertValues)
    return rows[0] as unknown as User

  }

  async update(id: number, updated: Partial<User | undefined>): Promise<User> {
    const updateSql = this.qb.ofTable(users).update<User>({where:{id:id},set:updated})
    const {rows} = await this.db.query(updateSql)
    return rows[0]
  }


  async getAll():Promise<User[]>{
    const selectSql = this.qb.ofTable(users).select<User>()
    const {rows} = await this.db.query(selectSql)
    return rows
  }

  async get(expression: filter<User>): Promise<User> {
    const selectSql = this.qb.ofTable(users).select<User>(expression)
    const {rows} = await this.db.query(selectSql)
    return rows[0] as unknown as User
  }



}