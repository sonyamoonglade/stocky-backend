import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { CreateBrokerAccountDto } from "./create-broker_account.dto";
import { BrokerAccountService } from "./broker_account.service";
import { BrokerAccount } from "../entities/BrokerAccount";

@Controller('/api/v1/broker-accounts')
export class BrokerAccountController {

  constructor(private brokerAccountService:BrokerAccountService) {
  }
    // TODO: apply guards and logic with sessions to modify req
    @Post('/createBrokerAccount')
    createBrokerAccount(@Res() res: Response,
                      @Req() req,
                      @Body() createBrokerAccountDto:CreateBrokerAccountDto) {
      return this.brokerAccountService.createBrokerAccount(req,res,createBrokerAccountDto)
    }
    @Get('/getBrokerAccountById/:id')
    getBrokerAccountById(@Res() res:Response, @Param('id') id:number){
      return this.brokerAccountService.getBrokerAccountById(res,id)
    }
    @Delete('/deleteBrokerAccountById/:id')
    deleteBrokerAccount(@Res() res:Response, @Param('id') id: number){
      return this.brokerAccountService.deleteBrokerAccountById(res,id)
    }

    @Put("/updateBrokerAccount/:id")
    updateBrokerAccount(@Res() res: Response,
                        @Body() newAccount: Partial<BrokerAccount>,
                        @Param("id") id: number) {
      return this.brokerAccountService.updateBrokerAccountById(res, newAccount, id);
    }






}
