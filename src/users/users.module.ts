import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from "../database/db.module";
import { QueryBuilderModule } from "../xander_qb/qb.module";
import { AuthenticationModule } from "../authentication/authentication.module";
import { SessionService } from "../authentication/session/session.service";
import { UsersRepository } from "./users.repository";

@Module({
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  imports:[DbModule, QueryBuilderModule, AuthenticationModule],
  exports:[UsersService]
})
export class UsersModule {}
