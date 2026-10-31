import {gifts, questions} from './data';

export type Win = {questionId: number; player: string; giftId: number};
export type Game = {
  phase: 'welcome' | 'question' | 'wrong' | 'gift' | 'finish';
  index: number;
  giftOrder: number[];
  wins: Win[];
  chosenLetters: number[];
  revealedLetterQuestionId: number | null;
  deliveredQuestionIds: number[];
};

export const storageKey = 'mo-qua-hy-quang-truong-hong-nhung-v1';
export const freshGame = (): Game => ({phase: 'welcome', index: 0, giftOrder: [], wins: [], chosenLetters: [], revealedLetterQuestionId: null, deliveredQuestionIds: []});

export const validateGame = (value: unknown): Game => {
  if (!value || typeof value !== 'object') throw new Error('Tệp không chứa lượt chơi hợp lệ.');
  const data = value as Record<string, unknown>;
  const phases = ['welcome', 'question', 'wrong', 'gift', 'finish'];
  if (!phases.includes(String(data.phase)) || !Number.isInteger(data.index) || Number(data.index) < 0 || Number(data.index) > questions.length) throw new Error('Trạng thái câu hỏi không hợp lệ.');
  const phase = data.phase as Game['phase'];
  const index = Number(data.index);
  if ((phase === 'finish') !== (index === questions.length) || (phase === 'welcome' && index !== 0)) throw new Error('Vị trí lượt chơi không hợp lệ.');
  if (!Array.isArray(data.giftOrder) || !Array.isArray(data.wins) || !Array.isArray(data.chosenLetters)) throw new Error('Danh sách câu hỏi hoặc quà không hợp lệ.');
  const giftOrder = data.giftOrder as number[];
  const giftIds = gifts.map(gift => gift.id);
  if (phase === 'welcome' ? giftOrder.length !== 0 : giftOrder.length !== giftIds.length || new Set(giftOrder).size !== giftIds.length || !giftIds.every(id => giftOrder.includes(id))) throw new Error('Thứ tự quà không hợp lệ.');
  const wins = data.wins as Win[];
  if (wins.length > index + (phase === 'gift' ? 1 : 0) || wins.length > gifts.length) throw new Error('Số quà đã mở không hợp lệ.');
  for (let i = 0; i < wins.length; i++) {
    const win = wins[i];
    if (!win || !Number.isInteger(win.questionId) || !questions.some(q => q.id === win.questionId) || win.questionId > index + (phase === 'gift' ? 1 : 0) || (i > 0 && win.questionId <= wins[i - 1].questionId) || win.giftId !== giftOrder[i] || typeof win.player !== 'string' || win.player.length > 80) throw new Error('Danh sách quà đã mở không hợp lệ.');
  }
  if (phase === 'gift' && wins.at(-1)?.questionId !== questions[index]?.id) throw new Error('Phần quà hiện tại không khớp câu hỏi.');
  if (phase === 'welcome' && wins.length) throw new Error('Lượt chơi chưa bắt đầu đã có quà.');
  const chosenLetters = data.chosenLetters as number[];
  const current = questions[index];
  if (chosenLetters.length && (current?.kind !== 'letters' || chosenLetters.length > (current.letters?.length ?? 0) || new Set(chosenLetters).size !== chosenLetters.length || chosenLetters.some(i => !Number.isInteger(i) || i < 0 || i >= (current.letters?.length ?? 0)))) throw new Error('Dữ liệu xếp chữ không hợp lệ.');
  const revealedLetterQuestionId = Number.isInteger(data.revealedLetterQuestionId) && data.revealedLetterQuestionId === current?.id ? Number(data.revealedLetterQuestionId) : null;
  const deliveredQuestionIds = Array.isArray(data.deliveredQuestionIds) ? data.deliveredQuestionIds as number[] : [];
  const wonIds = new Set(wins.map(win => win.questionId));
  if (new Set(deliveredQuestionIds).size !== deliveredQuestionIds.length || deliveredQuestionIds.some(id => !Number.isInteger(id) || !wonIds.has(id))) throw new Error('Danh sách quà đã trao không hợp lệ.');
  return {phase, index, giftOrder, wins, chosenLetters, revealedLetterQuestionId, deliveredQuestionIds};
};

export const restoreGame = (): Game => {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? validateGame(JSON.parse(saved)) : freshGame();
  } catch { return freshGame(); }
};

export const parseBackup = (text: string): Game => {
  let backup: unknown;
  try { backup = JSON.parse(text); } catch { throw new Error('Tệp JSON không đọc được.'); }
  if (!backup || typeof backup !== 'object' || (backup as Record<string, unknown>).format !== 'mo-qua-hy-backup' || (backup as Record<string, unknown>).version !== 1) throw new Error('Đây không phải bản sao lượt chơi Mở Quà Hỷ.');
  return validateGame((backup as Record<string, unknown>).game);
};

export const makeBackup = (game: Game) => JSON.stringify({format: 'mo-qua-hy-backup', version: 1, exportedAt: new Date().toISOString(), game}, null, 2);
