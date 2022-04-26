import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "../session/session.service";
import { SessionHasExpiredException, SessionIdHasNotBeenProvidedException } from "../../exceptions/session.exceptions";

@Injectable()
export class SessionMiddleware implements NestMiddleware{

  constructor(private sessionService:SessionService) {
  }

  async use(req: any, res: Response, next: (error?: any) => void): Promise<any> {

    const {SID} = req.cookies

    if(!SID){
      throw new SessionIdHasNotBeenProvidedException()
    }

    const session = await this.sessionService.doesSessionExistAndIsValid(SID)

    if(!session) throw new SessionHasExpiredException()

    req.session = session

    return next()

  }

}