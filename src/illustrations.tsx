import React from 'react';

export const Petal: React.FC<{className?: string}> = ({className = ''}) => <svg className={className} viewBox="0 0 150 150" fill="none" aria-hidden="true">
  <defs><linearGradient id="petal-blush" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFE4E9"/><stop offset=".65" stopColor="#F3B8C8"/><stop offset="1" stopColor="#D890A7"/></linearGradient><linearGradient id="petal-leaf" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#C4D5B7"/><stop offset="1" stopColor="#7C9C80"/></linearGradient><filter id="petal-shadow"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#9B6B80" floodOpacity=".22"/></filter></defs>
  <path d="M73 78c-5 25-13 45-30 63M75 81c11 25 23 39 39 50" stroke="#8DA58D" strokeWidth="4" strokeLinecap="round"/>
  <path d="M56 112c-14-5-27-2-34 10 14 10 27 9 36-7ZM95 112c13-8 25-6 34 4-11 14-25 15-36-1Z" fill="url(#petal-leaf)" stroke="#78977D" strokeWidth="2"/>
  <g filter="url(#petal-shadow)" stroke="#CD8EA3" strokeWidth="2"><path d="M74 76C39 58 36 27 51 18c17-10 31 10 23 58Z" fill="url(#petal-blush)"/><path d="M74 76c-2-45 15-65 33-56 20 10 13 37-33 56Z" fill="url(#petal-blush)"/><path d="M74 76c38-27 65-17 62 3-4 19-28 23-62-3Z" fill="url(#petal-blush)"/><path d="M74 76c25 36 15 61-7 60-19-2-25-27 7-60Z" fill="url(#petal-blush)"/><path d="M74 76C36 105 13 98 15 78c2-20 29-24 59-2Z" fill="url(#petal-blush)"/></g>
  <circle cx="74" cy="76" r="14" fill="#F8E0AC" stroke="#C79877" strokeWidth="2"/><circle cx="69" cy="72" r="2" fill="#C58E72"/><circle cx="80" cy="73" r="2" fill="#C58E72"/><circle cx="74" cy="82" r="2" fill="#C58E72"/>
  <path d="M54 33c8 5 11 11 13 21m39-26c-9 5-14 13-19 24m32 31c-11-5-21-5-28-2M30 81c9-3 19-2 27 1" stroke="#FFF7F4" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
</svg>;

export const GiftIllustration: React.FC<{open?: boolean; className?: string}> = ({open = false, className = ''}) => <svg className={className} viewBox="0 0 360 300" fill="none" role="img" aria-label={open ? 'Hộp quà đang mở' : 'Hộp quà bí ẩn'}>
  <defs>
    <linearGradient id="gift-front" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFDCE5"/><stop offset=".55" stopColor="#F2B9CA"/><stop offset="1" stopColor="#D88FA8"/></linearGradient>
    <linearGradient id="gift-side" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#D894AA"/><stop offset="1" stopColor="#B66E89"/></linearGradient>
    <linearGradient id="gift-lid" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFF3F3"/><stop offset=".55" stopColor="#FAD4DF"/><stop offset="1" stopColor="#E6A7BB"/></linearGradient>
    <linearGradient id="gift-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFF8E9"/><stop offset=".55" stopColor="#F3E0C4"/><stop offset="1" stopColor="#D9B88F"/></linearGradient>
    <filter id="gift-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#A26680" floodOpacity=".28"/></filter>
  </defs>
  <ellipse cx="185" cy="262" rx="123" ry="15" fill="#E8C5CE" opacity=".68"/>
  {open && <>
    <path d="m67 86 4-11 4 11 11 4-11 4-4 11-4-11-11-4 11-4Zm225 11 3-8 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#DDA4B7"/>
    <circle cx="101" cy="105" r="4" fill="#E5B979"/><circle cx="275" cy="70" r="5" fill="#E5B979"/><circle cx="263" cy="119" r="3" fill="#D78DA5"/>
    <path d="M139 102c-30-37-8-62 18-44 18 13 21 29 23 45 3-27 21-53 41-48 29 9 17 46-41 48" fill="#F5BED0" stroke="#B97892" strokeWidth="5"/>
  </>}
  <g filter="url(#gift-shadow)">
    <path d="M80 132h202v107c0 9-7 16-16 16H96c-9 0-16-7-16-16V132Z" fill="url(#gift-front)" stroke="#A96C83" strokeWidth="4"/>
    <path d="m282 132 17 9v98c0 8-6 13-17 16V132Z" fill="url(#gift-side)" stroke="#A96C83" strokeWidth="4"/>
    <path d="M81 162h201" stroke="#D795AB" strokeWidth="3"/>
    <path d="M156 132h47v123h-47V132Z" fill="url(#gift-ribbon)" stroke="#C39A8D" strokeWidth="3"/>
    <path d="M165 135v116M195 135v116" stroke="#FFF9EC" strokeWidth="3" opacity=".7"/>
    <path d="M91 140v88" stroke="#FFF7F8" strokeWidth="5" strokeLinecap="round" opacity=".65"/>
    <path d="M182 193c-6-13-21-12-24-2-3 11 12 22 24 31 12-9 27-20 24-31-3-10-18-11-24 2Z" fill="#B97490" stroke="#A0627D" strokeWidth="2"/>
    <path d="M180 200c-4-7-10-8-15-5" stroke="#EFC1D0" strokeWidth="3" strokeLinecap="round"/>
    {open ? <g transform="rotate(-11 182 100)"><path d="M66 83h232l13 20v39H65v-39l1-20Z" fill="url(#gift-lid)" stroke="#A96C83" strokeWidth="4"/><path d="M66 104h245" stroke="#FFF9F7" strokeWidth="4" opacity=".7"/><path d="M159 83h45v59h-45V83Z" fill="url(#gift-ribbon)" stroke="#C39A8D" strokeWidth="3"/></g> : <>
      <path d="M67 105h231c8 0 14 6 14 14v33c0 8-6 14-14 14H67c-8 0-14-6-14-14v-33c0-8 6-14 14-14Z" fill="url(#gift-lid)" stroke="#A96C83" strokeWidth="4"/>
      <path d="M62 116h238M63 153h237" stroke="#FFF9F7" strokeWidth="3" opacity=".75"/>
      <path d="M158 105h47v61h-47v-61Z" fill="url(#gift-ribbon)" stroke="#C39A8D" strokeWidth="3"/>
      <path d="M181 105c-41-5-65-17-62-38 2-16 20-22 36-11 18 13 23 35 26 49Zm0 0c41-5 65-17 62-38-2-16-20-22-36-11-18 13-23 35-26 49Z" fill="url(#gift-front)" stroke="#AB6D86" strokeWidth="4"/>
      <path d="M150 65c11 7 18 19 23 31m69-31c-11 7-18 19-23 31" stroke="#FFEAF0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="181" cy="104" r="9" fill="#C77E9B" stroke="#A96C83" strokeWidth="3"/>
    </>}
  </g>
</svg>;
