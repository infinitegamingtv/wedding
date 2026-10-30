import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CelebrationPlayer, WelcomePlayer} from './animations';
import {GiftIllustration, Petal} from './illustrations';
import {QuestionIllustration} from './question-art';
import {gifts, normalizeAnswer, questions} from './data';
import {playSfx, setSoundEnabled, startMusic} from './audio';
import './style.css';
import './pastel.css';

type Win = {questionId: number; player: string; giftId: number};
type Game = {phase: 'welcome' | 'question' | 'wrong' | 'gift' | 'finish'; index: number; giftOrder: number[]; wins: Win[]; chosenLetters: number[]};
const storageKey = 'mo-qua-hy-quang-truong-hong-nhung-v1';
const freshGame = (): Game => ({phase: 'welcome', index: 0, giftOrder: [], wins: [], chosenLetters: []});

const shuffleGifts = () => {
  const order = gifts.map(gift => gift.id);
  for (let i = order.length - 1; i > 0; i--) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const j = random[0] % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

const restoreGame = (): Game => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return freshGame();
    const value = JSON.parse(raw) as Game;
    if (!Array.isArray(value.wins) || !Array.isArray(value.giftOrder) || !Number.isInteger(value.index) || value.index < 0 || value.index > 10 || !['welcome', 'question', 'wrong', 'gift', 'finish'].includes(value.phase)) return freshGame();
    return {phase: value.phase, index: value.index, giftOrder: value.giftOrder, wins: value.wins, chosenLetters: Array.isArray(value.chosenLetters) ? value.chosenLetters : []};
  } catch { return freshGame(); }
};

