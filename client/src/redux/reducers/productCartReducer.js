import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const handleGetProductToCart = createAsyncThunk(
    'handleGetProductToCart/handleGetProductToCartFetch',
    async (cartId) => {
        try {
            const res = await axios.get(`/cart/${cartId}`);
            return res.data;
        } catch (err) {
            toast.warning(`get product failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

const cartProductSlice = createSlice({
    name: 'cartProduct',
    initialState: {
        cartProduct: null,
    },
    reducers: {},
    extraReducers: {
        //fetch activation email
        [handleGetProductToCart.pending]: (state, action) => {},
        [handleGetProductToCart.fulfilled]: (state, action) => {
            if (action.payload) {
                state.cartProduct = action.payload;
            }
        },
        [handleGetProductToCart.rejected]: (state, action) => {},
    },
});

const cartProductReducer = cartProductSlice.reducer;

export const cartProductSelector = (state) =>
    state.cartProductReducer.cartProduct;

export default cartProductReducer;
