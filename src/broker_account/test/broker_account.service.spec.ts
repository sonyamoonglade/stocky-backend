import { Test } from "@nestjs/testing";
import { DbModule } from "../../database/db.module";
import { QueryBuilderModule } from "../../xander_qb/qb.module";
import { AuthenticationModule } from "../../authentication/authentication.module";
import { BrokerAccountService } from "../broker_account.service";
import { BrokerAccountRepository } from "../broker_account.repository";
import { BrokerAccount } from "../../entities/BrokerAccount";
import { CurrencyType } from "../../shared/types/types";
import { BrokerAccountWithNameAlreadyExists } from "../../exceptions/broker_account.exceptions";


describe('broker account service test', () => {

  let brokerAccountService: BrokerAccountService
  let brokerAccountRepository: BrokerAccountRepository
  let brokerAccounts: BrokerAccount[]

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BrokerAccountService, BrokerAccountRepository],
      imports: [DbModule, QueryBuilderModule, AuthenticationModule]
    }).compile();
    brokerAccountRepository = moduleRef.get(BrokerAccountRepository)
    brokerAccountService = moduleRef.get(BrokerAccountService)
    brokerAccounts = [new BrokerAccount(0,0,"first",0,CurrencyType.USD,1)]


  })


  describe('helper methods test', () => {

    it('should return false. Broker account does not exist with name', async() => {

      //given
      jest.spyOn(brokerAccountRepository,'get').mockImplementation(() => Promise.resolve([]))

      //actual
      const actual = await brokerAccountService.doesBrokerAccountWithNameAlreadyExist('second',0)

      expect(actual).toBeFalsy()


      //assert
    })
    it('should throw exception of BrokerAccAlreadyExist', async () => {
      jest.spyOn(brokerAccountRepository,'get').mockImplementation(() => Promise.resolve(brokerAccounts))
      try {
        const actual = await brokerAccountService.doesBrokerAccountWithNameAlreadyExist('first',0)
      }catch (e) {
        expect(e).toBeInstanceOf(BrokerAccountWithNameAlreadyExists)
      }


    })
  })

})