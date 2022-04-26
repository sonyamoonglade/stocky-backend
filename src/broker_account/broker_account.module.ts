import { Module } from '@nestjs/common';
import { BrokerAccountController } from "./broker_account.controller";
import { QueryBuilderModule } from "../xander_qb/qb.module";
import { DbModule } from "../database/db.module";
import { BrokerAccountService } from "./broker_account.service";
import { BrokerAccountRepository } from "./broker_account.repository";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
  controllers:[BrokerAccountController],
  providers:[BrokerAccountService,BrokerAccountRepository],
  imports:[DbModule, QueryBuilderModule,AuthenticationModule],
})
export class BrokerAccountModule {}
