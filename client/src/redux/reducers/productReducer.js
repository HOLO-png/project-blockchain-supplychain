import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const createProductApi = createAsyncThunk(
    'createProduct/createProductFetch',
    async (data) => {
        try {
            const res = await axios.post(`/products`, {
                name: data.name,
                price: data.price,
                thumbnail: data.thumbnail,
                creator: data.creator,
                addressCreator: data.addressCreator,
                status: data.status,
                addressProduct: data.addressProduct,
                indexProduct: data.indexProduct,
            });
            toast.success(`Created success new product`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const getProductApi = createAsyncThunk(
    'getProduct/getProductFetch',
    async () => {
        try {
            const res = await axios.get(`/products`);
            res.data.length && toast.success(`Get success product list`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const updateProductApi = createAsyncThunk(
    'updateProductApi/updateProductApiFetch',
    async (data) => {
        try {
            await axios.put(`/products/${data.data._id}`, data.data, {
                headers: { Authorization: data.token },
            });
            toast.success(`Updated success `);
            return data.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const updateStatusProductApi = createAsyncThunk(
    'updateStatusProductApi/updateStatusProductApiFetch',
    async (data) => {
        try {
            await axios.patch(`/products/${data._id}`, {
                status: data.status,
            });
            toast.success(
                data.status === 1 ? `Paid success ` : 'Delivery success',
            );
            return data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const deleteProductApi = createAsyncThunk(
    'deleteProductApi/deleteProductApiFetch',
    async (data) => {
        try {
            await axios.delete(`/products/${data._id}`);
            toast.success('Deleted Success');
            return data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const getUserAllProductApi = createAsyncThunk(
    'getUserAllProductApi/getUserAllProductApiFetch',
    async (user) => {
        try {
            const res = await axios.get(`/products/${user.wallet}`);
            res.data.length && toast.success(`Get success product list`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);
const productSlice = createSlice({
    name: 'product',
    initialState: {
        product: null,
    },
    reducers: {},
    extraReducers: {
        //create product
        [createProductApi.pending]: (state, action) => {},
        [createProductApi.fulfilled]: (state, action) => {
            const product = action.payload;
            if (product) {
                state.product.push(action.payload);
            }
        },
        [createProductApi.rejected]: (state, action) => {},

        //get product
        [getProductApi.pending]: (state, action) => {},
        [getProductApi.fulfilled]: (state, action) => {
            state.product = action.payload;
        },
        [getProductApi.rejected]: (state, action) => {},

        // // //update product
        [updateProductApi.pending]: (state, action) => {},
        [updateProductApi.fulfilled]: (state, action) => {
            const product = action.payload;
            if (product) {
                state.product = state.product.map(function (item) {
                    return item._id === action.payload._id
                        ? action.payload
                        : item;
                });
            }
            console.log(state.product);
        },
        [updateProductApi.rejected]: (state, action) => {
            toast.error('you can update only your product');
        },

        // // //update product
        [updateStatusProductApi.pending]: (state, action) => {},
        [updateStatusProductApi.fulfilled]: (state, action) => {
            const product = action.payload;
            if (product) {
                if (product.status === 1) {
                    state.product = state.product.filter(function (item) {
                        return item._id !== action.payload._id;
                    });
                } else {
                    state.product = state.product.map(function (item) {
                        return item._id === action.payload._id
                            ? action.payload
                            : item;
                    });
                }
            }
        },
        [updateStatusProductApi.rejected]: (state, action) => {},

        // // //update product
        [deleteProductApi.pending]: (state, action) => {},
        [deleteProductApi.fulfilled]: (state, action) => {
            const product = action.payload;
            if (product) {
                state.product = state.product.filter(function (item) {
                    return item._id !== action.payload._id;
                });
            }
        },
        [deleteProductApi.rejected]: (state, action) => {},

        // // //update product
        [getUserAllProductApi.pending]: (state, action) => {},
        [getUserAllProductApi.fulfilled]: (state, action) => {
            state.product = action.payload;
        },
        [getUserAllProductApi.rejected]: (state, action) => {},
    },
});

const productReducer = productSlice.reducer;

export const productSelector = (state) => state.productReducer.product;

export default productReducer;
