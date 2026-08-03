// TypeScript contracts for the translation dictionary built by `src/locales`
// (see `buildTranslation` in `src/locales/index.js`). Not currently enforced by
// a type-checker (no tsconfig/tsc step exists yet), but documents the intended
// shape of each namespace.

export interface IntroNamespace {
  subtitle: string;
  chooseLanguage: string;
  appMode: string;
  modeClassic: string;
  modeGamified: string;
  a11y: string;
  lrs: string;
  contrast: string;
  vision: string;
  big: string;
  spacing: string;
  ruler: string;
  color: string;
  motion: string;
  desaturation: string;
  bionic: string;
  voice: string;
  zen: string;
}

export interface CommonNamespace {
  save: string;
  cancel: string;
  loading: string;
  success: string;
  error: string;
  close: string;
}

export interface ProfileNamespace {
  title: string;
  welcome: string;
  lastLogin: string;
  balance: string;
  itemsCount_zero: string;
  itemsCount_one: string;
  itemsCount_other: string;
  updateAvatar: string;
  membershipLevel: string;
}

export interface ErrorsNamespace {
  network: string;
  unauthorized: string;
  timeout: string;
}

export interface FeedbackNamespace {
  title: string;
  desc: string;
  nasaTitle: string;
  submit: string;
  thankYou: string;
  low: string;
  high: string;
  nasa: {
    mental: string;
    mentalDesc: string;
    physical: string;
    physicalDesc: string;
    temporal: string;
    temporalDesc: string;
    performance: string;
    performanceDesc: string;
    effort: string;
    effortDesc: string;
    frustration: string;
    frustrationDesc: string;
  };
}

export interface SurveyNamespace {
  susTitle: string;
  susAnchors: {
    stronglyDisagree: string;
    stronglyAgree: string;
  };
  sus: {
    q01: string;
    q02: string;
    q03: string;
    q04: string;
    q05: string;
    q06: string;
    q07: string;
    q08: string;
    q09: string;
    q10: string;
  };
}

export interface TranslationDictionary {
  appTitle: string;
  start: string;
  intro: IntroNamespace;
  common: CommonNamespace;
  profile: ProfileNamespace;
  errors: ErrorsNamespace;
  feedback: FeedbackNamespace;
  survey: SurveyNamespace;
  [key: string]: any;
}
