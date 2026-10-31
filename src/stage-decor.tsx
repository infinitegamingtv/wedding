import React from 'react';

const bulbs = Array.from({length: 15}, (_, i) => {
  const angle = Math.PI + i * Math.PI / 14;
  return {x: 800 + Math.cos(angle) * 570, y: 659 + Math.sin(angle) * 535};
});
const footlights = Array.from({length: 17}, (_, i) => 160 + i * 80);
const sidelights = Array.from({length: 6}, (_, i) => 196 + i * 84);
const sparkles = [
  [91, 174], [262, 218], [442, 153], [612, 250], [986, 218], [1168, 152], [1337, 260], [1513, 174],
  [116, 478], [308, 555], [522, 476], [1082, 501], [1315, 559], [1492, 486],
];

export const StageDecor: React.FC<{active: boolean; celebrate?: boolean; award?: boolean}> = ({active, celebrate, award}) => <div className={`stage-decoration ${active ? 'stage-live' : ''} ${celebrate ? 'stage-gift' : ''} ${award ? 'stage-award' : ''}`} aria-hidden="true">
  <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
    <defs>
      <linearGradient id="stage-wall" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFF7F5"/><stop offset=".62" stopColor="#F7E4E8"/><stop offset="1" stopColor="#EBCBD5"/></linearGradient>
      <linearGradient id="stage-curtain" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#B86F8C"/><stop offset=".25" stopColor="#DE9CB3"/><stop offset=".55" stopColor="#F1BDD0"/><stop offset=".8" stopColor="#CF829F"/><stop offset="1" stopColor="#A86280"/></linearGradient>
      <linearGradient id="stage-floor" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#F7E4E5"/><stop offset=".55" stopColor="#EBC8D0"/><stop offset="1" stopColor="#D8AFBD"/></linearGradient>
      <linearGradient id="stage-spot" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FFFDF1" stopOpacity=".78"/><stop offset=".36" stopColor="#FFF1CF" stopOpacity=".31"/><stop offset="1" stopColor="#FFE1B8" stopOpacity="0"/></linearGradient>
      <radialGradient id="stage-glow"><stop stopColor="#FFF7D3" stopOpacity=".8"/><stop offset=".48" stopColor="#FCE2DC" stopOpacity=".35"/><stop offset="1" stopColor="#F7DFE7" stopOpacity="0"/></radialGradient>
      <radialGradient id="stage-bulb"><stop stopColor="#FFFFFF"/><stop offset=".48" stopColor="#FFE8BB"/><stop offset="1" stopColor="#DDA9B2"/></radialGradient>
      <radialGradient id="stage-award-halo"><stop stopColor="#FFF8D7" stopOpacity=".8"/><stop offset=".55" stopColor="#FFE4BD" stopOpacity=".25"/><stop offset="1" stopColor="#FFE4BD" stopOpacity="0"/></radialGradient>
      <filter id="stage-soft"><feGaussianBlur stdDeviation="13"/></filter>
    </defs>

    <rect width="1600" height="900" fill="url(#stage-wall)"/>
    <path d="M208 690V182C208 113 263 68 334 68h932c71 0 126 45 126 114v508" fill="#FFF9F6" stroke="#E2B9C5" strokeWidth="15"/>
    <path d="M238 690V188C238 130 282 94 340 94h920c58 0 102 36 102 94v502" fill="none" stroke="#F9E7E6" strokeWidth="9"/>
    <path d="M275 699V212C275 168 310 131 354 131h892c44 0 79 37 79 81v487" fill="none" stroke="#EAC8CF" strokeWidth="3"/>
    <ellipse cx="800" cy="387" rx="570" ry="330" fill="url(#stage-glow)"/>
    <ellipse className="stage-award-glow" cx="800" cy="415" rx="710" ry="410" fill="url(#stage-award-halo)"/>

    <g className="stage-beam stage-beam-left"><path d="M290 112 85 788H820Z" fill="url(#stage-spot)"/><ellipse cx="452" cy="722" rx="385" ry="68" fill="#FFF7DE" opacity=".32" filter="url(#stage-soft)"/></g>
    <g className="stage-beam stage-beam-right"><path d="M1310 112 780 788h735Z" fill="url(#stage-spot)"/><ellipse cx="1140" cy="722" rx="385" ry="68" fill="#FFF7DE" opacity=".32" filter="url(#stage-soft)"/></g>
    <g className="stage-beam stage-beam-center"><path d="M800 88 470 790h660Z" fill="url(#stage-spot)" opacity=".58"/></g>

    <path d="M0 691c350-27 1250-27 1600 0v209H0Z" fill="url(#stage-floor)"/>
    <path d="M0 691c350-27 1250-27 1600 0" fill="none" stroke="#FFF8F0" strokeWidth="6"/>
    <path d="M0 729c388-24 1212-24 1600 0M0 807c388-20 1212-20 1600 0" fill="none" stroke="#DAAFBC" strokeWidth="2" opacity=".55"/>
    <ellipse cx="800" cy="754" rx="465" ry="56" fill="#FFF6E9" opacity=".47"/>
    <path className="stage-floor-sheen" d="M-390 690h90l340 210h-170Z" fill="#FFFDF1"/>
    {footlights.map((x, i) => <g key={`foot-${i}`} className="stage-footlight" style={{animationDelay: `${i * -.11}s`}}><ellipse cx={x} cy="828" rx="21" ry="9" fill="#FFF4D8" opacity=".4" filter="url(#stage-soft)"/><circle cx={x} cy="828" r="6" fill="url(#stage-bulb)" stroke="#E9BBC3" strokeWidth="2"/></g>)}

    <path d="M0 0h1600v101c-191 54-291 21-464 4-235-23-423 34-652 15C263 100 121 114 0 90Z" fill="url(#stage-curtain)" stroke="#A96E86" strokeWidth="5"/>
    <path d="M0 0h163c43 183 38 442-32 690-58 10-94 18-131 37V0ZM1600 0h-163c-43 183-38 442 32 690 58 10 94 18 131 37V0Z" fill="url(#stage-curtain)" stroke="#A96E86" strokeWidth="5"/>
    <path d="M25 0c52 218 39 484-13 679M83 0c52 214 44 472-7 680M146 0c49 213 33 445-11 666M1575 0c-52 218-39 484 13 679M1517 0c-52 214-44 472 7 680M1454 0c-49 213-33 445 11 666" fill="none" stroke="#FFE5E7" strokeWidth="9" opacity=".32"/>
    <path d="M0 92c140 27 304 46 486 23m1114-23c-140 27-304 46-486 23" fill="none" stroke="#F5D7DB" strokeWidth="8" opacity=".55"/>
    <path d="M92 310h71m1345 0h-71" stroke="#F5D9DF" strokeWidth="19" strokeLinecap="round"/>
    {sidelights.map((y, i) => <g key={`side-${i}`} className="stage-side-light" style={{animationDelay: `${i * -.18}s`}}><circle cx="164" cy={y} r="8" fill="url(#stage-bulb)" stroke="#F9E8DC" strokeWidth="2"/><circle cx="1436" cy={y} r="8" fill="url(#stage-bulb)" stroke="#F9E8DC" strokeWidth="2"/></g>)}

    <path d="M208 690V182C208 113 263 68 334 68h932c71 0 126 45 126 114v508" fill="none" stroke="#DDAFB9" strokeWidth="4"/>
    {bulbs.map((bulb, i) => <g key={i} className="stage-bulb" style={{animationDelay: `${i * -.16}s`}}><circle cx={bulb.x} cy={bulb.y} r="13" fill="#FFE9C7" opacity=".28"/><circle cx={bulb.x} cy={bulb.y} r="5.8" fill="url(#stage-bulb)" stroke="#F8ECDD" strokeWidth="1.5"/></g>)}
    {sparkles.map(([x, y], i) => <g key={`spark-${i}`} transform={`translate(${x} ${y})`}><path className="stage-sparkle" style={{animationDelay: `${i * -.43}s`}} d="M0-11 3-3 11 0 3 3 0 11 -3 3 -11 0 -3-3Z"/></g>)}
    <g className="stage-lamp" transform="translate(290 108)"><path d="M-20-10h40l13 26h-66Z" fill="#B77990"/><ellipse cy="16" rx="34" ry="12" fill="#FCE3BF" stroke="#B77990" strokeWidth="3"/><circle cy="22" r="8" fill="#FFF9E0"/></g>
    <g className="stage-lamp" transform="translate(1310 108)"><path d="M-20-10h40l13 26h-66Z" fill="#B77990"/><ellipse cy="16" rx="34" ry="12" fill="#FCE3BF" stroke="#B77990" strokeWidth="3"/><circle cy="22" r="8" fill="#FFF9E0"/></g>
    <g className="stage-lamp" transform="translate(800 89)"><path d="M-20-10h40l13 26h-66Z" fill="#B77990"/><ellipse cy="16" rx="34" ry="12" fill="#FCE3BF" stroke="#B77990" strokeWidth="3"/><circle cy="22" r="8" fill="#FFF9E0"/></g>
  </svg>
  <div className="stage-dust stage-dust-one"/><div className="stage-dust stage-dust-two"/><div className="stage-dust stage-dust-three"/>
</div>;
