import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchSignupAction = createAsyncThunk(
    'signup/signupFetch',
    async (data) => {
        try {
            await axios.post(`/auth/register`, {
                username: data.name,
                email: data.email,
                password: data.password,
                wallet: data.wallet,
            });
            toast.success(
                `Đăng ký thành công, hãy vào email của bạn để xác nhận 😍`,
            );
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

export const fetchSigninAction = createAsyncThunk(
    'signinAction/fetchSigninAction',
    async (data) => {
        try {
            const res = await axios.post('/auth/login', {
                email: data.email,
                password: data.password,
                wallet: data.wallet,
            });
            toast.success(`Chào mừng bạn quay lại 😜`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`Đã xuất hiện lỗi vui lòng thực hiện lại 😓`);
        }
    },
);

export const fetchActivationEmail = createAsyncThunk(
    'ActivationEmail/fetchActivationEmail',
    async (activation_token) => {
        try {
            const res = await axios.post('/auth/activate', {
                activation_token,
            });
            if (res.data) {
                toast.success(`Xác nhận thành công 🥰`);
                return res.data;
            }
        } catch (error) {
            console.log({ msg: error.message });
            toast.error(`${error.message} 😓`);
        }
    },
);

export const getTokenCall = createAsyncThunk(
    'tokenCall/getTokenCall',
    async () => {
        try {
            const res = await axios.post('/auth/refresh_token', null);
            return res.data.access_token;
        } catch (error) {
            console.log({ msg: error.message });
            toast.error(`${error.message} 😓`);
        }
    },
);

export const getUserByToken = createAsyncThunk(
    'userByToken/getUserByToken',
    async (token) => {
        try {
            const res = await axios.get('/users', {
                headers: { Authorization: token },
            });
            return res.data;
        } catch (error) {
            console.log({ msg: error.message });
            toast.error(`${error.message} 😓`);
        }
    },
);

export const logoutApi = createAsyncThunk(
    'logoutApi/logoutApiFetch',
    async () => {
        try {
            await axios.get('/auth/logout');
            toast.success(`Bạn đã đăng xuất khỏi tiện ích !`);
        } catch (err) {
            console.log(err);
            toast.error(`Đã xuất hiện lỗi vui lòng thực hiện lại 😓`);
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        auth: {
            user: JSON.parse(localStorage.getItem('user')) || null,
            tokenAuth: JSON.parse(localStorage.getItem('token')) || null,
        },
    },
    reducers: {},
    extraReducers: {
        //fetch activation email
        [fetchActivationEmail.pending]: (state, action) => {},
        [fetchActivationEmail.fulfilled]: (state, action) => {
            action.payload &&
                localStorage.setItem('user', JSON.stringify(action.payload));
        },
        [fetchActivationEmail.rejected]: (state, action) => {
            state.auth.user = null;
        },

        // get token authentication
        [getTokenCall.pending]: (state, action) => {},
        [getTokenCall.fulfilled]: (state, action) => {
            action.payload &&
                localStorage.setItem('token', JSON.stringify(action.payload));
            state.auth.tokenAuth = action.payload;
        },
        [getTokenCall.rejected]: (state, action) => {},

        // get users authentication
        [getUserByToken.pending]: (state, action) => {},
        [getUserByToken.fulfilled]: (state, action) => {
            action.payload &&
                localStorage.setItem('user', JSON.stringify(action.payload));
            state.auth.user = action.payload;
        },
        [getUserByToken.rejected]: (state, action) => {},

        // Signin
        [fetchSigninAction.pending]: (state, action) => {},
        [fetchSigninAction.fulfilled]: (state, action) => {
            action.payload &&
                localStorage.setItem('user', JSON.stringify(action.payload));
            state.auth.user = action.payload;
        },
        [fetchSigninAction.rejected]: (state, action) => {},

        // Signin
        [logoutApi.pending]: (state, action) => {},
        [logoutApi.fulfilled]: (state, action) => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            state.auth.user = null;
            state.auth.tokenAuth = null;
        },
        [logoutApi.rejected]: (state, action) => {},
    },
});

const authReducer = authSlice.reducer;

export const authSelector = (state) => state.authReducer.auth;

export default authReducer;
