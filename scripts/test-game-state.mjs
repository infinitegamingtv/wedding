import assert from 'node:assert/strict';
import {build} from 'esbuild';

const result = await build({entryPoints: ['src/game-state.ts'], bundle: true, format: 'esm', platform: 'node', write: false});
const source = Buffer.from(result.outputFiles[0].contents).toString('base64');
const {freshGame, makeBackup, parseBackup, validateGame} = await import(`data:text/javascript;base64,${source}`);

const order = Array.from({length: 10}, (_, index) => index + 1);
const fresh = freshGame();
assert.deepEqual(parseBackup(makeBackup(fresh)), fresh);

const question = {...fresh, phase: 'question', index: 2, giftOrder: order, wins: [{questionId: 1, player: 'Khách mời 01', giftId: 1}], deliveredQuestionIds: [1]};
assert.deepEqual(parseBackup(makeBackup(question)), question);

const skipped = {...question, phase: 'finish', index: 10};
assert.deepEqual(validateGame(skipped), skipped);

for (const invalid of [
  {...question, giftOrder: [1, 1, ...order.slice(2)]},
  {...question, wins: [{questionId: 1, player: 'Khách mời 01', giftId: 2}]},
  {...question, deliveredQuestionIds: [2]},
  {...question, index: 11},
]) assert.throws(() => validateGame(invalid));

assert.throws(() => parseBackup('{broken json'));
console.log('Game state backup and validation: OK');
