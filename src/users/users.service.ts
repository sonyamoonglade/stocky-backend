import { HttpException, HttpService, HttpStatus, Inject, Injectable } from "@nestjs/common";

import { PoolClient } from "pg";
import * as bcrypt from 'bcrypt'
require('dotenv').config()

import { pg_conn } from "../database/provider-name";
import { query_builder } from "../xander_qb/provider-name";
import { UserAlreadyExistsException, UserDoesNotExistException } from "../exceptions/user-exceptions";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { User,users } from "../entities/User";
import { Response } from "express";

@Injectable()
export class UsersService {

  private SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS)
  private HASH_SECRET: string = process.env.HASH_SECRET


  constructor(@Inject(pg_conn) private db:PoolClient, @Inject(query_builder) private qb:QueryBuilder) {

  }


  async createUser(user:CreateUserDto, res:Response):Promise<Response>{

    const userExists = await this.isUserAlreadyExist(user)
    if(userExists) throw new UserAlreadyExistsException()

    try {

      const passwordHash = await bcrypt.hash(user.password,this.SALT_ROUNDS)
      const newUser:User = {
        ...user,
        password: passwordHash
      }

      const [insertSql,insertValues] = this.qb.ofTable(users).insert<User>(newUser)
      const {rows} = await this.db.query(insertSql,insertValues)
      const createdUser = rows[0]
      return res.status(201).send({error: '', result: [createdUser]})
    }catch (e) {
      return res.status(500).send({error:'server error', result:[]})

    }





  }

  async getUserById(id:number, res:Response):Promise<Response>{

    const selectSql = this.qb.ofTable(users).select<User>({where:{id}})

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new UserDoesNotExistException(id)

    const user = rows[0]

    return res.status(200).send({error:'', result:[user]})

  }

  async deleteUserById(id: number, res:Response):Promise<Response>{

    const selectSql = this.qb.ofTable(users).select<User>({where:{id}})

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new UserDoesNotExistException(id)

    try {
      const deleteSql = this.qb.ofTable(users).delete<User>({where:{id}})
      await this.db.query(deleteSql)
      return res.status(204).send({error:'',result:[]})
    }catch (e) {
      return res.status(500).send({error:'server error', result:[]})

    }

  }

  async updateUser(id:number,res:Response, newUser:Partial<User>){

    const selectSql = this.qb.ofTable(users).select<User>({where:{id}})
    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new UserDoesNotExistException(id)

    try {
      const updateSql = this.qb.ofTable(users).update<User>({where:{id:id},set:newUser})
      const {rows} = await this.db.query(updateSql)
      const updatedUser = rows[0]
      return res.status(200).send({error:'', result:[updatedUser]})

    }catch (e) {
      return res.status(500).send({error:'server error', result:[]})
    }





  }




  private async isUserAlreadyExist(user:CreateUserDto):Promise<boolean>{
    const sql = this.qb.ofTable(users).select<User>({where:{email: user.email}})
    const { rowCount } = await this.db.query(sql)
    return rowCount > 0
  }





}
