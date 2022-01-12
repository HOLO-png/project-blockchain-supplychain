import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { persistStore } from 'redux-persist';
import authReducer from './reducers/authReducer.js';
import loadingReducer from './reducers/loadingReducer.js';
import web3Reducer from './reducers/web3Reducer.js';
import productReducer from './reducers/productReducer.js';

const store = configureStore({
    reducer: {
        authReducer,
        loadingReducer,
        web3Reducer,
        productReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export default store;
