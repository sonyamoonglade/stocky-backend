
export class User {
  id?: number
  email: string
  firstname: string
  lastname: string
  password: string
  password_hint?: string
  date_of_birth: string
  has_broker_account?: boolean
  subscribed_to_notifications?: boolean
  broker_accounts_number?: number
  total_asset_quantity?: number


  constructor(firstname?: string, password?: string, date_of_birth?: string,lastname?: string, password_hint?: string) {
    this.firstname = firstname;
    this.lastname = lastname
    this.password = password;
    this.date_of_birth = date_of_birth;
    this.password_hint = password_hint
  }
}

export const users = 'users'