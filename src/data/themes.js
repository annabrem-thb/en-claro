// Per-theme colors used throughout the app via Tailwind arbitrary-value
// classes. `accent` and `buttonText` are chosen so both real rendered text
// pairings pass WCAG AAA (7:1): each theme's `accent` text on its own `bg`,
// and `buttonText` on its own `button` background — verified in
// contrastCompliance.test.js. The originals (accent ~4.4-6.2:1 on bg, black
// button text 5.3-7.3:1 on button) were lighter/pastel and didn't clear 7:1
// for any theme; `bg`/`border` are unchanged since page text was already
// well above 7:1 against every theme's background.
//
// `ring` mirrors each theme's `hex`/`button` hue as a literal `ring-[#...]`
// Tailwind class — used by WeeklyCalendar.jsx's "today" indicator so the
// Garden's own chrome (and not just its growth icons) actually tracks the
// selected theme instead of a fixed indigo regardless of theme.
//
// Lives in its own module (not inlined in App.jsx) because exporting a
// plain constant from a component file breaks React Fast Refresh.
export const THEMES = {
  Natur: {
    accent: 'text-[#335746]',
    bg: 'bg-[#F4F1EA]',
    button: 'bg-[#4B5D46]',
    buttonText: 'text-white',
    border: 'border-[#D0D6CE]',
    ring: 'ring-[#4B5D46]',
    hex: '#4B5D46',
  },
  Musik: {
    accent: 'text-[#5E427B]',
    bg: 'bg-[#F3F0F5]',
    button: 'bg-[#634E74]',
    buttonText: 'text-white',
    border: 'border-[#D1C8D6]',
    ring: 'ring-[#634E74]',
    hex: '#634E74',
  },
  Kunst: {
    accent: 'text-[#6B4929]',
    bg: 'bg-[#F7F4F0]',
    button: 'bg-[#6E5135]',
    buttonText: 'text-white',
    border: 'border-[#DED4CA]',
    ring: 'ring-[#6E5135]',
    hex: '#6E5135',
  },
  Space: {
    accent: 'text-[#355469]',
    bg: 'bg-[#F0F3F5]',
    button: 'bg-[#455968]',
    buttonText: 'text-white',
    border: 'border-[#CAD4DE]',
    ring: 'ring-[#455968]',
    hex: '#455968',
  },
  Ocean: {
    accent: 'text-[#225858]',
    bg: 'bg-[#EFF5F5]',
    button: 'bg-[#325D5D]',
    buttonText: 'text-white',
    border: 'border-[#C4DBDB]',
    ring: 'ring-[#325D5D]',
    hex: '#325D5D',
  },
};
