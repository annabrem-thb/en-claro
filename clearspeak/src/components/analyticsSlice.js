import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Array storing UX survey logs (NASA-TLX, UEQ)
  feedbackLogs: [],
  
  // Array prepared for future collection of errors from educational exercises
  errorLogs: [], 
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Receives the 'analytics/saveFeedback' action dispatched from App.jsx
    saveFeedback: (state, action) => {
      // action.payload contains the logEntry object (timestamp, pointsAtTime, metrics)
      state.feedbackLogs.push(action.payload);
    },
    
    // Receives an action recording a mistake in a specific task
    saveErrorLog: (state, action) => {
      state.errorLogs.push(action.payload);
    },
    
    // Function to clear history (e.g., upon user profile reset)
    clearAnalytics: (state) => {
      state.feedbackLogs = [];
      state.errorLogs = [];
    }
  },
});

export const { saveFeedback, saveErrorLog, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;