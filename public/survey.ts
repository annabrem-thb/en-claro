/**
 * Core interface representing a complete NASA-TLX response.
 * Each metric ranges from 0 to 100 in steps of 5 (the slider in
 * SurveyComponent.tsx), the 21-tick raw-TLX scale.
 */
export interface NasaTlxPayload {
  mentalDemand: number;
  physicalDemand: number;
  temporalDemand: number;
  performance: number;
  effort: number;
  frustration: number;
}

/**
 * System Usability Scale (SUS) payload.
 * Standard 10 items, 5-point Likert scale (1=Strongly Disagree, 5=Strongly Agree).
 */
export interface SusPayload {
  sus01: number; sus02: number;
  sus03: number; sus04: number;
  sus05: number; sus06: number;
  sus07: number; sus08: number;
  sus09: number; sus10: number;
}

/**
 * User Experience Questionnaire - Short (UEQ-S) payload.
 * Standard 8 bipolar item pairs (4 pragmatic quality, 4 hedonic quality),
 * 7-point semantic differential scale (1=fully negative term, 7=fully
 * positive term — the app's digital adaptation of UEQ's usual -3..+3).
 */
export interface UeqPayload {
  ueq01: number; ueq02: number;
  ueq03: number; ueq04: number;
  ueq05: number; ueq06: number;
  ueq07: number; ueq08: number;
}

/**
 * Study-specific supplement to UEQ/SUS: only collected for a gamified
 * session (see SurveyComponent.tsx's isGamified gate), since these
 * questions target game elements that a basis-version session never
 * shows. gameElementFeedback is optional free text.
 */
export interface GamificationFeedbackPayload {
  gardenMotivation: number;
  badgeMotivation: number;
  gameDistraction: number;
  gameElementFeedback: string;
}

export type AppVersion = 'basis' | 'vollversion';