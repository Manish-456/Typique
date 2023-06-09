import {configureStore} from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { apiSlice } from './api/apiSlice'
import authReducer from '../Features/auth/authSlice';
export const store = configureStore({
    reducer : {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth : authReducer
    },

    middleware : getDefaultMiddleware => {
     return  getDefaultMiddleware().concat(apiSlice.middleware)
    },
    devTools : false
})

setupListeners(store.dispatch);