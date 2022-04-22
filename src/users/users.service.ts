import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { pg_conn } from "../database/provider-name";
import { PoolClient } from "pg";
import { UserAlreadyExistsException } from "../exceptions/user-exceptions";
import { query_builder } from "../xander_qb/provider-name";
import { QueryBuilder } from "../xander_qb/QueryBuilder";
import { User,users } from "../entities/User";

@Injectable()
export class UsersService {



  constructor(@Inject(pg_conn) private db:PoolClient, @Inject(query_builder) private qb:QueryBuilder) {

  }


  async createUser(user:CreateUserDto){

    const userExists = await this.userAlreadyExists(user)
    if(userExists) throw new UserAlreadyExistsException()




  }


  private async userAlreadyExists(user:CreateUserDto):Promise<boolean>{
    const sql = this.qb.ofTable(users).select<User>({where:user})
    const { rowCount } = await this.db.query(sql)
    return rowCount > 0
  }



}
