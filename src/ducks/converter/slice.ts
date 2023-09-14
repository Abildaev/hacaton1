import {exchangeRatesThunk} from './';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CurrencyDto} from "../../types/dto/currencyDto";
import {CURRENCIES_DATA} from "../../__data__/";
import {IExchangeRatesResponse} from '../../types/response/exchangeRates';
import {TotalDto} from '../../types/dto/totalDto';


interface IInitialState {
    allCurrencies: CurrencyDto[],
    fromCurrency: CurrencyDto | null,
    currencies: CurrencyDto[],
    amount: number,
    total: TotalDto[],
    error: string,
    loading: boolean
}

const initialState: IInitialState = {
    allCurrencies: CURRENCIES_DATA as CurrencyDto[],
    fromCurrency: null,
    currencies: [],
    amount: 0,
    total: [],
    error: "",
    loading: false
}


export const converterSlice = createSlice({
    name: 'converter',
    initialState,
    reducers: {
        initFromCurrency: (state) => {
            const fromCurrency = state.allCurrencies.find(currency => currency.label === "USD")
            if (fromCurrency) {
                state.fromCurrency = fromCurrency;
            }
        },
        initCurrencies: (state) => {
            const currenciesElements =
                state.allCurrencies
                    .filter(currency => currency.id !== state.fromCurrency?.id)
                    .filter((currency, index) => index <= 0)

            state.currencies = currenciesElements
        },
        changeFromCurrency: (state, action: PayloadAction<CurrencyDto>) => {

            const newCurrencies = state.currencies.map(currency => {
                if (currency.id === action.payload.id && state.fromCurrency) {
                    return state.fromCurrency
                } else {
                    return currency
                }
            })

            state.currencies = newCurrencies
            state.fromCurrency = action.payload
        },
        changeToCurrency: (state, action: PayloadAction<{ value: CurrencyDto, index: number }>) => {

            const newCurrencies = state.currencies.map(currency => {
                if (currency.id === action.payload.value.id) {
                    return state.currencies[action.payload.index]
                } else {
                    return currency
                }
            })

            if (state?.fromCurrency?.id === action.payload.value.id) {
                state.fromCurrency = state.currencies[action.payload.index]
            }
            state.currencies = newCurrencies
            state.currencies[action.payload.index] = action.payload.value
        },
        addCurrency: (state) => {

            if (state.currencies.length < 4) {
                const newCurrency = state.allCurrencies
                    .find(allCurrency => {
                        const element = state.currencies.find(el => el.id === allCurrency.id);
                        if (allCurrency.id !== state?.fromCurrency?.id && !element) {
                            return true
                        } else {
                            return false
                        }
                    })

                if (newCurrency) {
                    state.currencies = [...state.currencies, newCurrency]
                }
            }
        },
        deleteCurrency: (state, action: PayloadAction<CurrencyDto["id"]>) => {
            const filteredCurrencies = state.currencies.filter(currency => currency.id !== action.payload)
            state.currencies = filteredCurrencies;
        },
        reverseCurrencies: (state, action: PayloadAction<CurrencyDto>) => {
            if (state.fromCurrency) {
                state.fromCurrency = state.currencies[0]
                state.currencies[0] = action.payload
            }
        },
        resetTotal: (state) => {
            state.total = []
        },addAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload
        },
        onLoading: (state) => {
            state.loading = true
        },
        offLoading: (state) => {
            state.loading = false
        }
    },
    extraReducers: builder => {
        builder.addMatcher(exchangeRatesThunk.fulfilled.match, (state, action: PayloadAction<IExchangeRatesResponse>) => {

            state.error = ""
            for (const key in action.payload.rates) {

                const country = state.allCurrencies.find(el => el.label === key);

                state.total = [...state.total,
                    {currency: key, sum: state.amount * action.payload.rates[key], country: country?.country || null} ]
            }

        })
        builder.addMatcher(exchangeRatesThunk.rejected.match, (state, action: any) => {
            state.error = action.payload.message
        })
    }

})