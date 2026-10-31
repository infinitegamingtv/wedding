import fs from 'node:fs';
import path from 'node:path';

// Original, loopable 132 BPM game-lobby tune. Keep its WAV source outside public/assets.
const rate = 32000;
const beat = 60 / 132;
const bars = 16;
const duration = bars * 4 * beat;
const samples = new Float32Array(Math.round(duration * rate));
const hz = midi => 440 * 2 ** ((midi - 69) / 12);
const add = (at, length, midi, volume, timbre = 'pluck') => {
  const start = Math.round(at * rate);
  const count = Math.min(samples.length - start, Math.round(length * rate));
  const frequency = hz(midi);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const phase = 2 * Math.PI * frequency * t;
    const attack = Math.min(1, t / .006);
    const release = Math.min(1, (length - t) / .025);
    const decay = Math.exp(-t * (timbre === 'bass' ? 2.8 : timbre === 'bell' ? 3.4 : 5.2));
    const wave = timbre === 'bass'
      ? Math.sin(phase) * .85 + Math.sin(phase * 2) * .15
      : timbre === 'bell'
        ? Math.sin(phase) * .62 + Math.sin(phase * 2.01) * .23 + Math.sin(phase * 3.98) * .15
        : Math.sin(phase) * .48 + Math.sin(phase * 2) * .3 + Math.sin(phase * 3) * .16 + Math.sin(phase * 4) * .06;
    samples[start + i] += wave * attack * release * decay * volume;
  }
};

let seed = 37591;
const noise = () => {seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2147483648 - 1;};
const percussion = (at, kind, volume) => {
  const start = Math.round(at * rate);
  const length = kind === 'kick' ? .18 : kind === 'clap' ? .12 : .055;
  const count = Math.min(samples.length - start, Math.round(length * rate));
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const envelope = Math.exp(-t * (kind === 'kick' ? 23 : kind === 'clap' ? 33 : 62));
    const tone = kind === 'kick' ? Math.sin(2 * Math.PI * (90 - t * 165) * t) * .8 + noise() * .1 : noise() * (kind === 'clap' ? .6 : .3);
    samples[start + i] += tone * envelope * volume;
  }
};

// G–D–Em–C with a V–I turn at the loop boundary.
const chords = [
  {root: 43, notes: [67, 71, 74]}, {root: 38, notes: [66, 69, 74]},
  {root: 40, notes: [64, 67, 71]}, {root: 36, notes: [64, 67, 72]},
  {root: 43, notes: [67, 71, 74]}, {root: 38, notes: [66, 69, 74]},
  {root: 36, notes: [64, 67, 72]}, {root: 38, notes: [66, 69, 74]},
];
const motifs = [
  [79, null, 78, 74, 76, 79, null, 74],
  [78, null, 76, 74, 69, 74, 76, null],
  [76, null, 79, 83, 81, 79, null, 76],
  [79, null, 76, 72, 74, 76, 79, null],
  [83, null, 81, 79, 76, 79, null, 74],
  [78, null, 81, 78, 76, 74, 76, null],
  [76, null, 79, 76, 72, 76, 79, null],
  [78, null, 76, 74, 81, 78, 74, null],
];

for (let bar = 0; bar < bars; bar++) {
  const chord = chords[bar % chords.length];
  const at = bar * 4 * beat;
  for (let step = 0; step < 4; step++) {
    const time = at + step * beat;
    add(time, .34, chord.root, step === 0 ? .18 : .13, 'bass');
    percussion(time, 'kick', step === 0 || step === 2 ? .22 : .11);
    if (step === 1 || step === 3) percussion(time, 'clap', .1);
    // Off-beat ukulele-like strums leave room for the melody.
    for (const note of chord.notes) add(time + beat * .5, .18, note, .043, 'pluck');
    add(time + beat * .76, .1, chord.notes[step % 3] + 12, .025, 'pluck');
    percussion(time + beat * .5, 'shaker', .13);
  }
  const motif = motifs[bar % motifs.length];
  for (let step = 0; step < motif.length; step++) {
    if (motif[step] === null) continue;
    add(at + step * beat * .5, step % 4 === 0 ? .31 : .22, motif[step], bar >= 8 ? .1 : .085, 'bell');
  }
}

// Short edge fade prevents clicks while keeping the beat continuous across loops.
let peak = 0;
for (let i = 0; i < samples.length; i++) peak = Math.max(peak, Math.abs(samples[i]));
const pcm = Buffer.alloc(44 + samples.length * 2);
pcm.write('RIFF', 0); pcm.writeUInt32LE(pcm.length - 8, 4); pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(rate, 24); pcm.writeUInt32LE(rate * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
pcm.write('data', 36); pcm.writeUInt32LE(samples.length * 2, 40);
for (let i = 0; i < samples.length; i++) {
  const edge = Math.min(1, i / (rate * .012), (samples.length - i - 1) / (rate * .012));
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * edge * .78 / peak)) * 32767), 44 + i * 2);
}
const target = path.resolve('archive/unused-assets/wedding-bgm-fun-source.wav');
fs.mkdirSync(path.dirname(target), {recursive: true});
fs.writeFileSync(target, pcm);
console.log(`Created ${duration.toFixed(2)}s upbeat BGM source at ${target}`);
