import React, { useId } from 'react';
import './art.css';

// Adapted from scripts/build-research-header.mjs. Each root fits 280 x 330.
// Usage: <svg viewBox="0 0 280 330"><RobotArt /></svg>; labels belong in HTML.
const paint = (name) => `var(--pa-${name})`;
const P = ({ d, f = 'none', s = 'edge', ...props }) => (
  <path d={d} fill={f === 'none' ? f : paint(f)} stroke={s === 'none' ? s : paint(s)} {...props} />
);
const Person = () => <g fill={paint('human')}><circle cx="10" cy="7" r="7" /><path d="M0 29v-5a10 10 0 0 1 20 0v5Z" /></g>;

export function RobotArt() {
  return <g className="pv-art pv-robot" transform="translate(12 23) scale(.94)" aria-hidden="true">
    <P d="M0 36h23v33H0Z" f="shade" s="proposal" />
    <P d="M7 43h23v33H7Z" f="paper" s="proposal" />
    <P d="M12 51h12m-12 7h12m-12 7h7M30 62h11" s="proposal" />
    <P d="m59 229-11 19v23l55 8 23-15-7-28Zm78 2-9 29 18 16 61-5v-25l-21-19Z" f="metal" />
    <P d="M60 251v16m13-15v17m13-17v18m66-18v17m15-16v17m16-16v14" />
    <P d="m78 216 9 28 30-5 7-26m16 1 7 30 29-4 1-26" f="shade" />
    <P d="m74 143 95-5 30 24-7 65-86 12-39-24-7-48Z" f="paper" />
    <P d="m169 138 30 24-7 65-23 6Z" f="metal" />
    <P d="m91 167 64-6 17 15-5 29-65 8-17-13Z" f="shade" />
    <P d="m99 177 6 23 9-18 8 17 6-24m25 1c-19-8-27 27-4 23" s="human" strokeWidth="3.2" />
    <circle cx="64" cy="162" r="20" fill={paint('metal')} />
    <circle cx="64" cy="162" r="10" fill={paint('human-soft')} />
    <P d="M55 181 36 206 57 232l20-15-17-15 11-15" f="paper" />
    <P d="m49 228 14 12 21-8-5-17-9-3-3 14-8-5Z" f="paper" />
    <circle cx="192" cy="161" r="15" fill={paint('metal')} />
    <P d="m199 166 30-13 14 11-32 30-18-12Zm31-15 20-7 10 10-3 13-23 3Z" f="paper" />
    <P d="M101 128v18l49-3v-20" f="metal" />
    <P d="m54 25 108-12 39 26v94l-120 18-34-24V45Z" f="paper" />
    <P d="m162 13 39 26v94l-27-13V32Z" f="metal" />
    <P d="m66 34 96-10 15 13-99 12Z" f="shade" s="none" />
    <P d="M65 64q0-10 10-12l80-9q12-1 12 11v54q0 11-11 13l-79 11q-12 1-12-10Z" f="screen" />
    <g className="pv-blink pv-motion"><P d="M84 82q8-9 16-2m32-7q8-9 16-2" s="eyes" strokeWidth="6" /></g>
    <P d="M106 107q12 6 22-3" s="eyes" strokeWidth="2.5" />
    <ellipse cx="47" cy="83" rx="11" ry="22" fill={paint('metal')} />
    <ellipse cx="47" cy="83" rx="5" ry="12" fill={paint('human-soft')} />
    <P d="M85 21 81 3" strokeWidth="4" />
    <circle cx="80" cy="0" r="6" fill={paint('human')} />
    <P d="M184 56v43m7-39v33" />
    <circle cx="59" cy="40" r="2.3" fill={paint('edge')} />
    <circle cx="62" cy="124" r="2.3" fill={paint('edge')} />
    <g transform="translate(198 179) rotate(8)">
      <P d="M0 0h64l9 10v101H0Z" f="proposal-soft" s="proposal" />
      <P d="M6 7h53l7 7v89H6Z" f="paper" s="proposal" />
      <P d="M19-4h30v13H19Z" f="metal" s="proposal" />
      <P d="m16 39 12-12 12 12m-20-3v15h15V35M17 66h38M17 77h27M17 88h34" s="proposal" strokeWidth="2.5" />
    </g>
  </g>;
}

