import { StudyModeContext } from '../hooks/useStudyMode.js';
import { useStudyModeState } from '../hooks/useStudyModeState.js';

export function StudyModeProvider({ children }) {
  const studyMode = useStudyModeState();

  return (
    <StudyModeContext.Provider value={studyMode}>
      {children}
    </StudyModeContext.Provider>
  );
}
