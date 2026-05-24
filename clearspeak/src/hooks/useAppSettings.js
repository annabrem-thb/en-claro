import { useState, useEffect } from 'react';

/**
 * Zarządza globalnymi ustawieniami aplikacji i synchronizuje je z localStorage.
 */
export function useAppSettings() {
  const [language, setLanguage] = useState(() => localStorage.getItem('cfg_lang') || 'de');
  const [theme, setTheme] = useState(() => localStorage.getItem('cfg_theme') || 'Natur');
  
  const [a11yAddons, setA11yAddons] = useState(() => {
    const sv = localStorage.getItem('cfg_addons');
    const migrated = localStorage.getItem('cfg_migrated_v3');
    if (!migrated) {
      localStorage.setItem('cfg_migrated_v3', 'true');
      return ['LRS', 'Spacing'];
    }
    return sv ? JSON.parse(sv) : ['LRS', 'Spacing'];
  });

  const [inclusiveOptions, setInclusiveOptions] = useState(() => {
    const sv = localStorage.getItem('cfg_inclusive');
    return sv ? JSON.parse(sv) : { adaptiveDifficulty: true, bigTargets: false, noFlash: false, audioRewards: false, extendedTime: false, zenMode: false, bionicReading: true, minimalistMode: false, muteNotifications: false, voiceAssistant: false };
  });

  const [dailyGoal, setDailyGoal] = useState(() => Number(localStorage.getItem('cfg_goal')) || 5);
  const [userDifficulty, setUserDifficulty] = useState(() => Number(localStorage.getItem('cfg_difficulty')) || 2);

  // Zapis do localStorage przy zmianie jakiegokolwiek z ustawień
  useEffect(() => {
    localStorage.setItem('cfg_lang', language);
    localStorage.setItem('cfg_theme', theme);
    localStorage.setItem('cfg_addons', JSON.stringify(a11yAddons));
    localStorage.setItem('cfg_inclusive', JSON.stringify(inclusiveOptions));
    localStorage.setItem('cfg_difficulty', String(userDifficulty));
    localStorage.setItem('cfg_goal', String(dailyGoal));
  }, [language, theme, a11yAddons, inclusiveOptions, userDifficulty, dailyGoal]);

  return {
    language, setLanguage, theme, setTheme, a11yAddons, setA11yAddons,
    inclusiveOptions, setInclusiveOptions, dailyGoal, setDailyGoal, userDifficulty, setUserDifficulty
  };
}