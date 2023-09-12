export interface IExchangeRatesResponse {
    base: string
    date: string
    rates: Rates
    success: boolean
    timestamp: number
  }
  
export interface Rates {
    [key: string]: number
  }