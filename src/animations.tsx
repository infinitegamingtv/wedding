import React, {useRef} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AbsoluteFill, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Gift} from './data';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const floating = (frame: number, offset: number) => Math.sin((frame + offset) / 13) * 8;

export const CoupleAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <AbsoluteFill style={{overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: '#ffe4db', scale: spring({frame, fps, config: {damping: 120}})}} />
    <Img src="/assets/couple-square.jpg" style={{width: '76%', maxWidth: 360, borderRadius: '50%', mixBlendMode: 'multiply', translate: `0px ${floating(frame, 0)}px`, scale: interpolate(frame, [0, 20], [0.86, 1], clamp)}} />
    {['✦', '♥', '✧', '♥'].map((star, i) => <div key={i} style={{position: 'absolute', left: `${[12, 80, 75, 15][i]}%`, top: `${[24, 12, 74, 75][i]}%`, color: i % 2 ? '#e76f70' : '#e0ae4d', fontSize: i % 2 ? 29 : 38, opacity: interpolate(frame, [i * 5, i * 5 + 12], [0, 1], clamp), translate: `0px ${floating(frame, i * 14)}px`}}>{star}</div>)}
  </AbsoluteFill>;
};

export const GiftAnimation: React.FC<{gift: Gift; winner: string}> = ({gift, winner}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boxScale = spring({frame, fps, config: {damping: 12, stiffness: 130}});
  return <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #71334d 0%, #351c37 65%, #1b102b 100%)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', color: '#fff3dc'}}>
    {Array.from({length: 20}, (_, i) => <div key={i} style={{position: 'absolute', left: `${(i * 47) % 100}%`, top: `${(i * 31) % 100}%`, fontSize: 22 + i % 4 * 6, color: i % 3 ? '#dc8f9c' : '#e4b05d', rotate: `${frame * (i % 2 ? 1.8 : -1.4)}deg`, translate: `0px ${interpolate(frame, [0, 140], [-90 + i * 8, 200 + i * 11], clamp)}px`, opacity: interpolate(frame, [0, 20, 115, 145], [0, 1, 1, 0], clamp)}}>{i % 3 ? '✦' : '♥'}</div>)}
    <Sequence from={0} durationInFrames={65}>
      <div style={{textAlign: 'center', zIndex: 2, padding: 30, width: '100%', opacity: interpolate(frame, [0, 48, 62], [1, 1, 0], clamp)}}>
        <div style={{fontSize: 18, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase'}}>Xin chúc mừng {winner}</div>
        <Img src="/assets/gift-chest-closed.png" style={{width: 260, height: 230, objectFit: 'contain', margin: '3px auto -15px', scale: .7 + boxScale * .3, filter: 'drop-shadow(0 18px 24px #6b23397a)'}} />
        <div style={{fontSize: 23, fontWeight: 800, marginTop: 10}}>MÓN QUÀ BÍ ẨN...</div>
      </div>
    </Sequence>
    <Sequence from={55}>
      <div style={{textAlign: 'center', zIndex: 3, padding: 28, width: '100%', opacity: interpolate(frame, [55, 72], [0, 1], clamp), scale: interpolate(frame, [55, 76], [0.75, 1], clamp)}}>
        <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 2}}>BẠN NHẬN ĐƯỢC</div>
        <Img src="/assets/gift-chest-open.png" style={{width: 250, height: 155, objectFit: 'contain', margin: '-8px auto -2px', filter: 'drop-shadow(0 12px 18px #e9a950bb)'}} />
        <div style={{fontSize: 35, fontWeight: 900, lineHeight: 1.2, maxWidth: 640, margin: '0 auto'}}>{gift.title}</div>
        <div style={{fontSize: 22, marginTop: 16, color: '#ffd79f'}}>Chính là… <strong>{gift.item}</strong>!</div>
      </div>
    </Sequence>
  </AbsoluteFill>;
};

export const CelebrationPlayer: React.FC<{gift: Gift; winner: string}> = ({gift, winner}) => {
  const player = useRef<PlayerRef>(null);
  const replay = () => {
    player.current?.seekTo(0);
    player.current?.play();
  };
  return <div className="gift-player">
    <Player
      ref={player}
      key={`${gift.id}-${winner}`}
      component={GiftAnimation}
      inputProps={{gift, winner}}
      durationInFrames={150}
      compositionWidth={800}
      compositionHeight={500}
      fps={30}
      autoPlay
      initiallyMuted
      style={{width: '100%', aspectRatio: '8 / 5', borderRadius: 24, overflow: 'hidden'}}
    />
    <button className="replay-button" onClick={replay} aria-label="Mở rương hoặc xem lại hiệu ứng mở quà">▶ MỞ RƯƠNG / XEM LẠI</button>
  </div>;
};

export const WelcomePlayer: React.FC = () => <Player
  component={CoupleAnimation}
  durationInFrames={180}
  compositionWidth={600}
  compositionHeight={600}
  fps={30}
  autoPlay
  loop
  initiallyMuted
  style={{width: '100%', aspectRatio: '1 / 1'}}
/>;
