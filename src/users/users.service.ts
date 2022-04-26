import { HttpException, HttpService, HttpStatus, Inject, Injectable, Req, Res } from "@nestjs/common";

import { PoolClient } from "pg";
import * as bcrypt from 'bcrypt'
require('dotenv').config()

import { pg_conn } from "../database/provider-name";
import { query_builder } from "../xander_qb/provider-name";
import { UserAlreadyExistsException, UserDoesNotExistException } from "../exceptions/user.exceptions";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { User,users } from "../entities/User";
import { Request, Response } from "express";
import { UnexpectedServerError } from "../exceptions/unexpected-errors.exceptions";
import { LoginUserDto } from "./dto/login-user.dto";
import { SessionService } from "../authentication/session/session.service";
import convertToUsername from "../shared/utils/utils";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {

  private SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS)


  constructor(@Inject(pg_conn) private db:PoolClient,
              @Inject(query_builder) private qb:QueryBuilder,
              private sessionService:SessionService,
              private usersRepository:UsersRepository) {

  }

  async login(res:Response, loginUserDto:LoginUserDto){

  }

  async createUser(user:CreateUserDto, res:Response):Promise<Response | User>{

    const userExists = await this.isUserAlreadyExist(user)
    if(userExists) throw new UserAlreadyExistsException()

    try {
      const passwordHash = await bcrypt.hash(user.password,this.SALT_ROUNDS)
      const createdUser = await this.usersRepository.save({...user,password: passwordHash})
      const username = convertToUsername(createdUser.firstname,createdUser.lastname)
      // TODO: stick session to user and return set-cookie
      const SID:string = await this.sessionService.createSession(createdUser.id,username)
      await this.sessionService.attachCookieToResponse(res,SID)

      return res.status(201).send({error: '', result: [createdUser]})
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async getUserById(id:number, res:Response):Promise<Response>{

    const user = await this.usersRepository.getById(id)
    if(!user) throw new UserDoesNotExistException(id)

    return res.status(200).send({error:'', result:[user]})

  }

  async deleteUserById(id: number, res:Response):Promise<Response>{
    // TODO: apply middlewares to check if aleady exist
    const selectSql = this.qb.ofTable(users).select<User>({where:{id}})

    const {rows} = await this.db.query(selectSql)
    if(!rows[0]) throw new UserDoesNotExistException(id)

    try {
      const deleteSql = this.qb.ofTable(users).delete<User>({where:{id}})
      await this.db.query(deleteSql)
      return res.status(204).send({error:'',result:[]})
    }catch (e) {
      throw new UnexpectedServerError()
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
      throw new UnexpectedServerError()
    }





  }

  async getAllUsers(res: Response, @Req() req: Request){
    const selectSql = this.qb.ofTable(users).select<User>()
    const {rows} = await this.db.query(selectSql)


    return res.status(200).send({error:'', result: rows})
  }




  private async isUserAlreadyExist(user:CreateUserDto):Promise<boolean>{
    const sql = this.qb.ofTable(users).select<User>({where:{email: user.email}})
    const { rowCount } = await this.db.query(sql)
    return rowCount > 0
  }





}
