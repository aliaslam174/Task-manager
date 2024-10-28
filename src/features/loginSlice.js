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
    role:null,
    totaluser:null,
    totalprojects:null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    totaluser: (state,action) => {
      console.log(action.payload)
      state.totaluser = action.payload;
    },
    totalproject: (state,action) => {
      console.log(action.payload)
      state.totalprojects = action.payload;
    },
    updateUserState(state, action) {
      console.log("updatestate",action.payload)
      state.user = action.payload;
      // Ensure payload structure is correct
      // if (action.payload?.data) {
      //   state.user = { ...state.user, ...action.payload.data };
      // } else {
      //   console.error("Payload does not contain 'data':", action.payload);
      // }
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
   console.log(action.payload.data.user.role)
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.role = action.payload.data.user.role;
        state.error = null;
      })
      // Handle the rejected state when login fails
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message in the state
      });
  }
});

export const { logout,updateUserState ,totaluser,totalproject} = loginSlice.actions;
export default loginSlice.reducer;
