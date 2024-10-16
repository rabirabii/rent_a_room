import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { logoutCustomer } from "../Reducer/auth";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

let initialUser = null;
if (storedUser) {
  try {
    initialUser = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data");
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken || null,
    user: initialUser || null,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.error = null;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutCustomer.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutCustomer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
