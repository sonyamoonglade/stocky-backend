import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../../database/provider-name";
import { PoolClient } from "pg";
import { query_builder } from "../../xander_qb/provider-name";
import { filter, QueryBuilder } from "../../xander_qb/QueryBuilder";
import { Session, sessions } from "../../entities/Session";
import { Repository } from "../../shared/abstract/absctract.repository";


@Injectable()
export class SessionRepository implements Repository<Session>{

  constructor(@Inject(pg_conn) private db:PoolClient, @Inject(query_builder) private qb: QueryBuilder) {
  }

  async delete(id: number | string): Promise<void> {
    const deleteSql = this.qb.ofTable(sessions).delete<Session>({where:{session_id: id as string}})
    await this.db.query(deleteSql)
  }

  async getById(id: string): Promise<Session> {
    return undefined
  }

  async save(dto: Session): Promise<Session> {
    try {
      const [insertSql, values] = this.qb.ofTable(sessions).insert<Session>(dto)
      const {rows} = await this.db.query(insertSql,values)
      return rows[0] as unknown as Session
    }catch (e) {
      return undefined
    }

  }

  async update(id: number, updated: Partial<Session>): Promise<Session> {
    return undefined
  }

  get(expression: filter<Session>): Promise<Session[]> {
    return Promise.resolve(undefined);
  }




}