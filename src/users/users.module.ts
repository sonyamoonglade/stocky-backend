import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from "../database/db.module";
import { QueryBuilderModule } from "../xander_qb/qb.module";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports:[DbModule, QueryBuilderModule],
  exports:[UsersService]
})
export class UsersModule {}
