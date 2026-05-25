import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  // Tymczasowa, pusta funkcja stanu, by uniknąć błędu braku reduktora, 
  // dopóki nie stworzysz konkretnych logicznych plastrów (slices).
  reducer: (state = {}) => state,
});

export default store;