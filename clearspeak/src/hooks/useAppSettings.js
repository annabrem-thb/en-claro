import { useState, useEffect } from 'react';

/**
 * useAppSettings Hook
 * 
 * Core configuration manager. Handles global application settings and 
 * automatically synchronizes them with localStorage. Uses lazy initialization 
 * to prevent redundant storage reads during re-renders.
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
  const [textScale, setTextScale] = useState(() => Number(localStorage.getItem('cfg_text_scale')) || 100);

  // Persist settings to localStorage whenever any configuration changes
  useEffect(() => {
    localStorage.setItem('cfg_lang', language);
    localStorage.setItem('cfg_theme', theme);
    localStorage.setItem('cfg_addons', JSON.stringify(a11yAddons));
    localStorage.setItem('cfg_inclusive', JSON.stringify(inclusiveOptions));
    localStorage.setItem('cfg_difficulty', String(userDifficulty));
    localStorage.setItem('cfg_goal', String(dailyGoal));
    localStorage.setItem('cfg_text_scale', String(textScale));
  }, [language, theme, a11yAddons, inclusiveOptions, userDifficulty, dailyGoal, textScale]);

  return {
    language, setLanguage, theme, setTheme, a11yAddons, setA11yAddons,
    inclusiveOptions, setInclusiveOptions, dailyGoal, setDailyGoal, userDifficulty, setUserDifficulty, textScale, setTextScale
  };
}