import { createSlice } from "@reduxjs/toolkit";

const load = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch {
        return null;
    }
};

const initialState = {
    user: load("auth_user"),
    token: localStorage.getItem("auth_token"),
    modal: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        openLogin(state) {
            state.modal = "login";
        },
        openSignup(state) {
            state.modal = "signup";
        },
        closeModal(state) {
            state.modal = null;
        },
        setCredentials(state, { payload }) {
            state.user = payload.user;
            state.token = payload.token;
            localStorage.setItem("auth_token", payload.token);
            localStorage.setItem("auth_user", JSON.stringify(payload.user));
        },
        updateUser(state, { payload }) {
            state.user = { ...state.user, ...payload };
            localStorage.setItem("auth_user", JSON.stringify(state.user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
        },
    },
});

export const {
    openLogin,
    openSignup,
    closeModal,
    setCredentials,
    updateUser,
    logout,
} = authSlice.actions;
export default authSlice.reducer;