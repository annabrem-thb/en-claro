/**
 * Core interface representing a complete NASA-TLX response.
 * Each metric typically ranges from 1 to 100 in digital adaptations.
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

export type AppVersion = 'basis' | 'vollversion';