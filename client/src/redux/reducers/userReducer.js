import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getUsersApi = createAsyncThunk(
    'getUsersApi/getUsersApiFetch',
    async () => {
        try {
            const res = await axios.get(`/users/user-all`);
            toast.success(`Đã lấy danh sách người dùng thành công😍`);
            return res.data;
        } catch (err) {
            console.log(err);
            toast.error(`${err.message} 😓`);
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
    },
    reducers: {},
    extraReducers: {
        [getUsersApi.pending]: (state, action) => {},
        [getUsersApi.fulfilled]: (state, action) => {
            state.users = action.payload;
        },
        [getUsersApi.rejected]: (state, action) => {},
    },
});

const userReducer = userSlice.reducer;

export const userSelector = (state) => state.userReducer.users;

export default userReducer;
