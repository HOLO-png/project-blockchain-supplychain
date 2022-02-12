import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getOrCreateCartToUserApi = createAsyncThunk(
    'getOrCreateCartToUserApi/getOrCreateCartToUserApiFetch',
    async (tokenAuth) => {
        try {
            const res = await axios.post(`/cart`, null, {
                headers: { Authorization: tokenAuth },
            });
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleAddProductToCart = createAsyncThunk(
    'handleAddProductToCart/handleAddProductToCartFetch',
    async (data) => {
        try {
            const res = await axios.post(`/cart/${data.cart._id}`, {
                productId: data.product._id,
            });
            toast.success(`added ${data.product.name} `);
            return res.data;
        } catch (err) {
            toast.warning(`add failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleRemoveProductToCart = createAsyncThunk(
    'handleRemoveProductToCart/handleRemoveProductToCartFetch',
    async (data) => {
        try {
            const res = await axios.delete(`/cart/${data.cart._id}`, {
                data: {
                    productId: data.product._id,
                    price: data.product.price,
                },
            });
            toast.success(`Removed ${data.product.name} `);
            return res.data;
        } catch (err) {
            toast.warning(`remove failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleUpdateAmountProductToCart = createAsyncThunk(
    'handleUpdateAmountProductToCart/handleUpdateAmountProductToCartFetch',
    async (data) => {
        try {
            const res = await axios.put(`/cart/${data.cart._id}`, {
                productId: data.product._id,
                amount: data.product.amount,
                price: data.product.price,
            });

            return res.data;
        } catch (err) {
            toast.warning(`update amount failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleResetCart = createAsyncThunk(
    'handleResetCart/handleResetCartFetch',
    async (cart) => {
        try {
            const res = await axios.put(`/cart/reset/${cart._id}`, null);
            return res.data;
        } catch (err) {
            toast.warning(`update amount failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
    },
    reducers: {},
    extraReducers: {
        //fetch activation email
        [getOrCreateCartToUserApi.pending]: (state, action) => {},
        [getOrCreateCartToUserApi.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cart = action.payload;
            }
        },
        [getOrCreateCartToUserApi.rejected]: (state, action) => {},

        //fetch activation email
        [handleAddProductToCart.pending]: (state, action) => {},
        [handleAddProductToCart.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cart.cart = action.payload;
            }
        },
        [handleAddProductToCart.rejected]: (state, action) => {},
        //fetch activation email
        [handleRemoveProductToCart.pending]: (state, action) => {},
        [handleRemoveProductToCart.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cart = action.payload;
            }
        },
        [handleRemoveProductToCart.rejected]: (state, action) => {},
        //fetch activation email
        [handleUpdateAmountProductToCart.pending]: (state, action) => {},
        [handleUpdateAmountProductToCart.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cart = action.payload;
            }
        },
        [handleUpdateAmountProductToCart.rejected]: (state, action) => {},
        //fetch activation email
        [handleResetCart.pending]: (state, action) => {},
        [handleResetCart.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cart = action.payload;
            }
        },
        [handleResetCart.rejected]: (state, action) => {},
    },
});

const cartReducer = cartSlice.reducer;

export const cartSelector = (state) => state.cartReducer.cart;

export default cartReducer;
