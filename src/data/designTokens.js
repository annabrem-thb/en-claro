// Slider limits for the six design tokens (Settings > Comfort) and the
// quick-toggle presets that write straight into them. Kept together so a
// preset can never sit outside the range its slider can show.
// letterSpacing / wordSpacing maxima are 2x the WCAG 1.4.12 values.
export const DESIGN_TOKEN_SLIDERS = [
  { key: 'fontSizeExercise', min: 16, max: 32, step: 1, unit: 'px' },
  { key: 'fontSizeUi', min: 16, max: 28, step: 1, unit: 'px' },
  { key: 'lineHeight', min: 1.5, max: 2.2, step: 0.1, unit: '' },
  { key: 'letterSpacing', min: 0, max: 0.24, step: 0.02, unit: 'em' },
  { key: 'wordSpacing', min: 0, max: 0.32, step: 0.02, unit: 'em' },
  { key: 'paragraphSpacing', min: 0, max: 3, step: 0.25, unit: 'em' },
];

export const BIGGER_TEXT_PRESET = { fontSizeUi: 20, fontSizeExercise: 20 };

export const MORE_SPACING_PRESET = {
  lineHeight: 2,
  letterSpacing: 0.15,
  wordSpacing: 0.32,
};

export const LRS_PRESET = {
  lineHeight: 1.75,
  letterSpacing: 0.08,
  wordSpacing: 0.2,
};
