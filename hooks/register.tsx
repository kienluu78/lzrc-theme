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


// LZRC backdrop: a cream (or navy) ground, two slow glows, and the house 2x2
// monogram turning in the top-right corner inside a gold orbit ring.
// Pinned to the corner at a fixed size on any screen; the ground follows the
// light/dark preference, and Reduce Motion stills it.
const SCENE_ID = 'lzrc-orbit'

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
  <radialGradient id="ga"><stop offset="0" class="ga0"/><stop offset="1" class="ga1"/></radialGradient>
  <radialGradient id="gb"><stop offset="0" class="gb0"/><stop offset="1" class="gb1"/></radialGradient>
</defs>
<style>
  .ground { fill: #FAF8F5; }
  .ga0 { stop-color: #0D6B6B; stop-opacity: .10; } .ga1 { stop-color: #0D6B6B; stop-opacity: 0; }
  .gb0 { stop-color: #A67C2D; stop-opacity: .12; } .gb1 { stop-color: #A67C2D; stop-opacity: 0; }
  .tile { fill: none; stroke: #1B2A4A; stroke-opacity: .16; stroke-width: 2; }
  .glyph { font: 400 78px Georgia, 'Times New Roman', serif; fill: #1B2A4A; fill-opacity: .18; text-anchor: middle; dominant-baseline: central; }
  .glyph.z { fill: #0D6B6B; fill-opacity: .32; }
  .ring { fill: none; stroke: #A67C2D; stroke-width: 2; stroke-opacity: .35; stroke-dasharray: 220 60 40 60; }
  .ring-2 { fill: none; stroke: #A67C2D; stroke-width: 1; stroke-opacity: .18; }
  .bead { fill: #A67C2D; fill-opacity: .55; }
  .mark { transform: translate(-230px, 230px) scale(.85); }
  .spin { animation: spin 90s linear infinite; }
  .orbit { animation: spin 60s linear infinite reverse; }
  .drift-a { animation: drift-a 40s ease-in-out infinite alternate; }
  .drift-b { animation: drift-b 52s ease-in-out infinite alternate; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes drift-a { to { transform: translate(140px, -90px); } }
  @keyframes drift-b { to { transform: translate(-160px, 70px); } }
  @media (max-width: 700px) { .mark { transform: translate(-112px, 112px) scale(.42); } }
  @media (prefers-color-scheme: dark) {
    .ground { fill: #111A2E; }
    .ga0 { stop-color: #1F8A8A; stop-opacity: .22; } .ga1 { stop-color: #1F8A8A; }
    .gb0 { stop-color: #C4A35A; stop-opacity: .14; } .gb1 { stop-color: #C4A35A; }
    .tile { stroke: #F3EEE6; stroke-opacity: .14; }
    .glyph { fill: #F3EEE6; fill-opacity: .16; }
    .glyph.z { fill: #3FA3A3; fill-opacity: .4; }
    .ring { stroke: #C4A35A; stroke-opacity: .45; }
    .ring-2 { stroke: #C4A35A; stroke-opacity: .22; }
    .bead { fill: #C4A35A; fill-opacity: .7; }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin, .orbit, .drift-a, .drift-b { animation: none; }
  }
</style>
<rect class="ground" width="100%" height="100%"/>
<g class="drift-a"><circle fill="url(#ga)" cx="15%" cy="85%" r="520"/></g>
<g class="drift-b"><circle fill="url(#gb)" cx="85%" cy="15%" r="460"/></g>
<svg x="100%" y="0" overflow="visible">
  <g class="mark">
    <g class="orbit">
      <circle class="ring" r="170"/>
      <circle class="ring-2" r="196"/>
      <circle class="bead" cx="170" cy="0" r="5"/>
    </g>
    <g class="spin">
      <rect class="tile" x="-110" y="-110" width="108" height="108" rx="6"/>
      <rect class="tile" x="2" y="-110" width="108" height="108" rx="6"/>
      <rect class="tile" x="-110" y="2" width="108" height="108" rx="6"/>
      <rect class="tile" x="2" y="2" width="108" height="108" rx="6"/>
      <text class="glyph" x="-56" y="-56">L</text>
      <text class="glyph z" x="56" y="-56">Z</text>
      <text class="glyph" x="-56" y="56">R</text>
      <text class="glyph" x="56" y="56">C</text>
    </g>
  </g>
</svg>
</svg>`

const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: SCENE_ID } }

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

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_ID) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="The LZRC monogram turning slowly inside a gold orbit ring" isInteractive />
  })
}
