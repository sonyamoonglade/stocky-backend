import { HttpException, HttpStatus } from "@nestjs/common";


export class SessionHasExpiredException extends HttpException{

  constructor() {
    super('session has expired', HttpStatus.UNAUTHORIZED);
  }

}
