import { Inject, Injectable } from "@nestjs/common";
import { pg_conn } from "../database/provider-name";
import { PoolClient } from "pg";
import { query_builder } from "../xander_qb/provider-name";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { Response } from "express";
import { CreateBrokerAccountDto } from "./dto/create-broker_account.dto";
import { broker_accounts, BrokerAccount } from "../entities/BrokerAccount";
import { modifiedRequest } from "../shared/types/types";
import { BrokerAccountDoesNotExist, BrokerAccountWithNameAlreadyExists } from "../exceptions/broker_account.exceptions";
import { UnexpectedServerError } from "../exceptions/unexpected-errors.exceptions";
import { SessionService } from "../authentication/session/session.service";
import { unix } from "dayjs";

@Injectable()
export class BrokerAccountService {

  constructor(@Inject(pg_conn) private db:PoolClient,
              @Inject(query_builder) private qb:QueryBuilder) {
  }


  async createBrokerAccount(req: modifiedRequest,
                            res:Response,
                            createAccountDto:CreateBrokerAccountDto):Promise<Response>{
    const {user_id,username} = req.session
    const {name} = createAccountDto

    if(!await this.doesBrokerAccountWithNameAlreadyExist(name,user_id)) return

    try {
      const [insertSql, values] = this.qb.ofTable(broker_accounts).insert<BrokerAccount>(
        {...createAccountDto,user_id })
      const {rows} = await this.db.query(insertSql, values)
      const createdAccount = rows[0]
      return res.status(201).send({error:'', result: [createdAccount]})
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async getBrokerAccountById(res:Response, id:number):Promise<Response>{
    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>({where:{id}})

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new BrokerAccountDoesNotExist(id)

    const brokerAccount = rows[0]
    return res.status(200).send({error:'', result: [brokerAccount]})

  }

  async deleteBrokerAccountById(res:Response, id:number):Promise<Response>{
    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>({where:{id}})
    // TODO: apply middlewares to check if aleady exist

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new BrokerAccountDoesNotExist(id)

    try {
      const deleteSql = this.qb.ofTable(broker_accounts).delete<BrokerAccount>({where:{id}})
      await this.db.query(deleteSql)
      return res.status(200).end()
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async updateBrokerAccountById(res:Response, newAccount:Partial<BrokerAccount>, id:number):Promise<Response>{
    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>({where:{id}})
    // TODO: apply middlewares to check if aleady exist

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new BrokerAccountDoesNotExist(id)

    try {
      const updateSql = this.qb.ofTable(broker_accounts).update<BrokerAccount>({ where: { id }, set: newAccount })
      const { rows } = await this.db.query(updateSql)
      const updatedBrokerAccount = rows[0]
      return res.status(200).send({ error: '', result: [updatedBrokerAccount] })
    }
    catch (e) {
      throw new UnexpectedServerError()
    }

  }

  private async doesBrokerAccountWithNameAlreadyExist(name: string, user_id: number): Promise<undefined | boolean>{

    const selectSql = this.qb.ofTable(broker_accounts).select<BrokerAccount>({where:{name, user_id}})
    try {
      const {rows} = await this.db.query(selectSql)
      if(!rows.length) return true
    }catch (e) {
      throw new UnexpectedServerError()
    }
    throw new BrokerAccountWithNameAlreadyExists(name,user_id)
  }



}