export function EvidenceArt() {
  return <g className="pv-art" transform="translate(46 24)" aria-hidden="true">
    <P d="M5 70 151 43l25 23v179L27 267 5 248Z" f="human-soft" s="human" />
    <P d="m150 45 24 23v178l-22-17Z" f="shade" s="human" />
    <P d="M10 20 148 9v20L10 40Zm4-10L139 0v10L14 21Z" f="shade" s="human" />
    <P d="m18 15 135-11 9 10v147L23 173Z" f="paper" s="human" />
    <P d="m143 6 1 17 17-1" f="shade" s="human" />
    <g transform="translate(35 45)" stroke="none"><Person /></g>
    <P d="M75 48h61M75 63h47M36 94h98M36 108h82M36 137h65" s="muted" strokeWidth="3" />
    <P d="M32 87h106" s="human" className="pv-scan pv-motion" opacity=".55" />
    <P d="m10 172 145-17v87L27 267 10 251Z" f="human-soft" s="human" />
    <P d="M32 183h92" s="human" strokeWidth="3" />
    <g transform="translate(32 203) scale(.55)" stroke="none"><Person /></g>
    <P d="M31 236h16v13H31Zm8-4v4m-4 5h2m4 0h2m-8 4h8" s="proposal" />
    <P d="M62 207h16v14H62Zm56 0h16v14h-16Z" s="human" />
    <P d="M90 207h16v14H90Z" f="human" s="human" />
    <P d="M62 235h16v14H62Zm28 0h16v14H90Zm28 0h16v14h-16Z" s="proposal" />
    <P d="M93 238h10v8H93Z" f="proposal" s="none" />
  </g>;
}

export function HomeArt({ tenure = 'owner' } = {}) {
  return <g className="pv-art" aria-hidden="true">
    {tenure === 'renter' ? <g transform="translate(68 42) scale(1.9)" strokeWidth="1.5">
      <P d="m-5 105 27 14 47-13-25-16Z" f="shade" />
      <P d="M0 16 44 4l23 15v83l-44 13L0 102Z" f="shade" />
      <P d="m23 31 44-12v83l-44 13Z" f="paper" />
      <P d="m-3 15 47-13 27 15-48 15Z" f="metal" />
      <P d="M3 14 43 5l17 10-37 10Z" f="bg" />
      <P d="m33 11 12-3 9 6-12 3ZM42 9v7m4-8v7" f="metal" />
      {[42, 65, 88].map(y => <g key={y}>
        <P d={`M6 ${y - 9}l10 5v12l-10-5Zm25 1 12-3v15l-12 3Zm19-5 11-3v15l-11 3Z`} f="water" s="paper" />
        <P d={`M37 ${y - 10}v15m18-20v15`} s="paper" />
      </g>)}
      <P d="m32 35 10-3v13l-10 3Zm19 18 9-3v13l-9 3Z" f="check" s="none" />
      {[58, 81].map(y => <g key={y}>
        <P d={`M26 ${y}l41-11 5 5-41 12Z`} f="shade" />
        <P d={`M31 ${y + 6}v-9l41-11v9m-31-5v9m10-12v9m10-12v9`} />
      </g>)}
      <P d="m47 94 12-3v13l-12 4Z" f="human" />
      <P d="m46 108 16-5 5 3-16 5" />
      <g transform="translate(-13 84)">
        <P d="M0 0h24l6 6v28H0Z" f="paper" s="proposal" />
        <P d="M24 0v7h6M5 11h18M5 17h13m-12 9 4-4 3 3 5-2" s="proposal" />
      </g>
    </g> : <g transform="translate(47 43) scale(1.9)" strokeWidth="1.6">
      <P d="m-2 91 49 23 46-25-47-21Z" f="shade" />
      <P d="M7 43 44 22l40 23v43l-37 21L7 88Z" f="paper" />
      <P d="m47 59 37-14v43l-37 21Z" f="shade" />
      <P d="M60 15V3l12 4v19" f="coral-soft" />
      <P d="m58 3 7-3 11 5-5 4Z" f="paper" />
      <P d="m-1 45 44-38 49 35-45 23Z" f="human" />
      <P d="m10 46 35-29m-25 35 36-27m-25 32 36-24m-25 29 36-24" s="human-soft" opacity=".65" />
      <P d="m1 49 46 22 42-23" />
      <P d="m14 58 17 8v18l-17-8Zm45 5 15-7v19l-15 7Z" f="water" s="paper" />
      <P d="m22 62 0 17m-8-13 17 8m35-15v20m-7-7 15-7" s="paper" />
      <P d="m35 81 10 5v21l-10-5Z" f="human" />
      <circle cx="42" cy="94" r="1.4" fill={paint('paper')} stroke="none" />
      <P d="m30 101 16 8-7 4-16-8Zm-7 6 16 8-6 3-16-8Z" f="paper" />
      <P d="M7 91 14 94v8l-9-4ZM74 93l10-5v8l-10 5Z" f="land" s="green" />
      <g transform="translate(71 128)">
        <circle r="6" fill={paint('check-soft')} stroke={paint('check')} />
        <P d="M6 0h15m-5 0v5m5-5v4" s="check" strokeWidth="2.8" />
      </g>
    </g>}
  </g>;
}

