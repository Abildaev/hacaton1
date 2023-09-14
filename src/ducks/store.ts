import {configureStore, combineReducers } from "@reduxjs/toolkit";
import {converterReducer} from "./converter";


// import {
//     persistReducer,
//     persistStore,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER, } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'


// const persistConfig = {
//     key: 'root',
//     storage,
// }


const rootReducer = combineReducers({
    converter: converterReducer
})



// const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //         },
    //     }),
})


// export const persistor  = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch