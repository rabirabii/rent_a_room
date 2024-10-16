import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearCredentials } from "../Slicer/Auth";

export const LoginUser = async (credentials) => {
  const response = await fetch("http://localhost:5001/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login Failed");
  }

  return data;
};
export const RegisterUser = async (userData) => {
  const response = await fetch("http://localhost:5001/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Register Failed");
  return response.json();
};

// Thunk untuk logout
export const logoutCustomer = createAsyncThunk(
  "auth/logoutCustomer",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to logout customer");
      }
      dispatch(clearCredentials());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
