import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './features/loginSlice'; // Import the login slice

const store = configureStore({
  reducer: {
    auth: loginReducer, // Add the login reducer to the store
  },
});

export default store;