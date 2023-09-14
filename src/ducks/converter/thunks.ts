import {createAsyncThunk} from "@reduxjs/toolkit";
import {CurrencyDto} from "../../types/dto/currencyDto";
import {resetTotal, offLoading,onLoading} from "./";
import axios from "axios";

export const exchangeRatesThunk = createAsyncThunk(
    'exchangeRates',
    async function({symbols, base}: {symbols: string, base: CurrencyDto["label"]}, thunkApi) {

        try {
            thunkApi.dispatch(onLoading())
            thunkApi.dispatch(resetTotal())

            const response = await axios.get('https://api.apilayer.com/exchangerates_data/latest',{
                headers: {
                    'apikey': 'riAe6q6igEyZQkDFkw68VXMlEoPhHQXT'
                },
                params: {
                    symbols,
                    base
                }
            })
            return response.data
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkApi.rejectWithValue(error.response?.data || error.message);
            } else {
                throw error;
            }
        }
        finally {
            thunkApi.dispatch(offLoading())
        }

    }
)