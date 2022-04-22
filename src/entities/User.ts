
export class User {
  id?: number
  email: string
  firstname: string
  lastname: string
  password: string
  password_hint?: string = ''
  date_of_birth: string
  has_broker_account?: boolean = false
  subscribed_to_notifications?: boolean = false
  broker_accounts_number?: number = 0
  total_asset_quantity?: number = 0


  constructor(firstname?: string, password?: string, date_of_birth?: string, password_hint?: string, lastname?: string) {
    this.firstname = firstname;
    this.password = password;
    this.date_of_birth = date_of_birth;
    this.password_hint = password_hint
    this.lastname = lastname
  }
}

export const users = 'users'