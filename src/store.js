import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for web
import { combineReducers } from 'redux'; // Import combineReducers
import loginReducer from './features/loginSlice'; // Import the login slice

const persistConfig = {
  key: 'root',
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  auth: loginReducer,
  // Add other slices here if needed
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Disable serializableCheck for persisted state
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
