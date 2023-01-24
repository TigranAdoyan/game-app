import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    userData: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.isAuthenticated = true;
            state.userData = action.payload;
        },
        removeAuthUser: (state, action) => {
            state.isAuthenticated = false;
            state.userData = {};
        }
    }
});

const {
    setAuthUser,
    removeAuthUser
} = authSlice.actions;

export const actions = {
    setAuthUser,
    removeAuthUser
}

export default authSlice;
