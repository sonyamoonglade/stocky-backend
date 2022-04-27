
export class User {
  id?: number
  email: string
  firstname: string
  lastname: string
  password: string
  date_of_birth: string
  password_hint?: string = ''
  has_broker_account?: boolean = false
  subscribed_to_notifications?: boolean = false


  constructor(firstname?: string,
              lastname?: string,
              password?: string,
              date_of_birth?: string,
              password_hint?: string,
              id?: number,
              has_broker_account?: boolean,
              subscribed_to_notifications?: boolean) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname
    this.password = password;
    this.date_of_birth = date_of_birth;
    this.password_hint = password_hint;
    this.has_broker_account = has_broker_account;
    this.subscribed_to_notifications =subscribed_to_notifications;

  }
}

export const users = 'users'