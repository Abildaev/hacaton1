import {Autocomplete, Box, Button, TextField, InputAdornment} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../ducks/hooks";
import { 
    initCurrencies, 
    initFromCurrency, 
    changeFromCurrency,
    changeToCurrency,
    addCurrency,
    deleteCurrency,
    reverseCurrencies,
    exchangeRatesThunk,
    addAmount
} from "../../ducks/converter";
    
import React, {useEffect, useState, useTransition, useMemo} from "react";
import { CurrencyDto } from "../../types/dto/currencyDto";
import { useThrottle } from "../../hooks/useThrottle";

export function MainPage() {
    const dispatch = useAppDispatch()

    const [inputValue, setInputValue] = useState<string>('');
    const [isPending, startTransition] = useTransition();


    const throttledInputValue = useThrottle<string>(inputValue, 500);

    const {
        currencies, 
        allCurrencies, 
        fromCurrency,
        total
        } = useAppSelector(store => store.converter)


    useEffect(() => {
        dispatch(initFromCurrency())
        dispatch(initCurrencies())

    }, [])

    useEffect(() => {

        const amount = parseInt(throttledInputValue);

        if(typeof amount === "number") {
            dispatch(addAmount(amount))
        }

        if(throttledInputValue) {
            startTransition(() => { 
                let paramsValue = '';
                currencies.forEach((el,index) => {
                    if(index !== currencies.length - 1) {
                        paramsValue += el.label + ','
                    }else {
                        paramsValue += el.label
                    }
                })
                dispatch(exchangeRatesThunk({symbols: paramsValue, base: fromCurrency?.label as string}))
            })
            
        }
        

    }, [throttledInputValue, currencies])


    const totalList = useMemo(() => {
        return (
            <ul>
                {
                    total.map((el,index) => <li key={index}>{el.sum} {el.currency}</li>)
                }
            
            </ul>
        )
    }, [total])


    const changeFromCurrencyFn = (event: React.SyntheticEvent<Element, Event>, value: CurrencyDto | null) => {
        if(value) {
            dispatch(changeFromCurrency(value))
        }
    }

    const changeToCurrencyFn = (event: React.SyntheticEvent<Element, Event>, value: CurrencyDto | null, index: number) => {
        if(value) { 
            dispatch(changeToCurrency({value, index}))
        }
    }

    const addCurrencyFn = () => {
        dispatch(addCurrency())
    }

    const deleteCurrencyFn = (id:number) => {
        dispatch(deleteCurrency(id))
    }
    

    const reverseCurrenciesFn = () => {
        if(fromCurrency) {
            dispatch(reverseCurrencies(fromCurrency))
        }
        
    }
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
      };



      

    return (
        <Box sx={{ flexDirection: 'row' }}>

            <TextField fullWidth label="fullWidth" id="fullWidth" onChange={handleChange}/>
            
                <Autocomplete
                                
                                id="combo-box-demo"
                                options={allCurrencies}
                                value={fromCurrency}
                                sx={{ width: 300 }}
                                onChange={changeFromCurrencyFn}
                                renderInput={(params) => (
                                <>
                                    
                                    <TextField {...params} label="from">
                                        <InputAdornment position="start">{fromCurrency?.icon}</InputAdornment>

                                    </TextField>
                                </>
                                
                                )}
                            />

            <Button 
            variant="contained" 
            onClick={reverseCurrenciesFn}
            
        >reverse</Button>

            {
                currencies.map((currency, index) => (
                    <Box key={currency.id}>
                    <Autocomplete
                                
                                id="combo-box-demo"
                                options={allCurrencies}
                                value={currency}
                                onChange={(event, value) => changeToCurrencyFn(event, value, index)}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="to" />}
                            />

                    {index > 0 
                    && 
                    
                    <Button variant="contained" 
                         onClick={() => deleteCurrencyFn(currency.id)}>
                        remove</Button>}
                    
                    </Box>
                            
                            

            ))}

            <div>
            <Button 
                        
                            variant="contained" 
                            onClick={addCurrencyFn}>
                                add currency
                                </Button>
            </div>
            



            {totalList}

        </Box>
    );
}

