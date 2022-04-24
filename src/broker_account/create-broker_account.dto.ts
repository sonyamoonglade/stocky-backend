import { CurrencyType } from "../shared/types/types";

export class CreateBrokerAccountDto {

  user_id: number
  name: string
  account_name: string
  currency_type: CurrencyType


}