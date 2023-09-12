import {converterSlice} from "./slice";
import { exchangeRatesThunk } from "./thunks";





export const converterReducer = converterSlice.reducer

export const {
    initCurrencies, 
    initFromCurrency, 
    changeFromCurrency,
    changeToCurrency,
    addCurrency,
    deleteCurrency,
    reverseCurrencies,
    resetTotal,
    addAmount

} = converterSlice.actions

export {exchangeRatesThunk}