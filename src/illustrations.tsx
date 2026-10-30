import React from 'react';

export const Petal: React.FC<{className?: string}> = ({className = ''}) => <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true"><path d="M60 60C30 42 31 15 47 10c12-4 20 9 13 50ZM60 60c28-25 51-17 50 1-1 13-16 17-50-1ZM60 60c9 36-7 51-23 41-11-8-8-23 23-41Z" fill="#F4B9C6"/><circle cx="60" cy="60" r="8" fill="#C76E88"/><path d="M59 68c-4 20-16 32-28 40M61 68c12 18 24 25 40 29" stroke="#8B9E80" strokeWidth="3" strokeLinecap="round"/></svg>;

export const CoupleIllustration: React.FC<{className?: string}> = ({className = ''}) => <svg className={className} viewBox="0 0 520 480" fill="none" role="img" aria-label="Minh họa cô dâu và chú rể Quang Trưởng, Hồng Nhung">
  <circle cx="260" cy="229" r="177" fill="#FFF8F5" stroke="#E7B8C4" strokeWidth="2"/>
  <path d="M94 350c-30-40-47-83-44-130M426 350c30-40 47-83 44-130" stroke="#DB9DB1" strokeWidth="3" strokeLinecap="round"/>
  <path d="M56 225c-20-8-28-25-18-36 12-11 26 5 18 36ZM70 270c-19-3-30-19-24-32 8-15 28-3 24 32ZM464 225c20-8 28-25 18-36-12-11-26 5-18 36ZM450 270c19-3 30-19 24-32-8-15-28-3-24 32Z" fill="#EEC5CF"/>
  <path d="M127 356c20-81 75-101 132-87 71-13 128 6 145 87l-20 38H143l-16-38Z" fill="#F5DDE3" stroke="#C9879C" strokeWidth="3"/>
  <path d="M244 289c-15-22-27-30-51-29-41 3-61 52-62 112h138l-25-83Z" fill="#FFFDFB" stroke="#D8A9B8" strokeWidth="3"/>
  <path d="M279 287c21-25 43-31 65-25 39 10 55 60 52 110H263l16-85Z" fill="#9A6578" stroke="#815166" strokeWidth="3"/>
  <path d="M245 273l21 20-19 54-25-64M280 274l-15 19 22 52 18-62" fill="#FFFDFB" stroke="#D8A9B8" strokeWidth="3"/>
  <path d="M266 294l-10 12 11 28 11-28-12-12Z" fill="#D88DA2"/>
  <path d="M163 194c-15-35-5-81 27-104 42-31 91-14 111 19 35 55 5 143-47 165-54 23-86-29-91-80Z" fill="#6A4656"/>
  <ellipse cx="224" cy="188" rx="61" ry="78" fill="#F7D7C7"/>
  <path d="M164 161c12-53 56-84 98-66 28 13 30 42 23 61-24-4-45-17-61-32-20 22-37 31-60 37Z" fill="#654353"/>
  <path d="M189 187h9M237 187h9" stroke="#73515C" strokeWidth="4" strokeLinecap="round"/>
  <path d="M207 218c9 9 22 9 31 0" stroke="#BC758B" strokeWidth="3" strokeLinecap="round"/>
  <path d="M281 166c-3-42 24-73 60-76 43-4 77 27 78 72 2 21-5 54-12 71l-104 2-22-69Z" fill="#56424D"/>
  <ellipse cx="348" cy="190" rx="62" ry="76" fill="#F2D0C1"/>
  <path d="M287 167c3-55 40-84 80-75 33 7 52 39 48 69-22-2-47-13-63-31-13 20-33 32-65 37Z" fill="#55414C"/>
  <path d="M317 189h9M367 189h9" stroke="#73515C" strokeWidth="4" strokeLinecap="round"/>
  <path d="M338 221c8 7 20 7 28 0" stroke="#B97488" strokeWidth="3" strokeLinecap="round"/>
  <path d="M161 118c-9-20-7-35 7-43 14-8 25 3 30 17M178 80c7-21 20-30 34-23 12 7 10 22 1 37" fill="#FFFDFB" stroke="#E6B6C2" strokeWidth="3"/>
  <path d="M152 119c31-25 65-34 105-16" stroke="#E9A5B8" strokeWidth="5" strokeLinecap="round"/>
  <circle cx="153" cy="116" r="10" fill="#F2B9C8"/><circle cx="185" cy="99" r="9" fill="#F2B9C8"/><circle cx="214" cy="95" r="8" fill="#F2B9C8"/>
  <path d="M107 412c89 18 211 18 306 0" stroke="#E5B4C1" strokeWidth="3" strokeLinecap="round"/>
  <path d="M89 108c7-22 14-29 24-7 8-22 17-15 24 6-6 16-15 22-24 32-10-10-19-17-24-31ZM392 73c4-13 8-17 15-4 5-13 11-9 15 3-5 10-10 14-16 20-6-6-11-10-14-19Z" fill="#E9A8BA"/>
