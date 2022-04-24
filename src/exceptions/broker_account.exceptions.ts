import { HttpException, HttpStatus } from "@nestjs/common";


export class BrokerAccountWithNameAlreadyExists extends HttpException {
  constructor(name:string, user_id: number) {
    super(`user with id ${user_id} already has broker account with name ${name}`, HttpStatus.CONFLICT);
  }
}


export class BrokerAccountDoesNotExist extends HttpException{
  constructor(id: number) {
    super(`broker account with id ${id} does not exist`, HttpStatus.CONFLICT);
  }
}