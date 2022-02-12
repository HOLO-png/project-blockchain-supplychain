import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { persistStore } from 'redux-persist';
import authReducer from './reducers/authReducer.js';
import loadingReducer from './reducers/loadingReducer.js';
import web3Reducer from './reducers/web3Reducer.js';
import productReducer from './reducers/productReducer.js';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
import cartProductReducer from './reducers/productCartReducer.js';
import orderReducer from './reducers/orderReducer.js';

const store = configureStore({
    reducer: {
        authReducer,
        loadingReducer,
        web3Reducer,
        productReducer,
        userReducer,
        cartReducer,
        cartProductReducer,
        orderReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
export default store;
