import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.items = action.payload;
    },
    setBlogLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlogError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBlogs, setBlogLoading, setBlogError } = blogSlice.actions;
export default blogSlice.reducer;

