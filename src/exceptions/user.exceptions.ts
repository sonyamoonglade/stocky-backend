import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";


export class EmailHasBeenAlreadyTakenException extends HttpException{
  constructor() {
    super('User with such email already exists!', HttpStatus.CONFLICT);
  }
}

export class UserDoesNotExistException extends HttpException{

  constructor(id: number) {
      super(`user with id ${id} does not exist`,HttpStatus.BAD_REQUEST);
  }
}


export class InvalidPasswordException extends HttpException{
  constructor() {
    super('invalid password', HttpStatus.BAD_REQUEST);
  }
}