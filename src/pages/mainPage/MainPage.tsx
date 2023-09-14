import {useAppDispatch, useAppSelector} from "../../ducks/hooks";
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

import {TextInput, Text, Flex, Button} from '@mantine/core';
import {IconArrowsExchange, IconTrash, IconPlus} from '@tabler/icons-react';

import React, {useEffect, useState, useTransition} from "react";
import {CurrencyDto} from "../../types/dto/currencyDto";
import {useThrottle} from "../../hooks/useThrottle";
import {ConvertTotal} from "../../components/convertTotal/ConvertTotal";
import {ConvertSelect} from "../../components/convertSelect/ConvertSelect";
import {Loading} from "../../components/loading/Loading";
import {Error} from "../../components/error/Error";


export function MainPage() {
    const {
        currencies,
        fromCurrency,
        total,
        amount,
        error,
        loading
    } = useAppSelector(store => store.converter)

    const dispatch = useAppDispatch()

    const [inputValue, setInputValue] = useState<string>('');

    const [isPending, startTransition] = useTransition();

    const throttledInputValue = useThrottle<string>(inputValue, 500);




    useEffect(() => {
        dispatch(initFromCurrency())
        dispatch(initCurrencies())
    }, [])


    useEffect(() => {
        const amount = parseInt(throttledInputValue);
        if (amount) {

            dispatch(addAmount(amount))
        }
        if (throttledInputValue) {
            startTransition(() => {
                let paramsValue = '';
                currencies.forEach((el, index) => {
                    if (index !== currencies.length - 1) {
                        paramsValue += el.label + ','
                    } else {
                        paramsValue += el.label
                    }
                })
                dispatch(exchangeRatesThunk({symbols: paramsValue, base: fromCurrency?.label as string}))
            })
        }

    }, [throttledInputValue, currencies])


    const changeFromCurrencyFn = (value: CurrencyDto) => {
        if (value) {
            dispatch(changeFromCurrency(value))
        }
    }

    const changeToCurrencyFn = (value: CurrencyDto, index: number | undefined) => {


        if (value && index !== undefined) {
            dispatch(changeToCurrency({value, index}))
        }
    }

    const addCurrencyFn = () => {
        dispatch(addCurrency())
    }

    const deleteCurrencyFn = (id: number) => {
        dispatch(deleteCurrency(id))
    }


    const reverseCurrenciesFn = () => {
        if (fromCurrency) {
            dispatch(reverseCurrencies(fromCurrency))
        }

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
    };


    return (


        <>
            <Flex direction="column" align="center" w="50%">

                <TextInput
                    icon={<Text>{fromCurrency?.icon}</Text>}
                    type="number"
                    radius="md"
                    placeholder="100"
                    mb={20}
                    w={"100%"}
                    label="Amount"
                    onChange={handleChange}
                    value={inputValue}
                />


                {
                    fromCurrency?.name && fromCurrency?.label
                    &&
                    <ConvertSelect label={fromCurrency.label} name={fromCurrency.name}
                                   country={fromCurrency.country}
                                   changeCurrency={changeFromCurrencyFn}/>
                }

                <Button onClick={reverseCurrenciesFn} size="sm" w={"25%"} mb={20} disabled={loading}>
                    <IconArrowsExchange/>
                </Button>

                {
                    currencies.map((currency, index) => (
                        <Flex align="start" w={"100%"} justify="center" key={currency.id}>
                            <ConvertSelect
                                label={currency.label}
                                name={currency.name}
                                changeCurrency={changeToCurrencyFn}
                                index={index}
                                country={currency.country}
                            />
                            {
                                currencies.length > 1
                                &&
                                <Button onClick={() => deleteCurrencyFn(currency.id)} size="sm" w="15%" ml="2%" disabled={loading}>
                                    <IconTrash/>
                                </Button>
                            }
                        </Flex>
                    ))

                }

                <Button onClick={addCurrencyFn} size="sm" mb={40} disabled={loading}>
                    add currency <IconPlus/>
                </Button>
            </Flex>


            {

                loading ? <Loading/>
                    :
                    error ? <Error message={error}/>
                        :
                        fromCurrency && total.map(item => <ConvertTotal key={item.currency} total={item} fromCurrency={fromCurrency}
                                                                        amount={amount}/>)


            }


        </>


    );
}