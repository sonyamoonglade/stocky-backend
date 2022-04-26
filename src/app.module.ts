import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { BrokerAccountController } from "./broker_account/broker_account.controller";
import { BrokerAccountService } from "./broker_account/broker_account.service";
import { BrokerAccountModule } from "./broker_account/broker_account.module";
import { DbModule } from "./database/db.module";
import { QueryBuilderModule } from "./xander_qb/qb.module";
import { AuthenticationModule } from "./authentication/authentication.module";
import { SessionMiddleware } from "./authentication/middlewares/session.middleware";
import { UsersController } from "./users/users.controller";


@Module({
  imports: [UsersModule, BrokerAccountModule,DbModule,QueryBuilderModule, AuthenticationModule],
  controllers: [BrokerAccountController],
  providers: [BrokerAccountService],

})
export class AppModule implements NestModule{
  configure(consumer:MiddlewareConsumer){
    consumer.apply(SessionMiddleware)
      .exclude(
        {path: '/api/v1/users/createUser', method:RequestMethod.POST}
      )
      .forRoutes(
        UsersController,
        BrokerAccountController
      )
  }
}
