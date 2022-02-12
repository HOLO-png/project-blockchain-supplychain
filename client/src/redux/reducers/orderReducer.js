import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const handleCreateOrderProduct = createAsyncThunk(
    'handleCreateOrderProduct/handleCreateOrderProductFetch',
    async (data) => {
        try {
            const res = await axios.post(`/order`, { ...data });
            return res.data;
        } catch (err) {
            toast.warning(`create order failure`);
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleGetOrderUser = createAsyncThunk(
    'handleGetOrderUser/handleGetOrderUserFetch',
    async (userId) => {
        try {
            const res = await axios.get(`/order/${userId.userId}`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.warning(`create order failure`);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const handleGetOrderUserAll = createAsyncThunk(
    'handleGetOrderUserAll/handleGetOrderUserAllFetch',
    async () => {
        try {
            const res = await axios.get(`/order/all`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.warning(`create order failure`);
            toast.error(`${err.message} 😓`);
        }
    },
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
    },
    reducers: {},
    extraReducers: {
        //fetch activation email
        [handleCreateOrderProduct.pending]: (state, action) => {},
        [handleCreateOrderProduct.fulfilled]: (state, action) => {
            if (action.payload) {
                const product = action.payload;
                if (state.order) {
                    state.order.push(product);
                } else {
                    state.order = [];
                    state.order.push(product);
                }
            }
        },
        [handleCreateOrderProduct.rejected]: (state, action) => {},

        //fetch activation email
        [handleGetOrderUser.pending]: (state, action) => {},
        [handleGetOrderUser.fulfilled]: (state, action) => {
            if (action.payload) {
                state.order = action.payload;
            }
        },
        [handleGetOrderUser.rejected]: (state, action) => {},

        //fetch activation email
        [handleGetOrderUserAll.pending]: (state, action) => {},
        [handleGetOrderUserAll.fulfilled]: (state, action) => {
            if (action.payload) {
                state.order = action.payload;
            }
        },
        [handleGetOrderUserAll.rejected]: (state, action) => {},
    },
});

const orderReducer = orderSlice.reducer;

export const orderSelector = (state) => state.orderReducer.order;

export default orderReducer;
