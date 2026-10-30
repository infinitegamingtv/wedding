type Effect = 'click' | 'tile' | 'wrong' | 'correct' | 'reveal';
let enabled = true;
let music: HTMLAudioElement | null = null;
const effects: Partial<Record<Effect, HTMLAudioElement>> = {};

const getMusic = () => {
  if (!music) {
    music = new Audio('/assets/wedding-bgm.wav');
    music.loop = true;
    music.volume = .3;
  }
  return music;
};

export const startMusic = () => {
  if (!enabled) return;
  void getMusic().play().catch(() => {});
};

export const setSoundEnabled = (value: boolean) => {
  enabled = value;
  if (value) startMusic(); else getMusic().pause();
};

export const playSfx = (effect: Effect) => {
  if (!enabled) return;
  const source = effects[effect] || new Audio(`/assets/sfx-${effect}.wav`);
  effects[effect] = source;
  source.volume = effect === 'reveal' ? .55 : .42;
  source.currentTime = 0;
  void source.play().catch(() => {});
};
