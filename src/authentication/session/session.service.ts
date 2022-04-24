import { Inject, Injectable } from "@nestjs/common";
import { QueryBuilder } from "../../xander_qb/QueryBuilder";
import { PoolClient } from "pg";
import { Session } from "../../entities/Session";
import * as dayjs from 'dayjs'
import { query_builder } from "../../xander_qb/provider-name";
import { pg_conn } from "../../database/provider-name";
const SimpleCrypto = require("simple-crypto-js").default

@Injectable()
export class SessionService {

  private SECRET = process.env.HASH_SECRET

  private crypt = new SimpleCrypto(this.SECRET)


  constructor(@Inject(query_builder)private qb:QueryBuilder, @Inject(pg_conn)private db:PoolClient) {

  }


  async createSession(user_id: number, username: string){

    const currentTime = dayjs()
    const nextDayUnix = currentTime.add(1,'day').unix()

    const encryptedSID = this.crypt.encrypt(currentTime.toString())

    console.log(encryptedSID);



    const newSession: Session = {
      id: encryptedSID,
      user_id,
      ttl: nextDayUnix,
      username,
    }


  }

  async isSessionExistAndValid(SID: string):Promise<Session | undefined>{

      const selectQuery = this.qb.select<Session>({where:{id:SID}})
      const {rows} = await this.db.query(selectQuery)

      const session = rows[0] as Session

      const ttl = session.ttl
      const currentTime = Date.now()

      if(Number(ttl) - currentTime > 0){
        return session
      }

      return undefined






  }




}