function App() {
  const [game, setGame] = useState<Game>(restoreGame);
  const [revealReady, setRevealReady] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => {localStorage.setItem(storageKey, JSON.stringify(game));}, [game]);
  useEffect(() => {
    if (game.phase !== 'gift') return;
    setRevealReady(false);
    const timer = window.setTimeout(() => {setRevealReady(true); playSfx('reveal');}, 2900);
    return () => window.clearTimeout(timer);
  }, [game.phase, game.index]);

  const question = questions[game.index];
  const lastWin = game.wins.at(-1);
  const gift = lastWin ? gifts.find(item => item.id === lastWin.giftId) : undefined;
  const answerText = question?.kind === 'letters' ? game.chosenLetters.map(i => question.letters?.[i] || '').join('') : '';

  const start = () => {
    startMusic(); playSfx('click');
    setGame({phase: 'question', index: 0, giftOrder: shuffleGifts(), wins: [], chosenLetters: []});
  };
  const grade = (correct: boolean) => {
    playSfx(correct ? 'correct' : 'wrong');
    if (!correct) {setGame(prev => ({...prev, phase: 'wrong', chosenLetters: []})); return;}
    setGame(prev => ({...prev, phase: 'gift', wins: [...prev.wins, {questionId: questions[prev.index].id, player: `Khách mời ${String(prev.wins.length + 1).padStart(2, '0')}`, giftId: prev.giftOrder[prev.wins.length]}]}));
  };
  const nextQuestion = () => {
    playSfx('click');
    setGame(prev => prev.index >= questions.length - 1
      ? {...prev, phase: 'finish', index: questions.length, chosenLetters: []}
      : {...prev, phase: 'question', index: prev.index + 1, chosenLetters: []});
  };
  const retry = () => {playSfx('click'); setGame(prev => ({...prev, phase: 'question', chosenLetters: []}));};
  const reset = () => {setGame(freshGame()); setResetOpen(false);};

  return <div className="site-shell" onPointerDownCapture={() => {if (soundOn && game.phase !== 'welcome') startMusic();}}>
    <header className="topbar">
      <div className="brand-mark"><span className="brand-heart">♥</span><span>MỞ QUÀ HỶ</span></div>
      <div className="topbar-right"><span>QUANG TRƯỞNG <b>×</b> HỒNG NHUNG</span><button className="sound-button" aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-pressed={soundOn} onClick={() => {setSoundOn(!soundOn); setSoundEnabled(!soundOn);}}>♫ <small>{soundOn ? 'ÂM THANH BẬT' : 'ÂM THANH TẮT'}</small></button><button className="text-button fullscreen-button" onClick={() => {const stage = document.querySelector<HTMLElement>('.site-shell'); if (document.fullscreenElement) void document.exitFullscreen(); else void stage?.requestFullscreen().catch(() => {});}}>⛶ <small>TOÀN MÀN HÌNH</small></button>{game.phase !== 'welcome' && <button className="text-button" onClick={() => setResetOpen(true)}>CHƠI LẠI ↺</button>}</div>
    </header>

    {game.phase === 'welcome' && <main className="welcome layout-width">
      <div className="welcome-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> MINIGAME TIỆC CƯỚI</div>
        <h1>Hiểu hai đứa,<br/><em>mở quà hỷ!</em></h1>
        <p>10 câu hỏi · 10 món quà bí ẩn</p>
        <div className="welcome-actions"><button className="primary-button" onClick={start}>Bắt đầu chơi <span>↗</span></button></div>
      </div>
      <div className="welcome-art"><div className="art-orbit" /><WelcomePlayer/><div className="art-label">QUANG TRƯỞNG <span>♥</span> HỒNG NHUNG</div><Petal className="welcome-petal welcome-petal-one"/><Petal className="welcome-petal welcome-petal-two"/></div>
    </main>}

    {(game.phase === 'question' || game.phase === 'wrong') && question && <main className="game-main layout-width">
      <div className="progress-row"><span className="round-label">CÂU HỎI <b>{String(question.id).padStart(2, '0')}</b> / 10</span><div className="progress-track"><div style={{width: `${question.id * 10}%`}} /></div><span className="gift-counter">🎁 {10 - game.wins.length} quà đang chờ</span></div>
      <div className="question-grid">
        <section className="question-panel">
          <h2>{question.prompt}</h2>
          {question.id === 2 && <div className="fiction-note">Con số vui của trò chơi, không phải số đo thật của chú rể.</div>}
          {game.phase === 'question' && <div className="answers">
            {question.kind === 'choice' ? <div className="choice-list">{question.options?.map((option, index) => <button key={option} className="choice-button" onClick={() => grade(index === question.correct)}><span className="choice-letter">{'ABCD'[index]}</span><span>{option}</span><span className="choice-arrow">↗</span></button>)}</div> : <div className="letters-game">
              <div className="answer-slots" aria-label="Các chữ đã chọn">{game.chosenLetters.length ? game.chosenLetters.map((letterIndex, slotIndex) => <button key={`${letterIndex}-${slotIndex}`} onClick={() => setGame(prev => ({...prev, chosenLetters: prev.chosenLetters.filter((_, i) => i !== slotIndex)}))} aria-label={`Bỏ chữ ${question.letters?.[letterIndex]}`}>{question.letters?.[letterIndex]}</button>) : <span>Chạm các chữ bên dưới để ghép đáp án</span>}</div>
              <div className="letter-bank">{question.letters?.map((letter, index) => <button key={index} disabled={game.chosenLetters.includes(index)} onClick={() => {playSfx('tile'); setGame(prev => ({...prev, chosenLetters: [...prev.chosenLetters, index]}));}}>{letter}</button>)}</div>
              <div className="letter-actions"><button className="light-button" onClick={() => setGame(prev => ({...prev, chosenLetters: []}))} disabled={!game.chosenLetters.length}>Xóa chữ</button><button className="primary-button" disabled={game.chosenLetters.length !== question.letters?.length} onClick={() => grade(normalizeAnswer(answerText) === normalizeAnswer(question.answer || ''))}>Chốt đáp án <span>↗</span></button></div>
            </div>}
          </div>}
          {game.phase === 'wrong' && <div className="wrong-card"><span className="wrong-emoji">🙈</span><h3>Suýt nữa rồi!</h3><p>Câu này vẫn đang chờ người trả lời đúng. Mời một vị khách khác thử sức nhé.</p><button className="primary-button" onClick={retry}>Thử lại câu này <span>↗</span></button></div>}
        </section>
        <aside className="side-panel"><QuestionIllustration number={question.id}/></aside>
      </div>
    </main>}

    {game.phase === 'gift' && gift && lastWin && <main className="gift-main layout-width"><div className="gift-layout"><div className="gift-animation"><CelebrationPlayer gift={gift} winner={lastWin.player}/></div><div className="gift-copy"><div className="section-kicker">CÂU {lastWin.questionId} / 10 · {lastWin.player.toLocaleUpperCase('vi-VN')}</div><h2>Quà của bạn</h2>{revealReady ? <div className="gift-ticket"><span>PHIẾU QUÀ #{String(gift.id).padStart(2, '0')}</span><strong>{gift.title}</strong></div> : <div className="gift-ticket pending"><strong>Đang mở...</strong></div>}<button className="primary-button" disabled={!revealReady} onClick={nextQuestion}>{game.index === 9 ? 'Xem tổng kết' : 'Câu tiếp theo'} <span>↗</span></button></div></div></main>}

    {game.phase === 'finish' && <main className="finish-main layout-width"><div className="finish-head"><h1>Cảm ơn đã <em>chơi cùng!</em></h1></div><div className="winner-list">{game.wins.map(win => {const item = gifts.find(g => g.id === win.giftId); return <div className="winner-row" key={win.questionId}><span className="winner-number">{String(win.questionId).padStart(2, '0')}</span><strong>{win.player}</strong><span>{item?.title}</span></div>;})}</div><button className="light-button finish-restart" onClick={() => setResetOpen(true)}>Chơi một lượt mới ↗</button><div className="finish-illustration"><GiftIllustration open/></div></main>}

    {resetOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setResetOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={event => event.stopPropagation()}><span className="modal-icon">🎁</span><h2 id="reset-title">Chơi lại từ đầu?</h2><p>Danh sách khách đã thắng và thứ tự quà hiện tại sẽ được xóa trên thiết bị này.</p><div><button className="light-button" onClick={() => setResetOpen(false)}>Giữ lượt chơi</button><button className="primary-button" onClick={reset}>Bắt đầu lại</button></div></div></div>}
    <footer className="footer"><span>♥</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
