import React from 'react';

const scene = (number: number): React.ReactNode => {
  switch (number) {
    case 1: return <>
      <ellipse cx="180" cy="238" rx="90" ry="13" fill="#DCAEBB" opacity=".45"/>
      <rect x="101" y="103" width="158" height="132" rx="25" fill="url(#paper)" stroke="#CB8FA2" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M119 159h122" stroke="#EBC6D0" strokeWidth="3"/>
      <circle cx="180" cy="158" r="42" fill="#FFF7F3" stroke="#D9A1B2" strokeWidth="3"/>
      <path d="M180 157l22-21" stroke="#A8677E" strokeWidth="5" strokeLinecap="round"/><circle cx="180" cy="157" r="5" fill="#A8677E"/>
      <path d="M139 130l8 8m33-22v12m33 2-8 8" stroke="#B98698" strokeWidth="3" strokeLinecap="round"/>
      <rect x="135" y="199" width="90" height="16" rx="8" fill="#EEC9D5"/><path d="M146 206h14m40 0h14" stroke="#C58CA0" strokeWidth="3" strokeLinecap="round"/>
      <path d="M262 113c-7-15-22-13-25-2-2 10 12 19 25 27 12-8 27-17 24-27-3-11-17-13-24 2Z" fill="url(#rose)"/>
    </>;
    case 2: return <>
      <ellipse cx="180" cy="245" rx="94" ry="12" fill="#DCAEBB" opacity=".38"/>
      <path d="M151 114c6 15 12 20 29 20s24-5 29-20l25 17-9 42-14-5 9 69H140l9-69-14 5-9-42 25-17Z" fill="url(#paper)" stroke="#C98A9E" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M153 113l27 26 27-26M145 168c22 14 50 16 73 1" stroke="#D8A5B5" strokeWidth="3"/>
      <path d="M112 181c35-28 96-7 132-24 24-11 27-27 15-38" fill="none" stroke="#E6B970" strokeWidth="10" strokeLinecap="round"/>
      <path d="M124 174l5 13m14-18 5 13m15-18 4 13m16-14 4 13m17-16 4 13m15-17 5 13" stroke="#8B6B65" strokeWidth="2"/>
      <circle cx="267" cy="114" r="16" fill="#F9D6DE" stroke="#C8899D" strokeWidth="3"/><circle cx="267" cy="114" r="4" fill="#C8899D"/>
    </>;
    case 3: return <>
      <path d="M95 101h151c11 0 19 8 19 19v123H115c-11 0-20-9-20-20V101Z" fill="url(#paper)" stroke="#C990A3" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M109 113h144M113 134h130M113 152h130M113 170h130M113 188h92M113 206h78" stroke="#E9CDD4" strokeWidth="2"/>
      <path d="M123 103v139" stroke="#EAB9C7" strokeWidth="3"/>
      <text x="143" y="183" fill="#A7637D" fontSize="55" fontWeight="900" fontFamily="Georgia, serif">A+</text>
      <path d="m202 203 13 12 27-32" stroke="#8DA58C" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m232 91 14-19 16 11-12 20-18-12Z" fill="#E6B983" stroke="#A76C74" strokeWidth="3"/><path d="m232 91-6 15 24-3" fill="#F6DCC1"/>
    </>;
    case 4: return <>
      <ellipse cx="180" cy="246" rx="105" ry="13" fill="#DCAEBB" opacity=".4"/>
      <circle cx="112" cy="205" r="35" fill="#FFF9F6" stroke="#98677A" strokeWidth="9"/><circle cx="253" cy="205" r="35" fill="#FFF9F6" stroke="#98677A" strokeWidth="9"/>
      <circle cx="112" cy="205" r="9" fill="#C9849C"/><circle cx="253" cy="205" r="9" fill="#C9849C"/>
      <path d="m112 205 55-62 36 62h-91l28-49h58l55 49" stroke="#C1758E" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m166 144-16-17h-23m72 17 18-26h20" stroke="#966477" strokeWidth="7" strokeLinecap="round"/>
      <path d="M187 130c13-22 36-27 53-12" stroke="#E3A6B8" strokeWidth="4" strokeLinecap="round"/>
      <path d="M277 101v-32l29-9v31" stroke="#B76584" strokeWidth="5" strokeLinecap="round"/><ellipse cx="272" cy="105" rx="10" ry="6" fill="#D58FA5"/><ellipse cx="301" cy="94" rx="10" ry="6" fill="#D58FA5"/>
    </>;
    case 5: return <>
      <ellipse cx="180" cy="246" rx="76" ry="12" fill="#DCAEBB" opacity=".4"/>
      <rect x="117" y="68" width="126" height="177" rx="21" fill="#A36A80" stroke="#81566A" strokeWidth="3" filter="url(#shadow)"/>
      <rect x="125" y="80" width="110" height="145" rx="11" fill="url(#paper)"/>
      <rect x="155" y="72" width="50" height="7" rx="3.5" fill="#71485D"/><circle cx="180" cy="234" r="5" fill="#F2D5DE"/>
      <circle cx="180" cy="125" r="25" fill="#F6D8E1"/><path d="M180 126c-5-11-16-10-18-2-2 8 9 15 18 21 9-6 20-13 18-21-2-8-13-9-18 2Z" fill="#C97D98"/>
      <path d="M143 166h74M153 181h54M163 196h34" stroke="#D8A5B6" strokeWidth="5" strokeLinecap="round"/>
      <path d="M244 95c18-12 37-4 39 12 3 14-11 25-24 27" stroke="#DC9BB0" strokeWidth="4" strokeLinecap="round"/>
    </>;
    case 6: return <>
      <ellipse cx="180" cy="243" rx="103" ry="13" fill="#DCAEBB" opacity=".4"/>
      <path d="M92 112c27-11 60-9 88 9 29-18 61-20 88-9v123c-28-11-60-7-88 10-28-17-60-21-88-10V112Z" fill="url(#paper)" stroke="#C890A3" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M180 121v124M111 140h44m-44 18h52m-52 18h48m-48 18h42m52-54h44m-44 18h42m-42 18h44m-44 18h42" stroke="#E3BBC6" strokeWidth="3" strokeLinecap="round"/>
      <path d="M177 79h87c8 0 14 6 14 14v28c0 8-6 14-14 14h-23l-15 14v-14h-49c-8 0-14-6-14-14V93c0-8 6-14 14-14Z" fill="url(#rose)" stroke="#AD6A83" strokeWidth="3"/>
      <text x="180" y="114" fill="#FFF9F7" fontSize="23" fontWeight="800" fontFamily="sans-serif">6.0</text>
    </>;
    case 7: return <>
      <ellipse cx="180" cy="246" rx="100" ry="12" fill="#DCAEBB" opacity=".4"/>
      <rect x="89" y="88" width="141" height="127" rx="16" fill="url(#paper)" stroke="#C990A3" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M89 122h141" stroke="#D991AA" strokeWidth="21"/><path d="M119 80v28m80-28v28" stroke="#9B647A" strokeWidth="8" strokeLinecap="round"/>
      <path d="M115 150h21m18 0h21m18 0h16m-94 23h21m18 0h21m18 0h16" stroke="#E6BFCA" strokeWidth="8" strokeLinecap="round"/>
      <path d="m149 192 12 11 22-25" stroke="#86A48D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M194 212c19-24 40-37 59-35l31 31c8 8 8 18-2 23-15 8-37 4-58-5l-30-14Z" fill="url(#rose)" stroke="#AA6C84" strokeWidth="3"/>
      <path d="m217 190 19 18m-5-27 18 19m-48 21c25 15 55 21 83 9" stroke="#F8E4E9" strokeWidth="4" strokeLinecap="round"/>
    </>;
    case 8: return <>
      <ellipse cx="180" cy="246" rx="103" ry="13" fill="#DCAEBB" opacity=".4"/>
      <path d="M104 139 180 79l76 60v95H104v-95Z" fill="url(#paper)" stroke="#C78B9D" strokeWidth="3" filter="url(#shadow)"/>
      <path d="m93 145 87-69 87 69" stroke="#B5798D" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="150" y="164" width="60" height="70" rx="6" fill="#F5D8E0" stroke="#C98EA2" strokeWidth="3"/>
      <path d="M239 111V73" stroke="#B5798D" strokeWidth="12" strokeLinecap="round"/>
      <path d="M255 153 218 237" stroke="#A47765" strokeWidth="8" strokeLinecap="round"/>
      <path d="M215 230c20-13 45-8 53 7h-62l9-7Z" fill="#DEAD77" stroke="#9D7762" strokeWidth="3"/>
      <path d="m276 103 4-12m-23 7-9-9m-19 73 12-5" stroke="#D6A2B1" strokeWidth="3" strokeLinecap="round"/>
    </>;
    case 9: return <>
      <ellipse cx="180" cy="245" rx="106" ry="13" fill="#DCAEBB" opacity=".4"/>
      <path d="M100 164h111v46c0 17-13 30-30 30h-51c-17 0-30-13-30-30v-46Z" fill="url(#paper)" stroke="#BE8297" strokeWidth="3" filter="url(#shadow)"/>
      <path d="M210 176h17c11 0 17 7 17 17 0 11-8 18-19 18h-14" stroke="#BE8297" strokeWidth="8" fill="none"/>
      <path d="M107 184h96" stroke="#E7BBC9" strokeWidth="4"/>
      <path d="M132 150c-11-17 9-23 0-38m25 38c-11-17 9-23 0-38m25 38c-11-17 9-23 0-38" stroke="#D8A4B4" strokeWidth="4" strokeLinecap="round"/>
      <path d="M222 161c-12-43 10-59 39-54 26 4 40 28 30 54l-10 45h-50l-9-45Z" fill="url(#rose)" stroke="#AA7086" strokeWidth="3"/>
      <path d="m227 116-11-23 29 8m31 0 27-8-9 25" fill="#E8B3C2" stroke="#AA7086" strokeWidth="3"/>
      <path d="M239 162h3m29 0h3" stroke="#85566C" strokeWidth="5" strokeLinecap="round"/><path d="M254 177c5 6 9 6 14 0" stroke="#85566C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M217 193c-17 1-26 17-15 27 8 7 21 3 26-5" stroke="#AA7086" strokeWidth="5" fill="none" strokeLinecap="round"/>
    </>;
    default: return <>
      <ellipse cx="180" cy="246" rx="107" ry="13" fill="#DCAEBB" opacity=".4"/>
      <path d="M92 151h175c10 0 19 8 19 19 0 35-28 63-63 63h-69c-35 0-62-28-62-63v-19Z" fill="url(#ink)" stroke="#95697C" strokeWidth="4" filter="url(#shadow)"/>
      <path d="M111 168h155" stroke="#F7DEE5" strokeWidth="4" opacity=".8"/>
      <path d="M120 144c14-20 42-26 64-18 16-9 45-8 62 6 9 8 13 17 9 25H111c-4-4-1-9 9-13Z" fill="url(#gold)" stroke="#BB8A6B" strokeWidth="3"/>
      <ellipse cx="186" cy="146" rx="36" ry="20" fill="#FFF7F1" stroke="#D5B4A8" strokeWidth="2"/><circle cx="186" cy="146" r="14" fill="#F1C476"/>
      <path d="M107 126c-8-12 7-20 1-30m34 20c-8-12 7-20 1-30m87 26c-8-12 7-20 1-30" stroke="#DAA5B5" strokeWidth="4" strokeLinecap="round"/>
      <path d="M287 168h30" stroke="#9B697D" strokeWidth="11" strokeLinecap="round"/>
    </>;
  }
};

