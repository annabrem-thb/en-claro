  };
}

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

// The main dictionary schema wrapping all namespaces
export interface TranslationDictionary {
  appTitle: string;
  start: string;
  intro: IntroNamespace;
  common: CommonNamespace;
  profile: ProfileNamespace;
  errors: ErrorsNamespace;
  feedback: FeedbackNamespace;
  survey: SurveyNamespace;

    // Fallback signature to safely allow legacy keys during the incremental migration
  [key: string]: any;
}
