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
 * Core interface representing a complete UEQ-Short response.
 * Each item uses a 7-point Likert scale (1 to 7).
 */
export interface UeqShortPayload {
  ueq1: number; // Obstructive (1) to Supportive (7)
  ueq2: number; // Complicated (1) to Easy (7)
  ueq3: number; // Inefficient (1) to Efficient (7)
  ueq4: number; // Confusing (1) to Clear (7)
  ueq5: number; // Boring (1) to Exciting (7)
  ueq6: number; // Not interesting (1) to Interesting (7)
  ueq7: number; // Conventional (1) to Inventive (7)
  ueq8: number; // Usual (1) to Leading edge (7)
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