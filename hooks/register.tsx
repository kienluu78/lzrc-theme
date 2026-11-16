import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// LZRC house palette: cream paper and navy ink by day, a navy night by dark.
// Teal leads, gold stands in for amber, red and green keep their meaning.
const { theme, problems } = makeColors({
  label: 'LZRC House',
  roles: { accent: '#0D6B6B', danger: '#B3392F', success: '#4E7D3A', warning: '#A67C2D', pro: '#5B4B8A' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#F3EEE6',
        'surface-1': '#F7F3EC',
        'surface-2': '#FAF8F5',
        'text-primary': '#1B2A4A',
        'text-secondary': '#3A4763',
        'text-muted': '#5C6578',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#111A2E',
        'surface-1': '#16223B',
        'surface-2': '#1B2A4A',
        'surface-3': '#1F2F50',
        'text-primary': '#F3EEE6',
        'text-secondary': '#D4CBB8',
        'text-muted': '#A9AFBC',
      },
    },
  },
})


// The desktop app (build 2.1.325) never asks a mod to draw an animated scene,
// and refuses image grounds, so the monogram is a still vector ground.
// The LZRC monogram as a still vector ground in the top-right corner. Palette
// names follow light and dark; strokes keep their width at any window size.
const MONOGRAM: ThemeSetArgs['backdrop'] = {
  vector: {
    viewBox: [256, 160],
    paths: [
      { d: "M206.00 30.00a22.00 22.00 0 1 0 44.00 0a22.00 22.00 0 1 0 -44.00 0Z", strokeWidth: 1, color: 'border-strong' },
      { d: "M236.96 13.15A19.08 19.08 0 0 1 243.04 41.75M236.96 46.85A19.08 19.08 0 0 1 210.07 36.53M208.96 28.67A19.08 19.08 0 0 1 231.97 11.34", strokeWidth: 2, color: 'fill-warning' },
      { d: "M245.98 30.00a1.1 1.1 0 1 0 2.2 0a1.1 1.1 0 1 0 -2.2 0Z", color: 'fill-warning' },
      { d: "M216.33 17.65H227.10A0.67 0.67 0 0 1 227.78 18.33V29.10A0.67 0.67 0 0 1 227.10 29.78H216.33A0.67 0.67 0 0 1 215.65 29.10V18.33A0.67 0.67 0 0 1 216.33 17.65ZM228.90 17.65H239.67A0.67 0.67 0 0 1 240.35 18.33V29.10A0.67 0.67 0 0 1 239.67 29.78H228.90A0.67 0.67 0 0 1 228.22 29.10V18.33A0.67 0.67 0 0 1 228.90 17.65ZM216.33 30.22H227.10A0.67 0.67 0 0 1 227.78 30.90V41.67A0.67 0.67 0 0 1 227.10 42.35H216.33A0.67 0.67 0 0 1 215.65 41.67V30.90A0.67 0.67 0 0 1 216.33 30.22ZM228.90 30.22H239.67A0.67 0.67 0 0 1 240.35 30.90V41.67A0.67 0.67 0 0 1 239.67 42.35H228.90A0.67 0.67 0 0 1 228.22 41.67V30.90A0.67 0.67 0 0 1 228.90 30.22Z", strokeWidth: 1.5, color: 'border-stronger' },
      { d: "M219.24 20.35L219.24 27.08L224.18 27.08M219.24 39.65L219.24 32.92L222.50 32.92A1.68 1.68 0 0 1 222.50 36.29L219.24 36.29M221.49 36.29L224.18 39.65M236.76 34.20A2.59 3.37 0 1 0 236.76 38.37", strokeWidth: 2.5, color: 'text-muted' },
      { d: "M231.82 20.35L236.76 20.35L231.82 27.08L236.76 27.08", strokeWidth: 2.5, color: 'text-accent' },
    ],
  },
}

const LOOK: ThemeSetArgs = { colors: theme, backdrop: MONOGRAM }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })
}
