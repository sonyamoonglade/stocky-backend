

export class Session{
  session_id: string
  user_id: number
  username: string
  ttl?: string

  constructor(user_id: number,ttl: string,username: string) {
    this.username = username
    this.user_id = user_id;
    this.ttl = ttl
  }
}

export const sessions = 'sessions'