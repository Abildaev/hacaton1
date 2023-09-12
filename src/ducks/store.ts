import {configureStore, combineReducers } from "@reduxjs/toolkit";
import {converterReducer} from "./converter";




const reducer = combineReducers({
    converter: converterReducer
})


export const store = configureStore({
    reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
