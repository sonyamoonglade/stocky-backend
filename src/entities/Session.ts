

export class Session{
  id: string
  user_id: number
  username: string
  ttl?: number

  constructor(user_id: number,ttl: number,username: string) {
    this.username = username
    this.user_id = user_id;
    this.ttl = ttl
  }
}