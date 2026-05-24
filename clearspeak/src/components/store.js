import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from '../components/analyticsSlice';

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    // Future reducers (e.g. auth, settings) can be added here
  },
});

export default store;