const riverOutline = 'M109 29c27 25-25 43-21 66s53 23 34 51-40 22-38 61l15 8c-4-29 15-37 30-54s20-38-10-56-24-19-2-40 14-28 6-36Z';
const riverLine = 'M114 33c17 20-27 43-19 64s54 24 27 52-27 29-29 60';

function BasinHouse({ x, y, scale, roof }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeWidth="1.8">
    <P d="m0 25 29-17 32 19v42L30 87 0 69Z" f="paper" />
    <P d="m30 44 31-17v42L30 87Z" f="shade" />
    <P d="m-6 29 35-32 39 29-37 21Z" f={roof} />
    <P d="m5 30 25-24m-13 31 25-23m-13 30 26-22" s="paper" opacity=".35" />
    <P d="m10 46 10 6v14L10 60Zm33 7 9-5v15l-9 5Z" f="water" s="none" />
    <P d="m15 49 0 14m-5-10 10 6m28-7v15m-5-4 9-5" s="paper" strokeWidth="1.2" />
    <P d="m9 65 10 6v10L9 75Z" f="edge" s="none" />
  </g>;
}

export function RiverArt({ uid } = {}) {
  const fallback = useId();
  const prefix = uid ?? fallback;
  const riverId = `${prefix}-river-mask`;
  const rainId = `${prefix}-rain-mask`;
  return <g className="pv-art" transform="translate(27 39)" strokeWidth="1.6" aria-hidden="true">
    <defs>
      <clipPath id={riverId}><path d={riverOutline} /></clipPath>
      <clipPath id={rainId}><path d="M106 19h82v40h-82Z" /></clipPath>
    </defs>
    <P d="m4 178 136 53 72-131v43L140 273 4 219Z" f="metal" />
    <P d="m5 193 135 54 71-131M5 208l135 54 71-131" />
    <P d="m4 178 64-148 74-7 70 77-72 131Z" f="land" s="green" />
    <P d="m17 148 42-98 16-9 31 9-38 57-22 50Z" f="hill" s="none" />
    <P d="M48 100 68 53l20-8M27 155l23-23 21-10m79-50 21 29-12 17M140 201l17-14 16-1" s="green" />
    <P d="M99 66c-25 17-17 36 2 49s18 24 4 40-29 30-28 46l24 12c1-25 30-45 42-67s-12-32-25-45-8-23-5-29Z" f="water-soft" s="none" opacity=".4" />
    <P d={riverOutline} f="water-soft" s="water" />
    <P d={riverLine} s="water" opacity=".45" />
    <P d="M82 61q-5 15 12 23m-22-10 10 4m70-32q-23-4-28 16m-5-18 8 5" s="water" strokeWidth="2.4" />
    <g clipPath={`url(#${riverId})`}>
      <P d={riverLine} s="paper" strokeWidth="2.6" strokeDasharray="5 15" className="pv-water pv-motion" />
    </g>
    <P d="M110 17c-13-1-12-19 0-20 5-17 29-17 35-4 16-10 30-1 29 10 19-2 23 16 9 19Z" f="bg" s="water" />
    <P d="M117 9q4-9 16-7m21 5q9-7 16 3" s="shade" />
    <g clipPath={`url(#${rainId})`}>
      <P d="m116 25-4 9m24-9-4 9m24-9-4 9m24-9-4 9" s="water" strokeWidth="2.5" className="pv-rain pv-motion" />
      <P d="m127 18-3 7m24-7-3 7m24-7-3 7" s="water" className="pv-rain pv-rain-back pv-motion" />
    </g>
    <P d="M77 125q29-29 69-16M81 140q15 37 47 44" s="human" strokeDasharray="3 4" />
    <BasinHouse x={127} y={87} scale={.66} roof="water" />
    <BasinHouse x={56} y={107} scale={.56} roof="human" />
    <BasinHouse x={116} y={164} scale={.49} roof="metal" />
    <P d="m62 144 28 11-3 15-30-12Z" f="human-soft" s="human" />
    <P d="m65 143 8-4 6 7 8-3 9 8" s="human" strokeWidth="3" />
    <P d="M78 166v39m-8-30h8m-5 8h5m-8 8h8m-5 8h5" s="paper" strokeWidth="4" />
    <P d="M78 166v39m-8-30h8m-5 8h5m-8 8h8m-5 8h5" />
    <P d="m81 188 9-4v8Z" f="coral" s="none" />
    {[[74, 29], [180, 108], [30, 132]].map(([x, y]) => <g key={x} transform={`translate(${x} ${y})`}>
      <P d="M0 7v13" strokeWidth="3" />
      <P d="M-8 10-5-3 0-12 7-2 10 10 1 14Z" f="hill" s="green" />
    </g>)}
  </g>;
}

