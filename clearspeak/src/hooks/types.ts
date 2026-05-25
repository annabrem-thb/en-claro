/**
 * Defines the exact shape of our translation namespaces.
 * This ensures that whenever a new language is added, it MUST implement all keys.
 * It also provides autocomplete and type safety when using the `useTranslation` hook.
 */
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
    mental: string; mentalDesc: string;
    physical: string; physicalDesc: string;
    temporal: string; temporalDesc: string;
    performance: string; performanceDesc: string;
    effort: string; effortDesc: string;
    frustration: string; frustrationDesc: string;
  };
}

export interface SurveyNamespace {
  susTitle: string;
  susAnchors: {
    stronglyDisagree: string;
    stronglyAgree: string;
  };
  sus: {
    q01: string; q02: string; q03: string; q04: string; q05: string;
    q06: string; q07: string; q08: string; q09: string; q10: string;
  };
}

// The main dictionary schema wrapping all namespaces
export interface TranslationDictionary {
  common: CommonNamespace;
  profile: ProfileNamespace;
  errors: ErrorsNamespace;
  feedback: FeedbackNamespace;
  survey: SurveyNamespace;
}