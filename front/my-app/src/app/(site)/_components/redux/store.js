import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import { apiSlice } from "./services/apiSlice";

export const store = configureStore({
            reducer: {
                [apiSlice.reducerPath] : apiSlice.reducer,
                auth: authReducer
            },
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware().concat(apiSlice.middleware),
            devTools: true
})

