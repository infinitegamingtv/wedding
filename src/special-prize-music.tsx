import {useEffect, useRef, useState} from 'react';
import {setExternalClipActive} from './audio';
import {assetUrl} from './asset-url';

export function SpecialPrizeMusic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setNeedsTap(true));
    return () => {
      video.pause();
      setExternalClipActive(false);
    };
  }, []);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
  };

  return <div className="special-prize-music">
    <div className="special-prize-music-head"><span>♪ Đoạn nhạc riêng cho giải này</span><span>1:01 đến 1:09</span></div>
    <video
      ref={videoRef}
      className="special-prize-video"
      src={assetUrl('assets/let-me-go-61-69.mp4')}
      poster={assetUrl('assets/let-me-go-poster.jpg')}
      controls
      playsInline
      preload="auto"
      aria-label="Video LET ME GO, đoạn từ 1 phút 01 đến 1 phút 09"
      onPlay={() => {setExternalClipActive(true); setNeedsTap(false);}}
      onPause={() => setExternalClipActive(false)}
      onEnded={() => setExternalClipActive(false)}
    />
    <button className="special-prize-replay" onClick={replay}>{needsTap ? '▶ Phát đoạn nhạc' : '↻ Phát lại đoạn nhạc'}</button>
  </div>;
}
