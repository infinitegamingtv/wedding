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
const cinematicRiser = () => {
  const duration = 2.55;
  const samples = new Float32Array(Math.round(duration * rate));
  let seed = 9127, smoothNoise = 0, phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate, p = t / duration;
    seed = (1664525 * seed + 1013904223) >>> 0;
    smoothNoise = smoothNoise * .7 + ((seed / 2147483648) - 1) * .3;
    phase += 2 * Math.PI * (130 + 1200 * p * p) / rate;
    const pulse = .72 + .28 * Math.sin(2 * Math.PI * (5 * t + 2.5 * t * t));
    const envelope = p ** 1.25 * Math.min(1, (duration - t) / .09);
    samples[i] = (Math.sin(phase) * .23 + smoothNoise * .34 + Math.sin(phase * .5) * .13) * envelope * pulse;
  }
  return samples;
};
const cinematicDrums = () => {
  const samples = new Float32Array(Math.round(1.3 * rate));
  const hits = [0, .32, .57, .75, .89, 1.01];
  let seed = 337;
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    seed = (1664525 * seed + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    for (const hit of hits) {
      const elapsed = t - hit;
      if (elapsed < 0 || elapsed > .27) continue;
      const weight = .62 + hit * .25;
      samples[i] += (Math.sin(2 * Math.PI * (74 - 24 * elapsed) * elapsed) * .32 + noise * .1) * Math.exp(-elapsed * 18) * weight;
    }
  }
  return samples;
};
const cinematicImpact = () => {
  const samples = new Float32Array(Math.round(1.55 * rate));
  let seed = 5761, lowNoise = 0, phase = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    seed = (1664525 * seed + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    lowNoise = lowNoise * .86 + noise * .14;
    phase += 2 * Math.PI * (50 + 105 * Math.exp(-t * 18)) / rate;
    const kick = Math.sin(phase) * .54 * Math.exp(-t * 7);
    const shimmer = (noise - lowNoise) * .2 * Math.exp(-t * 3.8);
    const chord = (Math.sin(2 * Math.PI * 392 * t) + Math.sin(2 * Math.PI * 494 * t) + Math.sin(2 * Math.PI * 587 * t)) * .08 * Math.exp(-t * 2.4);
    samples[i] = (kick + shimmer + chord) * Math.min(1, t / .009);
  }
  return samples;
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
save('sfx-tick.wav', render(.11, [{at: 0, duration: .1, midi: 82, kind: 'chime', volume: .22}]));
save('sfx-drum.wav', cinematicDrums());
save('sfx-riser.wav', cinematicRiser());
save('sfx-impact.wav', cinematicImpact());
save('sfx-stage.wav', render(1.75, [
  {at: 0, duration: 1.25, midi: 62, kind: 'pad', volume: .08},
  {at: 0, duration: 1.25, midi: 66, kind: 'pad', volume: .08},
  {at: 0, duration: 1.25, midi: 69, kind: 'pad', volume: .08},
  {at: .12, duration: .65, midi: 74, kind: 'chime', volume: .16},
  {at: .3, duration: .7, midi: 78, kind: 'chime', volume: .16},
  {at: .48, duration: .82, midi: 81, kind: 'chime', volume: .17},
  {at: .72, duration: .9, midi: 86, kind: 'chime', volume: .17},
]));
console.log('Created original wedding BGM and ten SFX files.');
