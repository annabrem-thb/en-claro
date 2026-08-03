import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({ reducer: (state = {}) => state });
export default store;
