import React, {useRef} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {AbsoluteFill, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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

export const GiftAnimation: React.FC<{gift: Gift; winner: string}> = ({gift, winner}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 13, stiffness: 110}});
  const open = frame >= 57;
  return <AbsoluteFill style={{background: '#fff8f7', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', color: '#744558'}}>
    <div style={{position: 'absolute', width: '72%', aspectRatio: '1', borderRadius: '50%', background: '#fbe9ec'}} />
    <Petal className="gift-petal-animation"/>
    <Sequence from={0} durationInFrames={66}>
      <div style={{textAlign: 'center', zIndex: 2, width: '100%', opacity: interpolate(frame, [0, 51, 65], [1, 1, 0], clamp)}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase'}}>Chúc mừng {winner}</div>
        <div style={{width: 310, maxWidth: '66%', margin: '0 auto', transform: `scale(${0.85 + pop * 0.15})`}}><GiftIllustration/></div>
        <div style={{fontSize: 23, fontWeight: 700}}>Một món quà đang đợi bạn</div>
      </div>
    </Sequence>
    <Sequence from={55}>
      <div style={{textAlign: 'center', zIndex: 3, width: '100%', opacity: interpolate(frame, [55, 74], [0, 1], clamp), transform: `scale(${interpolate(frame, [55, 77], [0.8, 1], clamp)})`}}>
        <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 2}}>BẠN NHẬN ĐƯỢC</div>
        <div style={{width: 260, maxWidth: '57%', margin: '-5px auto -18px'}}><GiftIllustration open={open}/></div>
        <div style={{fontSize: 38, fontWeight: 900, lineHeight: 1.2, maxWidth: 650, margin: '0 auto', color: '#a85070'}}>{gift.title}</div>
      </div>
    </Sequence>
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
