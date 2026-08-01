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

export interface TranslationDictionary {
  appTitle: string;
  start: string;
  intro: IntroNamespace;
  common: CommonNamespace;
  profile: ProfileNamespace;
  errors: ErrorsNamespace;
  feedback: FeedbackNamespace;
  survey: SurveyNamespace
  [key: string]: any;
}
