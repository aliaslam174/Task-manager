import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web
import { combineReducers } from 'redux'; // Used to combine reducers
import loginReducer from './features/loginSlice'; // Import the login slice
import { Profileupdateapi } from './compnent/api/Profileupdateapi'; // Adjust the path if necessary
import { Getalluserapi } from './compnent/api/Getalluserapi'; // Adjust the path if necessary
import { projectApi } from './compnent/api/projectApi'; // Adjust the path if necessary

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all reducers, including RTK Query reducers
const rootReducer = combineReducers({
  auth: loginReducer, // Auth slice reducer
  [Profileupdateapi.reducerPath]: Profileupdateapi.reducer, // RTK Query Profile update reducer
  [Getalluserapi.reducerPath]: Getalluserapi.reducer, // RTK Query Get All Users reducer
  [projectApi.reducerPath]: projectApi.reducer, // RTK Query Get All projects reducer
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with middleware from RTK Query
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for persisted state
    }).concat(Profileupdateapi.middleware, Getalluserapi.middleware,projectApi.middleware), // Add RTK Query middleware
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
