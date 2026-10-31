import React, {useEffect, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {gifts} from './data';
import {assetUrl} from './asset-url';
import type {Gift} from './data';
import {GiftIllustration, Petal} from './illustrations';
import {beginGiftSequence, endGiftSequence, setGiftSequencePaused, syncGiftSequence} from './audio';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const colors = ['#D990AA', '#F3C4D0', '#E9B77E', '#BAD0BC', '#C7B3D5', '#F5D7BB', '#E8AAC0', '#D6A7B8', '#F0CFA2', '#AFC5B5'];

export const CoupleAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', inset: '8%', border: '2px solid #ebc2cd', borderRadius: '50%'}} />
    <Img src={assetUrl('assets/couple-square-groom-left.webp')} alt="Ảnh chibi của Quang Trưởng bên trái và Hồng Nhung bên phải" style={{width: '82%', height: '82%', objectFit: 'cover', borderRadius: '50%', border: '5px solid #fffaf9', boxShadow: '0 12px 35px #bc8b9a33', transform: `translateY(${Math.sin(frame / 18) * 5}px) scale(${0.94 + scale * 0.06})`}}/>
    <div style={{position: 'absolute', top: '12%', right: '6%', color: '#d4869e', fontSize: 32, transform: `rotate(${Math.sin(frame / 18) * 9}deg)`}}>♡</div>
  </AbsoluteFill>;
};

const wheelRotation = (frame: number, giftId: number) => {
  const final = 360 * 6 - 18 - (giftId - 1) * 36;
  if (frame <= 130) return interpolate(frame, [0, 130], [0, final - 44], {...clamp, easing: Easing.bezier(.12, .82, .22, 1)});
  if (frame <= 145) return interpolate(frame, [130, 145], [final - 44, final - 36], {...clamp, easing: Easing.out(Easing.cubic)});
  if (frame <= 164) return final - 36;
  return interpolate(frame, [164, 183], [final - 36, final], {...clamp, easing: Easing.out(Easing.back(1.2))});
};

// A damped pointer receives a small impulse whenever a wheel tooth passes it.
const pointerMotion = (frame: number, giftId: number) => {
  let lift = 0;
  let velocity = 0;
  for (let tick = 1; tick <= Math.min(frame, 203); tick++) {
    const before = wheelRotation(tick - 1, giftId);
    const after = wheelRotation(tick, giftId);
    const teeth = Math.max(0, Math.floor(after / 36) - Math.floor(before / 36));
    if (teeth) velocity -= Math.min(3.4, .8 + (after - before) * .09) * Math.min(teeth, 2);
    velocity += -lift * .34 - velocity * .2;
    velocity *= .88;
    lift = Math.max(-13, Math.min(3, lift + velocity));
  }
  return {lift, tilt: Math.max(-11, Math.min(11, -lift * .6 + velocity * 1.3))};
};

const wedgePath = (index: number) => {
  const start = (-90 + index * 36) * Math.PI / 180;
  const end = start + Math.PI / 5;
  const x1 = 400 + Math.cos(start) * 168;
  const y1 = 220 + Math.sin(start) * 168;
  const x2 = 400 + Math.cos(end) * 168;
  const y2 = 220 + Math.sin(end) * 168;
  return `M400 220 L${x1} ${y1} A168 168 0 0 1 ${x2} ${y2} Z`;
};

