import { Inject, Injectable, Req } from "@nestjs/common";

import { PoolClient } from "pg";
import * as bcrypt from "bcrypt";
import { Request, Response } from "express";

import { pg_conn } from "../database/provider-name";
import { query_builder } from "../xander_qb/provider-name";
import {
  EmailHasBeenAlreadyTakenException,
  InvalidPasswordException,
  UserDoesNotExistException
} from "../exceptions/user.exceptions";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { User } from "../entities/User";
import { UnexpectedServerError } from "../exceptions/unexpected-errors.exceptions";
import { LoginUserDto } from "./dto/login-user.dto";
import { SessionService } from "../authentication/session/session.service";
import { UsersRepository } from "./users.repository";
import convertToUsername from "../shared/utils/utils";
import { modifiedRequest } from "../shared/types/types";

require('dotenv').config()

@Injectable()
export class UsersService {

  private SALT_ROUNDS: number = Number(process.env.SALT_ROUNDS)


  constructor(@Inject(pg_conn) private db:PoolClient,
              @Inject(query_builder) private qb:QueryBuilder,
              private sessionService:SessionService,
              private usersRepository:UsersRepository) {

  }
  async login(res:Response, loginUserDto:LoginUserDto){

    return this.loginWithEmail(loginUserDto,res)

  }

  async logout(req:modifiedRequest, res:Response){
    const {session} = req
    await this.sessionService.deAttachCookieFromResponse(res,session.session_id)
    res.status(200).end()
  }

  async authMe(req:modifiedRequest, res:Response) {
    res.status(200).send({ error: '', result:['access']})
  }

  async createUser(user:CreateUserDto, res:Response):Promise<Response | User>{

    const emailTakenResult = await this.hasEmailBeenAlreadyTaken(user.email)
    if(emailTakenResult) throw new EmailHasBeenAlreadyTakenException()

    try {

      const passwordHash = await bcrypt.hash(user.password,this.SALT_ROUNDS)
      const createdUser = await this.usersRepository.save({...user,password: passwordHash})
      const {id: user_id, firstname, lastname} = createdUser

      const username = convertToUsername(firstname,lastname)

      const SID:string = await this.sessionService.createSession(user_id,username)
      await this.sessionService.attachCookieToResponse(res,SID)

      return res.status(201).send({error: '', result: [createdUser]})
    }
    catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async getUserById(id:number, res:Response):Promise<Response>{

    const user = await this.doesUserEvenExist(id)

    return res.status(200).send({error:'', result:[user]})

  }

  async deleteUserById(id: number, res:Response):Promise<Response>{

    await this.doesUserEvenExist(id)

    try {
      await this.usersRepository.delete(id)
      return res.status(204).end()
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async updateUser(id:number,res:Response, newUser:Partial<User>){

    await this.doesUserEvenExist(id)

    try {
      const updatedUser = await this.usersRepository.update(id,newUser)
      return res.status(200).send({error:'', result:[updatedUser]})
    }catch (e) {
      throw new UnexpectedServerError()
    }
  }

  async getAllUsers(res: Response, @Req() req: Request){

    const users = await this.usersRepository.getAll()

    return res.status(200).send({error:'', result: users})
  }

  async loginWithEmail(dto: LoginUserDto, res: Response): Promise<Response>{
    const {email, password: inputPassword} = dto
    const {
      id: user_id,
      firstname,
      lastname,
      password: hash_password
    } = (await this.usersRepository.get({where:{email}}))[0]

    const username = convertToUsername(firstname,lastname)

    const comparePasswordResult = await bcrypt.compare(inputPassword, hash_password)
    if(!comparePasswordResult) throw new InvalidPasswordException()

    const SID:string = await this.sessionService.createSession(user_id,username)
    await this.sessionService.attachCookieToResponse(res, SID)

    return res.status(200).end()
  }

  async hasEmailBeenAlreadyTaken(email: string):Promise<boolean>{
    const users = await this.usersRepository.get({ where: { email }})

    return !!users.length
  }

  async doesUserEvenExist(id: number):Promise<void | undefined | User>{
    const user = await this.usersRepository.getById(id)
    if(!user) {
      throw new UserDoesNotExistException(id);
    }
    return user
  }




}
