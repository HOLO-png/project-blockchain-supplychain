import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        loading: false,
    },
    reducers: {
        setLoadingTrue(state, action) {
            state.loading = true;
        },
        setLoadingFalse(state, action) {
            state.loading = false;
        },
    },
    extraReducers: {},
});

const loadingReducer = loadingSlice.reducer;

export const loadingSelector = (state) => state.loadingReducer.loading;

export const { setLoadingTrue, setLoadingFalse } = loadingSlice.actions;

export default loadingReducer;
