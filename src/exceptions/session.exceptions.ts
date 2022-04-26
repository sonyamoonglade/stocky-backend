import { HttpException, HttpStatus } from "@nestjs/common";


export class SessionHasExpiredException extends HttpException{

  constructor() {
    super('session has expired', HttpStatus.UNAUTHORIZED);
  }

}

export class SessionIdHasNotBeenProvidedException extends HttpException{

  constructor() {
    super('session id has not been provided', HttpStatus.UNAUTHORIZED);
  }
}