const LuckyWheel: React.FC<{frame: number; gift: Gift}> = ({frame, gift}) => {
  const rotation = wheelRotation(frame, gift.id);
  const pointer = pointerMotion(frame, gift.id);
  const wheelOpacity = interpolate(frame, [0, 20, 185, 203], [0, 1, 1, 0], clamp);
  const wheelScale = interpolate(frame, [0, 21, 185, 203], [.7, 1, 1, 1.22], clamp);
  const candidate = gifts[Math.floor((((-rotation % 360) + 360) % 360) / 36)]?.title ?? gifts[0].title;
  const nearMiss = frame >= 146 && frame < 164;
  return <AbsoluteFill style={{opacity: wheelOpacity, scale: wheelScale, zIndex: 2}}>
    <svg viewBox="0 0 800 500" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(0 15px 24px #9c5a7536)'}} role="img" aria-label="Vòng quay quà hỷ">
      <circle cx="400" cy="220" r="183" fill="#FFF8F6" stroke="#BC7791" strokeWidth="8"/>
      <g transform={`rotate(${rotation} 400 220)`}>
        {gifts.map((item, index) => <g key={item.id}>
          <path d={wedgePath(index)} fill={colors[index]} stroke="#FFF8F4" strokeWidth="3"/>
          <g transform={`rotate(${index * 36 + 18} 400 220)`}>
            <text x="400" y="99" textAnchor="middle" fill="#75495F" fontFamily="sans-serif" fontSize="25" fontWeight="900">{String(item.id).padStart(2, '0')}</text>
          </g>
        </g>)}
        {Array.from({length: 30}, (_, i) => {
          const a = i * Math.PI / 15;
          return <circle key={i} cx={400 + Math.cos(a) * 175} cy={220 + Math.sin(a) * 175} r="3.8" fill={i % 2 ? '#fff5e4' : '#c77d98'}/>;
        })}
      </g>
      <circle cx="400" cy="220" r="51" fill="#FFF9F5" stroke="#B36D88" strokeWidth="6"/>
      <path d="M400 211c-8-15-26-12-29 1-4 15 17 29 29 40 12-11 33-25 29-40-3-13-21-16-29-1Z" fill="#C57A96"/>
      <g transform={`rotate(${pointer.tilt} 400 18)`}>
        <path d={`M369 22 Q400 4 431 22 L400 ${76 + pointer.lift}Z`} fill="#9F4D70" opacity=".25" transform="translate(0 4)"/>
        <path d={`M369 22 Q400 4 431 22 L400 ${72 + pointer.lift}Z`} fill="#B85F82" stroke="#FFF7F1" strokeWidth="5" strokeLinejoin="round"/>
      </g>
      <circle cx="400" cy="18" r="9" fill="#F1C18F" stroke="#A76C80" strokeWidth="3"/>
    </svg>
    <div style={{position: 'absolute', left: '12%', right: '12%', bottom: 17, textAlign: 'center', fontSize: 21, fontWeight: 900, color: '#93556E', textShadow: '0 2px #fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{nearMiss ? 'Ơ… dừng rồi sao? 👀' : frame >= 164 ? 'Khoan… còn một nấc nữa! 😆' : candidate}</div>
  </AbsoluteFill>;
};

const confettiColors = ['#d789a3', '#efb7c8', '#e9bd79', '#a6bdab', '#bba2cf', '#fff1d8'];

const AwardFrame: React.FC<{gift: Gift; frame: number; fps: number; reducedMotion?: boolean}> = ({gift, frame, fps, reducedMotion = false}) => {
  const arrival = reducedMotion ? 1 : spring({frame: Math.max(0, frame - 237), fps, config: {damping: 12, stiffness: 105}});
  const opacity = interpolate(frame, [232, 247], [0, 1], clamp);
  const shineX = interpolate(frame, [250, 286], [-240, 690], clamp);
  return <div style={{position: 'absolute', zIndex: 5, width: 676, height: 424, opacity, transform: `translateY(${(1 - arrival) * 62}px) scale(${.75 + arrival * .25})`, filter: 'drop-shadow(0 18px 18px #8d5c7066)'}}>
    <div style={{position: 'absolute', inset: '20px 15px 13px', borderRadius: 31, background: 'linear-gradient(135deg,#f9e2a7 0%,#d6a367 18%,#fff2c3 36%,#b76f72 55%,#ffe8ad 77%,#c98d6c 100%)', border: '3px solid #fff5d8', boxShadow: 'inset 0 0 0 3px #b57981, inset 0 0 0 10px #f7d7aa, 0 15px 35px #a4668566'}}/>
    <div style={{position: 'absolute', left: 39, right: 39, top: 50, bottom: 37, border: '2px solid #fff7e8', borderRadius: 19, background: '#fffdfa', overflow: 'hidden', boxShadow: 'inset 0 0 0 5px #b47c87, 0 0 0 2px #985568'}}>
      <Img src={gift.image} alt={`Minh họa giải thưởng ${gift.title}`} style={{position: 'absolute', inset: 7, width: 'calc(100% - 14px)', height: 'calc(100% - 14px)', objectFit: 'contain', background: '#fff'}}/>
      {!reducedMotion && <div style={{position: 'absolute', top: -45, left: shineX, width: 94, height: 440, transform: 'rotate(22deg)', background: 'linear-gradient(90deg,transparent,#ffffffb8,transparent)', filter: 'blur(6px)', pointerEvents: 'none'}}/>}
    </div>
    <svg viewBox="0 0 676 424" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}} aria-hidden="true">
      <defs><linearGradient id="award-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff4cb"/><stop offset=".44" stopColor="#d99e72"/><stop offset=".7" stopColor="#fff2bc"/><stop offset="1" stopColor="#bc7282"/></linearGradient></defs>
      <path d="M43 88c8-33 21-46 59-48M573 40c39 3 52 16 60 48M43 334c7 34 22 47 59 50M573 384c39-3 53-17 60-50" fill="none" stroke="#fff9e7" strokeWidth="5" strokeLinecap="round"/>
      <path d="M24 113c17-8 28-24 28-45 12 13 19 25 36 29-17 5-27 13-32 27-8-13-19-17-32-11ZM652 113c-17-8-28-24-28-45-12 13-19 25-36 29 17 5 27 13 32 27 8-13 19-17 32-11ZM24 311c17 8 28 24 28 45 12-13 19-25 36-29-17-5-27-13-32-27-8 13-19 17-32 11ZM652 311c-17 8-28 24-28 45-12-13-19-25-36-29 17-5 27-13 32-27 8 13 19 17 32 11Z" fill="url(#award-metal)" stroke="#a46e7d" strokeWidth="3"/>
      <path d="M286 26 305 8l33 13 33-13 19 18-11 26h-82Z" fill="url(#award-metal)" stroke="#a46e7d" strokeWidth="3"/>
      <path d="m319 18 7 13 12-15 12 15 7-13 10 6-7 19h-44l-7-19Z" fill="#fff7d9" stroke="#bf8b87" strokeWidth="2"/>
      <circle cx="338" cy="26" r="5" fill="#d1849b"/><circle cx="62" cy="92" r="5" fill="#fff7df"/><circle cx="614" cy="92" r="5" fill="#fff7df"/><circle cx="62" cy="332" r="5" fill="#fff7df"/><circle cx="614" cy="332" r="5" fill="#fff7df"/>
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', fontSize: 16, fontWeight: 900, color: '#fffaf1', textShadow: '0 2px 3px #8f5269', background: 'linear-gradient(90deg,transparent 19%,#b76f89 35%,#98506f 50%,#b76f89 65%,transparent 81%)', padding: '5px 0'}}>Giải thưởng</div>
  </div>;
};

export const GiftAnimation: React.FC<{gift: Gift; winner: string; reducedMotion: boolean}> = ({gift, reducedMotion}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (reducedMotion) return <AbsoluteFill style={{background: '#fff8f7', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle,#fffdf7,#f9e5eb 65%,#eec7d5)'}}/>
    <div style={{width: 440, height: 365, opacity: interpolate(frame, [218, 237], [1, 0], clamp)}}><GiftIllustration className="gift-box-art"/></div>
    <AwardFrame gift={gift} frame={frame} fps={fps} reducedMotion/>
  </AbsoluteFill>;
  const entrance = spring({frame: Math.max(0, frame - 197), fps, config: {damping: 12, stiffness: 125}});
  const openness = interpolate(frame, [205, 218, 234], [0, .72, 1], clamp);
  const shake = frame >= 199 && frame < 221 ? Math.sin(frame * 2.8) * interpolate(frame, [199, 221], [2, 8], clamp) : 0;
  const glow = interpolate(frame, [202, 222, 244, 286], [0, 1, .7, .2], clamp);
  const particleFade = interpolate(frame, [258, 294], [1, 0], clamp);
  return <AbsoluteFill style={{background: '#fff8f7', overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', width: 560, height: 430, borderRadius: '50%', background: 'radial-gradient(circle,#f9d5e0 0%,#fcebef 55%,transparent 75%)', scale: 1 + glow * .2}}/>
    <div style={{position: 'absolute', width: 500, height: 360, borderRadius: '50%', background: '#ffe4ac', filter: 'blur(43px)', opacity: glow * .58}}/>
    <svg viewBox="0 0 800 500" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none'}} aria-hidden="true">
      <defs>
        <linearGradient id="gift-beam" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe3a9" stopOpacity=".72"/><stop offset="1" stopColor="#fff7d3" stopOpacity="0"/></linearGradient>
        <radialGradient id="gift-lamp"><stop stopColor="#fff"/><stop offset=".45" stopColor="#ffe6ab"/><stop offset="1" stopColor="#ce8ca0"/></radialGradient>
      </defs>
      {[0, 1, 2, 3].map((_, i) => {
        const x = [76, 250, 550, 724][i];
        const swing = Math.sin(frame / (14 + i * 3) + i * 1.7) * (frame < 185 ? 17 : 8);
        const strength = frame < 185 ? .25 + Math.abs(Math.sin(frame / 11 + i)) * .22 : .36 + Math.abs(Math.sin(frame / 5 + i)) * .26;
        return <g key={`beam-${i}`} transform={`rotate(${swing} ${x} 28)`} opacity={strength}>
          <path d={`M${x - 12} 26 ${x - 132} 480 ${x + 132} 480 ${x + 12} 26Z`} fill="url(#gift-beam)"/>
          <ellipse cx={x} cy="29" rx="23" ry="10" fill="#bf7d96"/>
          <ellipse cx={x} cy="33" rx="15" ry="6" fill="url(#gift-lamp)"/>
        </g>;
      })}
      {Array.from({length: 12}, (_, i) => <g key={`light-${i}`} opacity={.3 + .7 * Math.max(0, Math.sin(frame / (frame < 185 ? 8 : 3) - i * .65))}>
        <circle cx={57 + i * 62.4} cy="472" r="10" fill="#ffe9b9" opacity=".35"/>
        <circle cx={57 + i * 62.4} cy="472" r="4" fill="url(#gift-lamp)"/>
      </g>)}
    </svg>
    <LuckyWheel frame={frame} gift={gift}/>
    {[0, 1, 2].map((_, i) => <div key={`ring-${i}`} style={{position: 'absolute', zIndex: 3, width: 170, height: 170, border: '4px solid #e9a8bc', borderRadius: '50%', opacity: interpolate(frame, [221 + i * 13, 230 + i * 13, 274 + i * 13], [0, .7, 0], clamp), scale: interpolate(frame, [221 + i * 13, 279 + i * 13], [.4, 3.1], clamp)}}/>)}
    <Petal className="gift-petal-animation"/>
    <div style={{position: 'relative', zIndex: 4, width: 440, height: 365, opacity: interpolate(frame, [191, 206, 229, 244], [0, 1, 1, 0], clamp), translate: `${shake}px ${interpolate(frame, [191, 215, 240], [65, -18, -12], clamp)}px`, scale: .65 + entrance * .35}}><GiftIllustration className="gift-box-art" openProgress={openness}/></div>
    <AwardFrame gift={gift} frame={frame} fps={fps}/>
    <div style={{position: 'absolute', inset: 0, zIndex: 5, background: 'radial-gradient(circle at 50% 45%,#fffdf0 0%,#fff0c3 24%,transparent 67%)', opacity: interpolate(frame, [229, 235, 244], [0, .72, 0], clamp), pointerEvents: 'none'}}/>
    {Array.from({length: 120}, (_, i) => {
      const burst = i < 75 ? 222 : 245;
      const elapsed = frame - burst;
      const direction = ((i * 47 + gift.id * 11) % 101) / 100 - .5;
      const x = 400 + direction * (14 + i % 5) * elapsed;
      const y = 215 - (8 + i * 13 % 10) * elapsed + .17 * elapsed * elapsed;
      const opacity = elapsed < 0 ? 0 : interpolate(elapsed, [0, 5, 52, 83], [0, 1, .9, 0], clamp);
      return <div key={`confetti-${i}`} style={{position: 'absolute', zIndex: 6, left: 0, top: 0, width: i % 7 === 0 ? 7 : 10 + i % 5, height: i % 7 === 0 ? 18 : 7 + i % 4, borderRadius: i % 7 === 0 ? 8 : i % 4 === 0 ? '50%' : 2, background: confettiColors[i % confettiColors.length], opacity: opacity * particleFade, translate: `${x}px ${y}px`, rotate: `${elapsed * (i % 2 ? 9 : -12) + i * 25}deg`}}/>;
    })}
    {Array.from({length: 18}, (_, i) => {
      const elapsed = frame - (224 + i % 3 * 5);
      const direction = ((i * 37 + gift.id * 9) % 89) / 89 - .5;
      const x = 400 + direction * 15 * elapsed;
      const y = 215 - (9 + i % 5) * elapsed + .16 * elapsed * elapsed;
      const opacity = elapsed < 0 ? 0 : interpolate(elapsed, [0, 8, 48, 78], [0, .95, .8, 0], clamp);
      return <svg key={`streamer-${i}`} viewBox="0 0 24 90" style={{position: 'absolute', zIndex: 7, left: 0, top: 0, width: 18 + i % 4 * 4, height: 70 + i % 3 * 14, opacity: opacity * particleFade, translate: `${x}px ${y}px`, rotate: `${i * 29 + elapsed * (i % 2 ? 4 : -5)}deg`}} aria-hidden="true"><path d="M12 0C-3 11 28 21 12 33-3 45 28 54 12 66-1 77 22 83 12 90" fill="none" stroke={confettiColors[(i + 2) % confettiColors.length]} strokeWidth="6" strokeLinecap="round"/></svg>;
    })}
    {Array.from({length: 14}, (_, i) => {
      const elapsed = frame - (232 + i % 4 * 5);
      const x = 70 + ((i * 143 + gift.id * 21) % 660) + Math.sin(elapsed / 10 + i) * 22;
      const y = -70 + elapsed * (3.3 + i % 4 * .55);
      const opacity = elapsed < 0 ? 0 : interpolate(elapsed, [0, 9, 63, 91], [0, .78, .7, 0], clamp);
      return <div key={`flower-${i}`} style={{position: 'absolute', zIndex: 7, left: 0, top: 0, width: 25 + i % 4 * 5, height: 25 + i % 4 * 5, opacity: opacity * particleFade, translate: `${x}px ${y}px`, rotate: `${elapsed * (i % 2 ? 3 : -4)}deg`}}><Petal className="falling-flower"/></div>;
    })}
  </AbsoluteFill>;
};

export const CelebrationPlayer: React.FC<{gift: Gift; winner: string; paused: boolean; replayVersion: number; onReplay: () => void; onRevealReady: () => void}> = ({gift, winner, paused, replayVersion, onReplay, onRevealReady}) => {
  const player = useRef<PlayerRef>(null);
  const revealNotified = useRef(false);
  const revealCallback = useRef(onRevealReady);
  const [reducedMotion, setReducedMotion] = useState(false);
  revealCallback.current = onRevealReady;
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const current = player.current;
    if (!current) return;
    revealNotified.current = false;
    beginGiftSequence();
    const handleFrame = ({detail}: {detail: {frame: number}}) => {
      syncGiftSequence(detail.frame);
      if (detail.frame >= 247 && !revealNotified.current) {
        revealNotified.current = true;
        revealCallback.current();
      }
    };
    current.addEventListener('frameupdate', handleFrame);
    handleFrame({detail: {frame: current.getCurrentFrame()}});
    return () => {current.removeEventListener('frameupdate', handleFrame); endGiftSequence();};
  }, [gift.id, winner]);
  useEffect(() => {
    setGiftSequencePaused(paused);
    if (paused) player.current?.pause();
    else player.current?.play();
  }, [paused, gift.id]);
  const replay = () => {revealNotified.current = false; onReplay(); beginGiftSequence(); player.current?.seekTo(0); player.current?.play();};
  useEffect(() => { if (replayVersion > 0) replay(); }, [replayVersion]);
  return <div className="gift-player">
    <Player ref={player} key={`${gift.id}-${winner}`} component={GiftAnimation} inputProps={{gift, winner, reducedMotion}} durationInFrames={300} compositionWidth={800} compositionHeight={500} fps={30} autoPlay initiallyMuted moveToBeginningWhenEnded={false} style={{width: '100%', aspectRatio: '8 / 5', borderRadius: 24, overflow: 'hidden'}}/>
    <button className="replay-button" onClick={replay} aria-label="Quay lại vòng quay may mắn">↻ Quay lại</button>
  </div>;
};

export const WelcomePlayer: React.FC = () => <Player component={CoupleAnimation} durationInFrames={180} compositionWidth={600} compositionHeight={600} fps={30} autoPlay loop initiallyMuted style={{width: '100%', aspectRatio: '1 / 1'}}/>;
