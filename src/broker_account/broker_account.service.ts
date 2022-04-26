import { Inject, Injectable } from "@nestjs/common";

import { PoolClient } from "pg";
import { Response } from "express";

import { pg_conn } from "../database/provider-name";
import { query_builder } from "../xander_qb/provider-name";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { CreateBrokerAccountDto } from "./dto/create-broker_account.dto";
import { BrokerAccount } from "../entities/BrokerAccount";
import { modifiedRequest } from "../shared/types/types";
import { BrokerAccountDoesNotExist, BrokerAccountWithNameAlreadyExists } from "../exceptions/broker_account.exceptions";
import { UnexpectedServerError } from "../exceptions/unexpected-errors.exceptions";
import { BrokerAccountRepository } from "./broker_account.repository";

@Injectable()
export class BrokerAccountService {

  constructor(@Inject(pg_conn) private db:PoolClient,
              @Inject(query_builder) private qb:QueryBuilder,
              private brokerAccountRepository:BrokerAccountRepository) {
  }


  async createBrokerAccount(req: modifiedRequest,
                            res:Response,
                            createAccountDto:CreateBrokerAccountDto):Promise<Response>{

    const {user_id} = req.session
    const {name} = createAccountDto

    await this.doesBrokerAccountWithNameAlreadyExist(name, user_id)

    try {
      const createdAccount = await this.brokerAccountRepository.save(createAccountDto, user_id)
      return res.status(201).send({error:'', result: [createdAccount]})
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async getBrokerAccountById(res:Response, id:number):Promise<Response>{
    try {
      const brokerAccount = await this.brokerAccountRepository.getById(id)
      return res.status(200).send({error:'', result: [brokerAccount]})
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async deleteBrokerAccountById(res:Response, id:number):Promise<Response>{

    await this.doesBrokerAccountEvenExist(id)

    try {
      await this.brokerAccountRepository.delete(id)
      return res.status(200).end()
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }
  // TODO: implement user_id search not just id
  async updateBrokerAccountById(res:Response, newAccount:Partial<BrokerAccount>, accountId:number):Promise<Response>{




    await this.doesBrokerAccountEvenExist(accountId)

    try {
      const updatedBrokerAccount = await this.brokerAccountRepository.update(accountId,newAccount)
      return res.status(200).send({ error: '', result: [updatedBrokerAccount] })
    }
    catch (e) {
      throw new UnexpectedServerError()
    }

  }

  private async doesBrokerAccountWithNameAlreadyExist(name: string, user_id: number): Promise<void | undefined>{

    const brokerAccounts = await this.brokerAccountRepository.get({where:{name,user_id}})
    if(brokerAccounts.length) throw new BrokerAccountWithNameAlreadyExists(name,user_id)

    return
  }

  private async doesBrokerAccountEvenExist(id: number): Promise<void | undefined | BrokerAccount>{
    const brokerAccount = this.brokerAccountRepository.getById(id)
    if(!brokerAccount) throw new BrokerAccountDoesNotExist(id)
  }


}
