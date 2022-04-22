import { CurrencyType } from "../shared/types/types";



export class BrokerAccount {
  id: number
  user_id: number
  name: string
  account_name: string
  asset_quantity: number
  balance: number
  currency_type: CurrencyType

  constructor(
              user_id?: number,
              account_name?: string,
              asset_quantity?: number,
              name?:string,
              balance?: number,
              currency_type?: CurrencyType) {

    this.user_id = user_id;
    this.account_name = account_name;
    this.asset_quantity = asset_quantity;
    this.balance = balance;
    this.name = name;
    this.currency_type = currency_type;
  }
}

export const broker_accounts = 'broker_accounts'
