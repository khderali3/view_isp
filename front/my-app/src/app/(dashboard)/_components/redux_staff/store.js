import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import { apiSlice } from "./services/apiSlice";

export const store_staff = configureStore({
            reducer: {
                [apiSlice.reducerPath] : apiSlice.reducer,
                staff_auth: authReducer
            },
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware().concat(apiSlice.middleware),
            devTools: true
})

