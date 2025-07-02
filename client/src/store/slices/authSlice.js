import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const initialState = "";
const API_URL = "http://localhost:4000";

const authSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerUser: async (state, action) => {
      try {
        const data = await axios.post(`${API_URL}/register`, action.payload);
        state = await data.response.message;
      } catch (error) {
        state = await error.response.data.message;
      }
    },
  },
});

export const { registerUser } = authSlice.actions;
export default authSlice.reducer;
