import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async login action
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post("https://task-manager.codionslab.com/api/v1/login", loginData);
      return response.data; // This should include user and token
    } catch (error) {
      return rejectWithValue(error.response.data.message); // Pass the error to the state
    }
  }
);

const loginSlice = createSlice({
  name: 'auth',
  initialState:{
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state when login is in progress
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle the fulfilled state when login is successful
      .addCase(login.fulfilled, (state, action) => {
   
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.error = null;
      })
      // Handle the rejected state when login fails
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message in the state
      });
  }
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