</svg>;

export const GiftIllustration: React.FC<{open?: boolean; className?: string}> = ({open = false, className = ''}) => <svg className={className} viewBox="0 0 360 300" fill="none" role="img" aria-label={open ? 'Hộp quà đang mở' : 'Hộp quà bí ẩn'}>
  <ellipse cx="180" cy="264" rx="125" ry="13" fill="#EAD0D6"/>
  {open && <><path d="M139 86c-25-27-7-48 15-31 15 12 19 31 26 42-2-36 24-55 42-37 19 19-4 37-42 37" fill="#F8D7E0" stroke="#BD718B" strokeWidth="5"/><path d="M82 112 64 84l42 13M279 112l24-29-45 12" stroke="#D78DA3" strokeWidth="5" strokeLinecap="round"/><circle cx="69" cy="126" r="5" fill="#D78DA3"/><circle cx="292" cy="128" r="5" fill="#D78DA3"/></>}
  <rect x="77" y="125" width="206" height="125" rx="14" fill="#F5B9C9" stroke="#AB6880" strokeWidth="5"/>
  <path d="M77 159h206" stroke="#AB6880" strokeWidth="5"/>
  <path d="M159 125v125h42V125" fill="#FFF6EE" stroke="#B97991" strokeWidth="4"/>
  {open ? <path d="M69 115 80 82c5-18 18-22 35-18l180 42c17 4 23 17 16 34l-9 18-233-43Z" fill="#FBD4DE" stroke="#AB6880" strokeWidth="5"/> : <><rect x="62" y="111" width="236" height="46" rx="11" fill="#FBD4DE" stroke="#AB6880" strokeWidth="5"/><path d="M160 112v45h40v-45" fill="#FFF6EE" stroke="#B97991" strokeWidth="4"/><path d="M180 111c-42-4-61-14-60-32 1-16 17-21 32-12 17 11 23 30 28 44Zm0 0c42-4 61-14 60-32-1-16-17-21-32-12-17 11-23 30-28 44Z" fill="#F5B9C9" stroke="#AB6880" strokeWidth="5"/></>}
  <path d="M178 199c5-13 18-12 21-3 3 10-11 19-20 27-10-8-22-18-20-27 3-9 15-10 19 3Z" fill="#BA708B"/>
</svg>;

const motifs = ['♡', '✦', '♧', '♫', '✉', 'A+', '☼', '⌂', '☕', '◒'];
export const QuestionIllustration: React.FC<{number: number}> = ({number}) => <div className="question-illustration" aria-hidden="true"><div className="question-halo"/><Petal className="question-petal petal-one"/><Petal className="question-petal petal-two"/><span className="motif">{motifs[number - 1]}</span><span className="question-illustration-number">{String(number).padStart(2, '0')}</span></div>;
