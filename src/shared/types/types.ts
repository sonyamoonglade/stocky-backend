import { Session } from "../../entities/Session";


export enum CurrencyType {
  USD = '$',
  RUB = "₽",
  EURO = "€"
}

export interface modifiedRequest extends Request {
  session: Session
}
