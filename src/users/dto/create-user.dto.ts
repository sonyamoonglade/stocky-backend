
export class CreateUserDto{
  email: string
  firstname: string
  lastname: string
  password: string
  password_hint?: string
  date_of_birth: string

  constructor(email: string, firstname: string, lastname: string, password: string, password_hint: string, date_of_birth: string) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.password_hint = password_hint;
    this.date_of_birth = date_of_birth;
  }
}

