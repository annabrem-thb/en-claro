import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  // Temporary, empty state function to avoid missing reducer error until 
  // you create concrete logic slices.
  reducer: (state = {}) => state,
});

export default store;