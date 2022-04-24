

export enum CurrencyType {
  USD = '$',
  RUB = "₽",
  EURO = "€"
}

export interface modifiedRequest extends Request {
  user_id: number
}