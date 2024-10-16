import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slicer/Auth.js";
import userReducer from "./Slicer/User.js";
import bookingReducer from "./Slicer/Booking.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    booking: bookingReducer,
  },
});
