import { createSlice } from "@reduxjs/toolkit";

// Get initial user data from localStorage if exists
const storedUser = localStorage.getItem("user");
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  user: initialUser,
  loading: false,
  error: null,
  success: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.success = "User info updated successfully!";
      // Update localStorage when user data changes
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUserMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    resetUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      localStorage.removeItem("user");
    },
  },
});

export const {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  clearUserMessages,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
