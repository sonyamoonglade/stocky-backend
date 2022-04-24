import { Module } from '@nestjs/common';
import { BrokerAccountController } from "./broker_account.controller";
import { QueryBuilderModule } from "../xander_qb/qb.module";
import { DbModule } from "../database/db.module";
import { BrokerAccountService } from "./broker_account.service";

@Module({
  controllers:[BrokerAccountController],
  providers:[BrokerAccountService],
  imports:[DbModule, QueryBuilderModule]
})
export class BrokerAccountModule {}
