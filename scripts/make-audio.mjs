import fs from 'node:fs';
import path from 'node:path';

const rate = 32000;
const destination = path.resolve('public/assets');
const random = (n) => {const x = Math.sin(n * 127.1 + 31.4) * 43758.5453; return x - Math.floor(x);};
const pitch = (midi) => 440 * 2 ** ((midi - 69) / 12);
const render = (seconds, voices) => {
  const samples = new Float32Array(Math.round(seconds * rate));
  for (const voice of voices) {
    const start = Math.round(voice.at * rate);
    const count = Math.min(samples.length - start, Math.round(voice.duration * rate));
    if (count < 1) continue;
    const f = pitch(voice.midi || 60);
    for (let i = 0; i < count; i++) {
      const t = i / rate;
      const attack = Math.min(1, t / (voice.kind === 'pad' ? .18 : .009));
      const release = Math.min(1, (voice.duration - t) / (voice.kind === 'pad' ? .35 : .075));
      let wave = 0;
      if (voice.kind === 'pad') wave = Math.sin(2 * Math.PI * f * t) * .7 + Math.sin(2 * Math.PI * f * 2 * t) * .12;
      else if (voice.kind === 'bass') wave = Math.sin(2 * Math.PI * f * t) * .8 + Math.sin(2 * Math.PI * f * 2 * t) * .16;
      else if (voice.kind === 'chime') wave = Math.sin(2 * Math.PI * f * t) * .66 + Math.sin(2 * Math.PI * f * 2.01 * t) * .23 + Math.sin(2 * Math.PI * f * 3.97 * t) * .1;
      else wave = Math.sin(2 * Math.PI * f * t) * .64 + Math.sin(2 * Math.PI * f * 2 * t) * .24 + Math.sin(2 * Math.PI * f * 3 * t) * .1;
      const decay = voice.kind === 'pad' ? 1 : Math.exp(-t * (voice.kind === 'bass' ? 2.2 : 3.5));
      samples[start + i] += wave * attack * release * decay * voice.volume;
    }
  }
  return samples;
};
const save = (filename, samples) => {
  const bytes = Buffer.alloc(44 + samples.length * 2);
  bytes.write('RIFF', 0); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36); bytes.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) bytes.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32767, 44 + i * 2);
  fs.writeFileSync(path.join(destination, filename), bytes);
};

const beat = .6;
const chords = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]];
const melody = [74, 76, 78, 76, 74, 69, 71, 73, 74, 71, 69, 67, 69, 73, 76, 74, 78, 76, 74, 69, 71, 73, 74, 78, 79, 78, 76, 73, 74, 69, 73, 74];
const voices = [];
for (let bar = 0; bar < 8; bar++) {
  const chord = chords[bar % 4];
  for (const midi of chord) voices.push({at: bar * 4 * beat, duration: 4 * beat, midi: midi - 12, kind: 'pad', volume: .035});
  voices.push({at: bar * 4 * beat, duration: 1.2, midi: chord[0] - 24, kind: 'bass', volume: .09});
  voices.push({at: (bar * 4 + 2) * beat, duration: .9, midi: chord[2] - 24, kind: 'bass', volume: .055});
  for (let step = 0; step < 4; step++) voices.push({at: (bar * 4 + step) * beat, duration: .8, midi: chord[step % 3] + 12, kind: 'chime', volume: .095});
}
for (let i = 0; i < melody.length; i++) voices.push({at: i * beat, duration: .75, midi: melody[i], kind: 'chime', volume: .075});
const music = render(19.2, voices);
for (let i = 0; i < music.length; i++) music[i] *= Math.min(1, i / 12000, (music.length - i) / 12000) * .95;
save('wedding-bgm.wav', music);

save('sfx-click.wav', render(.14, [{at: 0, duration: .13, midi: 76, kind: 'chime', volume: .28}]));
save('sfx-tile.wav', render(.22, [{at: 0, duration: .2, midi: 81, kind: 'chime', volume: .24}]));
save('sfx-wrong.wav', render(.55, [{at: 0, duration: .31, midi: 60, kind: 'bass', volume: .24}, {at: .18, duration: .33, midi: 57, kind: 'bass', volume: .22}]));
save('sfx-correct.wav', render(1.1, [
  {at: 0, duration: .75, midi: 74, kind: 'chime', volume: .25},
  {at: .12, duration: .72, midi: 78, kind: 'chime', volume: .25},
  {at: .24, duration: .72, midi: 81, kind: 'chime', volume: .25},
  {at: .37, duration: .65, midi: 86, kind: 'chime', volume: .23},
]));
save('sfx-reveal.wav', render(1.35, Array.from({length: 13}, (_, i) => ({at: i * .07, duration: .5 + random(i) * .4, midi: 74 + Math.floor(random(i + 30) * 17), kind: 'chime', volume: .075}))));
console.log('Created original wedding BGM and five SFX files.');
