import {assetUrl} from './asset-url';

type Effect = 'click' | 'tile' | 'wrong' | 'correct' | 'reveal' | 'tick' | 'drum' | 'stage' | 'riser' | 'impact';
let enabled = true;
let music: HTMLAudioElement | null = null;
let wheelMusic: HTMLAudioElement | null = null;
const effects: Partial<Record<Effect, HTMLAudioElement>> = {};
let giftSequenceActive = false;
let giftFrame = -1;
let externalClipActive = false;
let giftSequencePaused = false;
const wheelMusicEndFrame = 186;
const giftEffects: Effect[] = ['tick', 'riser', 'drum', 'impact', 'reveal'];
const tickFrames = Array.from({length: 20}, (_, i) => Math.round((i < 12 ? i * 205 : 2460 + (i - 12) * (260 + (i - 12) * 34)) * 30 / 1000));
const giftCues: {frame: number; effect: Effect}[] = [
  ...tickFrames.map(frame => ({frame, effect: 'tick' as const})),
  {frame: 155, effect: 'riser'},
  {frame: 191, effect: 'drum'},
  {frame: 232, effect: 'impact'},
  {frame: 236, effect: 'reveal'},
];

const getMusic = () => {
  if (!music) {
    music = new Audio(assetUrl('assets/wedding-bgm.mp3?v=2'));
    music.loop = true;
    music.volume = .13;
  }
  return music;
};

const getWheelMusic = () => {
  if (!wheelMusic) {
    wheelMusic = new Audio(assetUrl('assets/lottery-wheel.mp3'));
    wheelMusic.preload = 'auto';
    wheelMusic.volume = .72;
  }
  return wheelMusic;
};

export const startMusic = () => {
  if (!enabled) return;
  void getMusic().play().catch(() => {});
};

export const setSoundEnabled = (value: boolean) => {
  enabled = value;
  if (value) {
    startMusic();
    if (giftSequenceActive && !giftSequencePaused && giftFrame < wheelMusicEndFrame && giftFrame >= 0) {
      const wheel = getWheelMusic();
      wheel.currentTime = giftFrame / 30;
      void wheel.play().catch(() => {});
    }
  } else {
    getMusic().pause();
    wheelMusic?.pause();
    Object.values(effects).forEach(effect => effect?.pause());
  }
};

export const setExternalClipActive = (active: boolean) => {
  externalClipActive = active;
  getMusic().volume = active ? 0 : giftSequenceActive && giftFrame < 276 ? .07 : .13;
};

export const playSfx = (effect: Effect) => {
  if (!enabled) return;
  const source = effects[effect] || new Audio(assetUrl(`assets/sfx-${effect}.mp3`));
  effects[effect] = source;
  source.volume = effect === 'impact' ? .72 : effect === 'drum' ? .65 : effect === 'reveal' ? .52 : effect === 'riser' ? .55 : effect === 'tick' && giftSequenceActive ? .16 : effect === 'tick' ? .34 : .42;
  source.currentTime = 0;
  void source.play().catch(() => {});
};

export const beginGiftSequence = () => {
  giftEffects.forEach(effect => effects[effect]?.pause());
  giftSequenceActive = true;
  giftSequencePaused = false;
  giftFrame = -1;
  const wheel = getWheelMusic();
  wheel.pause();
  wheel.currentTime = 0;
  if (enabled) void wheel.play().catch(() => {});
  if (enabled && !externalClipActive) getMusic().volume = .03;
};

export const syncGiftSequence = (frame: number) => {
  if (!giftSequenceActive || giftSequencePaused || frame <= giftFrame) return;
  const skippedFrames = frame - giftFrame > 8;
  if (!skippedFrames) for (const cue of giftCues) if (giftFrame < cue.frame && cue.frame <= frame) playSfx(cue.effect);
  if (frame < wheelMusicEndFrame && wheelMusic && !wheelMusic.paused && Math.abs(wheelMusic.currentTime - frame / 30) > .4) wheelMusic.currentTime = frame / 30;
  if (giftFrame < wheelMusicEndFrame && frame >= wheelMusicEndFrame) {
    wheelMusic?.pause();
    if (!externalClipActive) getMusic().volume = .07;
  }
  if (frame >= 276 && !externalClipActive) getMusic().volume = .13;
  giftFrame = frame;
};

export const endGiftSequence = () => {
  giftSequenceActive = false;
  giftSequencePaused = false;
  giftEffects.forEach(effect => effects[effect]?.pause());
  wheelMusic?.pause();
  getMusic().volume = externalClipActive ? 0 : .13;
};

export const setGiftSequencePaused = (paused: boolean) => {
  giftSequencePaused = paused;
  if (paused) { wheelMusic?.pause(); return; }
  if (enabled && giftSequenceActive && giftFrame >= 0 && giftFrame < wheelMusicEndFrame) {
    const wheel = getWheelMusic();
    wheel.currentTime = giftFrame / 30;
    void wheel.play().catch(() => {});
  }
};
