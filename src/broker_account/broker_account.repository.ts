import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "../shared/abstract/absctract.repository";
import { broker_accounts, BrokerAccount } from "../entities/BrokerAccount";
import { query_builder } from "../xander_qb/provider-name";
import { filter, QueryBuilder } from "../xander_qb/QueryBuilder";
import { pg_conn } from "../database/provider-name";
import { PoolClient } from "pg";


@Injectable()
export class BrokerAccountRepository implements Repository<BrokerAccount>{

  constructor(@Inject(query_builder) private qb:QueryBuilder, @Inject(pg_conn) private db:PoolClient) {
  }

  async delete(id: number): Promise<void | undefined> {
    const deleteSql = this.qb.ofTable(broker_accounts).delete<BrokerAccount>({where:{id}})
    await this.db.query(deleteSql)
  }

  async getById(id: number | string): Promise<BrokerAccount | undefined> {
    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>({where:{id: id as number}})

    const {rows} = await this.db.query(selectSql)

    return rows[0] as unknown as BrokerAccount | undefined
  }

  async save(dto: any, user_id): Promise<BrokerAccount | undefined> {
    const [insertSql, values] = this.qb.ofTable(broker_accounts).insert<BrokerAccount>(
      {...dto,user_id })
    const {rows} = await this.db.query(insertSql, values)
    return rows[0] as unknown as BrokerAccount
  }

  async update(id: number, updated: Partial<BrokerAccount | undefined>): Promise<BrokerAccount> {
    const updateSql = this.qb.ofTable(broker_accounts).update<BrokerAccount>({ where: { id }, set: updated })
    const { rows } = await this.db.query(updateSql)
    return rows[0] as unknown as BrokerAccount
  }

  async get(expression: filter<BrokerAccount>):Promise<BrokerAccount[] | undefined>{
    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>(expression)
    const {rows} = await this.db.query(selectSql)
    return rows as BrokerAccount []

  }




}