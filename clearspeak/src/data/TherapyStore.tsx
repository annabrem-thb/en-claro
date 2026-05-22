import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the strict application phases to manage cognitive load
export type AppPhase = 'DASHBOARD' | 'EXERCISE' | 'REWARD_CHOICE' | 'GARDEN';

interface TherapyState {
  currentPhase: AppPhase;
  competencePoints: number;
  unlockedPlants: string[];
}

type TherapyAction =
  | { type: 'START_EXERCISE' }
  | { type: 'COMPLETE_EXERCISE' }
  | { type: 'CHOOSE_REWARD'; payload: string }
  | { type: 'GO_TO_DASHBOARD' }
  | { type: 'VIEW_GARDEN' };

const initialState: TherapyState = {
  currentPhase: 'DASHBOARD',
  competencePoints: 0,
  unlockedPlants: [],
};

function therapyReducer(state: TherapyState, action: TherapyAction): TherapyState {
  switch (action.type) {
    case 'START_EXERCISE':
      // Transition to a sterile environment; zero distractions
      return { ...state, currentPhase: 'EXERCISE' };
      
    case 'COMPLETE_EXERCISE':
      // Present the user with a choice to foster autonomy (SDT)
      return { ...state, currentPhase: 'REWARD_CHOICE' };
      
    case 'CHOOSE_REWARD':
      // Reward choice validates competence and grants autonomy.
      // Positive-Only Gamification Loop: Points ONLY increase. No punitive 
      // mechanics (e.g., losing points, wilting plants) exist in this state.
      return {
        ...state,
        competencePoints: state.competencePoints + 1,
        unlockedPlants: [...state.unlockedPlants, action.payload],
        currentPhase: 'GARDEN',
      };
      
    case 'GO_TO_DASHBOARD':
      return { ...state, currentPhase: 'DASHBOARD' };
      
    case 'VIEW_GARDEN':
      return { ...state, currentPhase: 'GARDEN' };
      
    default:
      return state;
  }
}

const TherapyContext = createContext<{
  state: TherapyState;
  dispatch: React.Dispatch<TherapyAction>;
} | undefined>(undefined);

export const TherapyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(therapyReducer, initialState);

  return (
    <TherapyContext.Provider value={{ state, dispatch }}>
      {children}
    </TherapyContext.Provider>
  );
};

export const useTherapyStore = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapyStore must be used within a TherapyProvider');
  }
  return context;
};