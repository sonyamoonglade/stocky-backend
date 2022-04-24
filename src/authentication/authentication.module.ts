import { Module } from "@nestjs/common";
import { SessionService } from "./session/session.service";
import { DbModule } from "../database/db.module";
import { QueryBuilderModule } from "../xander_qb/qb.module";
import { SessionMiddleware } from "./middlewares/session.middleware";


@Module({
  providers:[SessionService,SessionMiddleware],
  exports:[SessionMiddleware, SessionService],
  imports: [DbModule, QueryBuilderModule]
})

export class AuthenticationModule {}