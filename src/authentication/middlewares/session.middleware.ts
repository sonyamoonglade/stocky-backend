import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "../session/session.service";
import { SessionHasExpiredException } from "../../exceptions/session.exceptions";

@Injectable()
export class SessionMiddleware implements NestMiddleware{

  constructor(private sessionService:SessionService) {
  }

  use(req: any, res: Response, next: (error?: any) => void): any {

    const {SID} = req.cookies

    if(!SID){
      return next()
    }

    const session = this.sessionService.isSessionExistAndValid(SID)

    if(!session) throw new SessionHasExpiredException()

    req.session = session

    return next()

  }

}