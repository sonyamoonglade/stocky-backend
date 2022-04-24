import { HttpException, HttpStatus } from "@nestjs/common";


export class UnexpectedServerError extends HttpException{

  constructor() {
    super('unexpected server error', HttpStatus.BAD_GATEWAY);
  }

}