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
  ueqTitle: string;
  ueq: {
    obstructive: string; supportive: string;
    complicated: string; easy: string;
    inefficient: string; efficient: string;
    confusing: string; clear: string;
    boring: string; exciting: string;
    notInteresting: string; interesting: string;
    conventional: string; inventive: string;
    usual: string; leadingEdge: string;
  };
}

// The main dictionary schema wrapping all namespaces
export interface TranslationDictionary {
  common: CommonNamespace;
  profile: ProfileNamespace;
  errors: ErrorsNamespace;
  feedback: FeedbackNamespace;
}