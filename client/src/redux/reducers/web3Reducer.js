import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const web3Slice = createSlice({
    name: 'web3',
    initialState: {
        web3: null,
    },
    reducers: {
        setWeb3(state, action) {
            state.web3 = action.payload;
            toast.success('Connected wallet');
        },
    },
    extraReducers: {},
});

const web3Reducer = web3Slice.reducer;

export const web3Selector = (state) => state.web3Reducer.web3;

export const { setWeb3 } = web3Slice.actions;

export default web3Reducer;
