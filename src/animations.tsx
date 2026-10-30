import React, {useRef} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Gift} from './data';
import {GiftIllustration, Petal} from './illustrations';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CoupleAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', inset: '8%', border: '2px solid #ebc2cd', borderRadius: '50%'}} />
    <Img src="/assets/couple-square.jpg" alt="Ảnh chibi gốc của Quang Trưởng và Hồng Nhung" style={{width: '82%', height: '82%', objectFit: 'cover', borderRadius: '50%', border: '5px solid #fffaf9', boxShadow: '0 12px 35px #bc8b9a33', transform: `translateY(${Math.sin(frame / 18) * 5}px) scale(${0.94 + scale * 0.06})`}}/>
    <div style={{position: 'absolute', top: '12%', right: '6%', color: '#d4869e', fontSize: 32, transform: `rotate(${Math.sin(frame / 18) * 9}deg)`}}>♡</div>
  </AbsoluteFill>;
};

const confettiColors = ['#d789a3', '#efb7c8', '#e9bd79', '#a6bdab', '#bba2cf', '#fff1d8'];

export const GiftAnimation: React.FC<{gift: Gift; winner: string}> = ({gift}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 14, stiffness: 105}});
  const openness = interpolate(frame, [45, 55, 67, 81], [0, .12, .78, 1], clamp);
  const shake = frame >= 29 && frame < 56 ? Math.sin(frame * 2.5) * interpolate(frame, [29, 55], [2, 9], clamp) : 0;
  const boxLift = interpolate(frame, [0, 44, 60, 79, 100], [0, 0, -9, -22, -17], clamp);
  const glow = interpolate(frame, [52, 65, 82, 112], [0, .95, .68, .18], clamp);
  return <AbsoluteFill style={{background: '#fff8f7', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', color: '#744558'}}>
    <div style={{position: 'absolute', width: 520, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, #f9d9e2 0%, #fcebef 58%, transparent 72%)', scale: 1 + glow * .22}}/>
    <div style={{position: 'absolute', width: 440, height: 320, borderRadius: '50%', background: '#ffe8bb', filter: 'blur(38px)', opacity: glow * .6}}/>
    {[0, 1].map((_, i) => <div key={`ring-${i}`} style={{position: 'absolute', width: 220, height: 220, border: '4px solid #e6a8bc', borderRadius: '50%', opacity: interpolate(frame, [62 + i * 22, 68 + i * 22, 100 + i * 22], [0, .58, 0], clamp), scale: interpolate(frame, [62 + i * 22, 105 + i * 22], [.5, 2.8], clamp)}}/>)}
    <Petal className="gift-petal-animation"/>
    <div style={{position: 'relative', zIndex: 3, width: 450, height: 375, translate: `${shake}px ${boxLift}px`, scale: .82 + entrance * .18}}><GiftIllustration className="gift-box-art" openProgress={openness}/></div>
    {Array.from({length: 104}, (_, i) => {
      const burst = i < 68 ? 63 : 88;
      const elapsed = frame - burst;
      const direction = ((i * 47 + gift.id * 11) % 101) / 100 - .5;
      const speedX = direction * (15 + (i % 5));
      const speedY = 7 + (i * 13 % 10);
      const x = 400 + speedX * elapsed;
      const y = 213 - speedY * elapsed + .18 * elapsed * elapsed;
      const opacity = elapsed < 0 ? 0 : interpolate(elapsed, [0, 5, 47, 69], [0, 1, .95, 0], clamp);
      return <div key={`confetti-${i}`} style={{position: 'absolute', zIndex: 5, left: 0, top: 0, width: i % 7 === 0 ? 7 : 10 + i % 5, height: i % 7 === 0 ? 18 : 7 + i % 4, borderRadius: i % 7 === 0 ? 8 : i % 4 === 0 ? '50%' : 2, background: confettiColors[i % confettiColors.length], opacity, translate: `${x}px ${y}px`, rotate: `${elapsed * (i % 2 ? 9 : -12) + i * 25}deg`, scale: interpolate(elapsed, [0, 50], [1, .75], clamp)}}/>;
    })}
    {Array.from({length: 12}, (_, i) => {
      const angle = i * Math.PI / 6;
      const travel = interpolate(frame, [62, 77, 112], [0, 145, 190], clamp);
      return <div key={`spark-${i}`} style={{position: 'absolute', zIndex: 4, left: 395, top: 212, width: i % 3 ? 8 : 12, height: i % 3 ? 8 : 12, background: i % 2 ? '#e7bb78' : '#dfa1b5', clipPath: 'polygon(50% 0, 61% 38%, 100% 50%, 61% 62%, 50% 100%, 39% 62%, 0 50%, 39% 38%)', opacity: interpolate(frame, [62, 70, 98, 120], [0, 1, 1, 0], clamp), translate: `${Math.cos(angle) * travel}px ${Math.sin(angle) * travel}px`}}/>;
    })}
  </AbsoluteFill>;
};

export const CelebrationPlayer: React.FC<{gift: Gift; winner: string}> = ({gift, winner}) => {
  const player = useRef<PlayerRef>(null);
  const replay = () => {player.current?.seekTo(0); player.current?.play();};
  return <div className="gift-player">
    <Player ref={player} key={`${gift.id}-${winner}`} component={GiftAnimation} inputProps={{gift, winner}} durationInFrames={150} compositionWidth={800} compositionHeight={500} fps={30} autoPlay initiallyMuted style={{width: '100%', aspectRatio: '8 / 5', borderRadius: 24, overflow: 'hidden'}}/>
    <button className="replay-button" onClick={replay} aria-label="Mở quà hoặc xem lại hiệu ứng">▶ MỞ QUÀ / XEM LẠI</button>
  </div>;
};

export const WelcomePlayer: React.FC = () => <Player component={CoupleAnimation} durationInFrames={180} compositionWidth={600} compositionHeight={600} fps={30} autoPlay loop initiallyMuted style={{width: '100%', aspectRatio: '1 / 1'}}/>;