export const QuestionIllustration: React.FC<{number: number}> = ({number}) => <div className="question-illustration"><svg viewBox="0 0 360 300" role="img" aria-label={`Minh họa câu hỏi ${number}`}>
  <defs>
    <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#FFFFFF"/><stop offset="1" stopColor="#F8E7E9"/></linearGradient>
    <linearGradient id="rose" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#F9D6E1"/><stop offset=".55" stopColor="#E9AFC2"/><stop offset="1" stopColor="#C9849D"/></linearGradient>
    <linearGradient id="ink" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#D6B0BC"/><stop offset="1" stopColor="#B48399"/></linearGradient>
    <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#FFF1D5"/><stop offset="1" stopColor="#E9BE8E"/></linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#A57486" floodOpacity=".24"/></filter>
  </defs>
  <circle cx="180" cy="154" r="119" fill="#FCEEF1"/><circle cx="180" cy="154" r="118" fill="none" stroke="#EBC8D2" strokeWidth="2"/>
  <circle cx="96" cy="75" r="5" fill="#E6B4C3"/><circle cx="263" cy="51" r="4" fill="#E8B6C5"/><path d="m72 160 6-8 6 8-6 8-6-8Zm214 56 5-7 5 7-5 7-5-7Z" fill="#DFA7B9"/>
  {scene(number)}
</svg><span className="question-illustration-number">{String(number).padStart(2, '0')}</span></div>;