export function ValidatorArt({ accepted = false, checks = [accepted, accepted, accepted] } = {}) {
  return <g className="pv-art pv-validator" data-accepted={accepted ? 'true' : 'false'} transform="translate(42 12) scale(.96)" aria-hidden="true">
    <P d="M7 25 174 14l21 21v225l-168 15L7 258Z" f="check-soft" s="check" />
    <P d="m174 14 21 21v225l-21-18Z" f="metal" s="check" />
    <P d="M21 46h149v181H21Z" f="bg" s="check" />
    <P d="M21 105h149M21 165h149" s="shade" />
    <P d="M41 25v-8a22 22 0 0 1 44 0v8" f="paper" s="check" />
    <P d="M47 15h3m3-11 2 3m8-8v4m10 1-2 3m5 8h3M63 17 73 3" s="check" />
    <P d="M128 22V9h25v12m-29-13h33v-9h-33Z" f="metal" s="check" />
    <P d="m49 66-10 10 10 10m23-20 10 10-10 10m-10-23-4 26" s="muted" strokeWidth="3" />
    <P d="M47 130v-6a12 12 0 0 1 24 0v6m-29 0h34v25H42Zm17 9v7" s="muted" strokeWidth="3" />
    <P d="M41 209v-14h9v14m7 0v-23h9v23m7 0v-32h9v32" s="muted" />
    {[76, 136, 196].map((y, index) => <g key={y} data-check={checks[index]} transform={`translate(128 ${y})`}>
      <P d="m0 0 7 7 15-19" s="human" strokeWidth="3.5" className="pv-validation-check" />
      <P d="m2-9 17 17m0-17L2 8" s="coral" strokeWidth="3.5" className="pv-validation-cross" />
    </g>)}
    <P d="M37 244h77" strokeWidth="6" />
    <P d="M46 244h20" s="check" strokeWidth="4" />
    <P d="M182 47v23m0 9v23m0 9v23" />
    {[[16, 37], [164, 28], [18, 252], [163, 247]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="2.3" fill={paint('edge')} />)}
    <circle cx="151" cy="245" r="6" className="pv-status-light" />
    <P d="M48 266h100v44l-10-5-10 5-10-5-10 5-10-5-10 5-10-5-10 5-10-5-10 5Z" f="paper" s="check" />
    <P d="M68 283h59" s="muted" />
    {[68, 98, 127].map(x => <circle key={x} cx={x} cy="283" r="5" fill={paint('paper')} />)}
    <P d="M62 298h11m19 0h11m19 0h11" />
  </g>;
}

export function ResourceArt({ resources = 6 } = {}) {
  return <g className="pv-art" transform="translate(32 40)" aria-hidden="true">
    <P d="m10 112 170-12 25 19v119L35 249 10 230Z" f="human-soft" s="human" />
    <P d="m180 100 25 19v119l-25-19Z" f="metal" />
    <P d="M65 110V84q0-9 9-9h58q9 0 9 9v21m-62 4V89h48v17" f="paper" s="human" strokeWidth="3" />
    <P d="m10 112 170-12v65L35 179 10 163Z" f="paper" s="human" />
    <P d="M35 179v70" s="human" />
    <P d="m92 165 22-2v23l-22 2Z" f="check-soft" s="check" />
    <P d="m101 173 5-.5v8" s="check" />
    <P d="M60 222h89" s="human" strokeWidth="3" />
    <g transform="translate(95 37)">
      <circle r="31" fill={paint('paper')} stroke={paint('check')} />
      <P d="M-22 5a22 22 0 0 1 44 0" s="check" strokeWidth="3" />
      <P d="M-21 3h5M-15-12l4 4M0-19v5m15 2-4 4m10 11h-5" s="check" />
      <g transform={`rotate(${(resources - 6) * 12} 0 7)`}><P d="M0 7 12-9" s="human" strokeWidth="3" /></g>
      <circle cy="7" r="3" fill={paint('human')} stroke="none" />
    </g>
  </g>;
}
