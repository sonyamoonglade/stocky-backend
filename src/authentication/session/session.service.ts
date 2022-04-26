import { Inject, Injectable } from "@nestjs/common";
import { QueryBuilder } from "../../xander_qb/QueryBuilder";
import { PoolClient } from "pg";
import { Session, sessions } from "../../entities/Session";
import * as dayjs from "dayjs";
import { query_builder } from "../../xander_qb/provider-name";
import { pg_conn } from "../../database/provider-name";
import { SessionRepository } from "./session.repository";
import { Response } from "express";
import { UnexpectedServerError } from "../../exceptions/unexpected-errors.exceptions";

const SimpleCrypto = require("simple-crypto-js").default

@Injectable()
export class SessionService {

  private SECRET = process.env.HASH_SECRET

  private crypt = new SimpleCrypto(this.SECRET)


  constructor(@Inject(query_builder) private qb:QueryBuilder,
              @Inject(pg_conn) private db:PoolClient,
              private sessionRepository:SessionRepository) {}


  async createSession(user_id: number, username: string):Promise<string>{

    const currentTime = dayjs()
    const nextDayTTL = currentTime.add(1,'day').toString()

    const sessionId = currentTime.unix().toString()

    try {
      const encryptedSID = this.crypt.encrypt(sessionId)

      const newSession: Session = {
        session_id: sessionId,
        user_id,
        ttl: nextDayTTL,
        username,
      }

      await this.sessionRepository.save(newSession)

      return encryptedSID
    }catch (e) {
      throw new UnexpectedServerError()
    }

  }

  async attachCookieToResponse(res:Response,SID: string): Promise<void>{

    res.cookie('SID',SID,{
      httpOnly: true,
      sameSite: true
    })

  }

  async deAttachCookieFromResponse(res:Response, SID: string): Promise<void>{
    res.clearCookie('SID')
    await this.destroySession(SID)
  }

  async doesSessionExistAndIsValid(SID: string):Promise<Session | undefined>{

    const sessionId = this.crypt.decrypt(SID).toString()

    const selectQuery = this.qb.ofTable(sessions).select<Session>({where:{session_id: sessionId}})

    const {rows} = await this.db.query(selectQuery)
    const session = rows[0] as Session

    const sessionTTL = dayjs(session.ttl).unix()
    const currentTime = dayjs().unix()

    if(sessionTTL - currentTime > 0){
      return session
    }

    return undefined

  }

  async destroySession(SID: string):Promise<void>{
    await this.sessionRepository.delete(SID)
  }




}