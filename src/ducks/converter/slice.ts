import { exchangeRatesThunk } from './';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrencyDto} from "../../types/dto/currencyDto";
import {CURRENCIES_DATA} from "../../__data__";
import { IExchangeRatesResponse } from '../../types/response/exchangeRates';
import { TotalDto } from '../../types/dto/totalDto';



interface IInitialState {
    allCurrencies: CurrencyDto[],
    fromCurrency: CurrencyDto | null,
    currencies: CurrencyDto[],
    amout: number,
    total: TotalDto[]
}

const initialState: IInitialState = {
    allCurrencies: CURRENCIES_DATA as CurrencyDto[],
    fromCurrency: null,
    currencies: [],
    amout: 0,
    total: []
}




export const converterSlice = createSlice({
    name: 'converter',
    initialState,
    reducers: {
        initFromCurrency: (state) => {
            const fromCurrency = state.allCurrencies.find(currency => currency.label === "USD")
            if(fromCurrency) {
                state.fromCurrency = fromCurrency;
            }
        },
        initCurrencies : ( state) => {
            const currenciesElements = 
            state.allCurrencies
            .filter(currency => currency.id !== state.fromCurrency?.id)
            .filter((currency, index) => index <= 0 )
          
            state.currencies = currenciesElements   
        },
        changeFromCurrency: (state, action: PayloadAction<CurrencyDto>) => {
        
            const newCurrencies =  state.currencies.map(currency => {
                if(currency.id === action.payload.id && state.fromCurrency) {
                    return state.fromCurrency
                }else {
                   return currency
                }
            })

            state.currencies = newCurrencies
            state.fromCurrency = action.payload
        },
        changeToCurrency: (state, action: PayloadAction<{value: CurrencyDto, index: number}>) => {

            const newCurrencies = state.currencies.map(currency => {
                if(currency.id === action.payload.value.id) {
                    return state.currencies[action.payload.index]
                }else {
                   return currency
                }
            })

            if(state?.fromCurrency?.id === action.payload.value.id) {
                state.fromCurrency = state.currencies[action.payload.index]
            }
            state.currencies = newCurrencies
            state.currencies[action.payload.index] = action.payload.value        
        },
        addCurrency: (state) => {

            if(state.currencies.length < 3) {
                const newCurrency = state.allCurrencies
                .find(allCurrency => {
                    const element = state.currencies.find(el => el.id === allCurrency.id);
                    if(allCurrency.id !== state?.fromCurrency?.id && !element) {
                        return true
                    }
                    else {
                        return false
                    }
                })
    
                if(newCurrency) {
                    state.currencies = [...state.currencies, newCurrency]
                }
            }
        },
        deleteCurrency: (state, action: PayloadAction<CurrencyDto["id"]>) => {
            const filteredCurrencies = state.currencies.filter(currency => currency.id !== action.payload)
            state.currencies = filteredCurrencies;
        },
        reverseCurrencies: (state, action: PayloadAction<CurrencyDto>) => {
            if(state.fromCurrency) {
                state.fromCurrency = state.currencies[0]
                state.currencies[0] = action.payload
            }   
        },
        resetTotal: (state) => {
            state.total = []
        },

        addAmount: (state, action:PayloadAction<number>) => {
            state.amout = action.payload
        }
    },
    extraReducers: builder => {
        builder.addMatcher (exchangeRatesThunk.fulfilled.match, (state, action: PayloadAction<IExchangeRatesResponse>) => {
            for (const key in action.payload.rates) {
                state.total = [...state.total, 
                    {currency: key, sum: state.amout * action.payload.rates[key]}]
            }
            
        })
    }

})