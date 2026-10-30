import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CelebrationPlayer, WelcomePlayer} from './animations';
import {gifts, normalizeAnswer, questions} from './data';
import {playSfx, setSoundEnabled, startMusic} from './audio';
import './style.css';

type Win = {questionId: number; player: string; giftId: number};
type Game = {phase: 'welcome' | 'question' | 'wrong' | 'gift' | 'finish'; index: number; giftOrder: number[]; wins: Win[]; activeName: string; chosenLetters: number[]};
const storageKey = 'mo-qua-hy-quang-truong-hong-nhung-v1';
const freshGame = (): Game => ({phase: 'welcome', index: 0, giftOrder: [], wins: [], activeName: '', chosenLetters: []});

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
    return {...value, chosenLetters: Array.isArray(value.chosenLetters) ? value.chosenLetters : []};
  } catch { return freshGame(); }
};

function App() {
  const [game, setGame] = useState<Game>(restoreGame);
  const [nameDraft, setNameDraft] = useState('');
  const [revealReady, setRevealReady] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => {localStorage.setItem(storageKey, JSON.stringify(game));}, [game]);
  useEffect(() => {
    if (game.phase !== 'gift') return;
    setRevealReady(false);
    const timer = window.setTimeout(() => {setRevealReady(true); playSfx('reveal');}, 2400);
    return () => window.clearTimeout(timer);
  }, [game.phase, game.index]);

  const question = questions[game.index];
  const lastWin = game.wins.at(-1);
  const gift = lastWin ? gifts.find(item => item.id === lastWin.giftId) : undefined;
  const answerText = question?.kind === 'letters' ? game.chosenLetters.map(i => question.letters?.[i] || '').join('') : '';
  const canPlay = Boolean(game.activeName.trim());

  const start = () => {
    startMusic(); playSfx('click');
    setGame({phase: 'question', index: 0, giftOrder: shuffleGifts(), wins: [], activeName: '', chosenLetters: []});
    setNameDraft('');
  };
  const enterName = (event: React.FormEvent) => {
    event.preventDefault();
    const name = nameDraft.trim().slice(0, 32);
    if (!name) return;
    playSfx('click');
    setGame(prev => ({...prev, activeName: name, chosenLetters: []}));
    setNameDraft('');
  };
  const grade = (correct: boolean) => {
    if (!canPlay) return;
    playSfx(correct ? 'correct' : 'wrong');
    if (!correct) {setGame(prev => ({...prev, phase: 'wrong', chosenLetters: []})); return;}
    setGame(prev => ({...prev, phase: 'gift', wins: [...prev.wins, {questionId: questions[prev.index].id, player: prev.activeName, giftId: prev.giftOrder[prev.wins.length]}]}));
  };
  const nextQuestion = () => {
    playSfx('click');
    setGame(prev => prev.index >= questions.length - 1
      ? {...prev, phase: 'finish', index: questions.length, activeName: '', chosenLetters: []}
      : {...prev, phase: 'question', index: prev.index + 1, activeName: '', chosenLetters: []});
  };
  const retry = () => {playSfx('click'); setGame(prev => ({...prev, phase: 'question', activeName: '', chosenLetters: []}));};
  const reset = () => {setGame(freshGame()); setResetOpen(false); setNameDraft('');};

  return <div className="site-shell">
    <header className="topbar">
      <div className="brand-mark"><span className="brand-heart">♥</span><span>MỞ QUÀ HỶ</span></div>
      <div className="topbar-right"><span>QUANG TRƯỞNG <b>×</b> HỒNG NHUNG</span><button className="sound-button" aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-pressed={soundOn} onClick={() => {setSoundOn(!soundOn); setSoundEnabled(!soundOn);}}>♫ <small>{soundOn ? 'ÂM THANH BẬT' : 'ÂM THANH TẮT'}</small></button>{game.phase !== 'welcome' && <button className="text-button" onClick={() => setResetOpen(true)}>CHƠI LẠI ↺</button>}</div>
    </header>

    {game.phase === 'welcome' && <main className="welcome layout-width">
      <div className="welcome-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> MỘT CHÚT THỬ THÁCH, RẤT NHIỀU TIẾNG CƯỜI</div>
        <h1>Hiểu chúng mình,<br/><em>rinh quà bí ẩn!</em></h1>
        <p>10 câu chuyện về Quang Trưởng và Hồng Nhung. Trả lời đúng để bốc một món quà ngẫu nhiên. Tên quà nghe thật oách, món quà thì… chờ mở nhé!</p>
        <div className="welcome-actions"><button className="primary-button" onClick={start}>Bắt đầu chơi <span>↗</span></button><span className="small-note">Dành cho khách chơi cá nhân · MC điều khiển trên một màn hình</span></div>
        <div className="game-facts"><div><strong>10</strong><span>câu hỏi</span></div><div><strong>10</strong><span>món quà</span></div><div><strong>∞</strong><span>tiếng cười</span></div></div>
      </div>
      <div className="welcome-art"><div className="art-orbit" /><WelcomePlayer/><div className="art-label">QUANG TRƯỞNG <span>♥</span> HỒNG NHUNG</div><img className="art-sticker art-sticker-one" src="/assets/image5.png" alt="Hashtag Team Cô Dâu Xinh Gái" /><img className="art-sticker art-sticker-two" src="/assets/image6.png" alt="Hashtag Team Chú Rể Đẹp Trai" /><img className="chest-sprite" src="/assets/gift-chest-closed.png" alt="Rương quà cưới bí ẩn" /></div>
    </main>}

    {(game.phase === 'question' || game.phase === 'wrong') && question && <main className="game-main layout-width">
      <div className="progress-row"><span className="round-label">CÂU HỎI <b>{String(question.id).padStart(2, '0')}</b> / 10</span><div className="progress-track"><div style={{width: `${question.id * 10}%`}} /></div><span className="gift-counter">🎁 {10 - game.wins.length} quà đang chờ</span></div>
      <div className="question-grid">
        <section className="question-panel">
          <div className="section-kicker">{question.kind === 'choice' ? 'CHỌN MỘT ĐÁP ÁN' : 'XẾP CHỮ THÀNH TỪ'}</div>
          <h2>{question.prompt}</h2>
          {question.id === 2 && <div className="fiction-note">Con số vui của trò chơi, không phải số đo thật của chú rể.</div>}
          {!canPlay && game.phase === 'question' && <form className="player-entry" onSubmit={enterName}><label htmlFor="player-name">Ai sẽ trả lời câu này?</label><div className="player-entry-row"><input id="player-name" autoComplete="off" maxLength={32} placeholder="Nhập tên khách chơi" value={nameDraft} onChange={event => setNameDraft(event.target.value)} autoFocus /><button className="primary-button" disabled={!nameDraft.trim()}>Vào lượt <span>↗</span></button></div></form>}
          {canPlay && game.phase === 'question' && <div className="active-player">Lượt của <strong>{game.activeName}</strong><button onClick={() => setGame(prev => ({...prev, activeName: '', chosenLetters: []}))}>Đổi người</button></div>}
          {game.phase === 'question' && <div className={canPlay ? 'answers' : 'answers answers-disabled'}>
            {question.kind === 'choice' ? <div className="choice-list">{question.options?.map((option, index) => <button key={option} className="choice-button" disabled={!canPlay} onClick={() => grade(index === question.correct)}><span className="choice-letter">{'ABCD'[index]}</span><span>{option}</span><span className="choice-arrow">↗</span></button>)}</div> : <div className="letters-game">
              <div className="answer-slots" aria-label="Các chữ đã chọn">{game.chosenLetters.length ? game.chosenLetters.map((letterIndex, slotIndex) => <button key={`${letterIndex}-${slotIndex}`} onClick={() => setGame(prev => ({...prev, chosenLetters: prev.chosenLetters.filter((_, i) => i !== slotIndex)}))} aria-label={`Bỏ chữ ${question.letters?.[letterIndex]}`}>{question.letters?.[letterIndex]}</button>) : <span>Chạm các chữ bên dưới để ghép đáp án</span>}</div>
              <div className="letter-bank">{question.letters?.map((letter, index) => <button key={index} disabled={!canPlay || game.chosenLetters.includes(index)} onClick={() => {playSfx('tile'); setGame(prev => ({...prev, chosenLetters: [...prev.chosenLetters, index]}));}}>{letter}</button>)}</div>
              <div className="letter-actions"><button className="light-button" onClick={() => setGame(prev => ({...prev, chosenLetters: []}))} disabled={!game.chosenLetters.length}>Xóa chữ</button><button className="primary-button" disabled={!canPlay || game.chosenLetters.length !== question.letters?.length} onClick={() => grade(normalizeAnswer(answerText) === normalizeAnswer(question.answer || ''))}>Chốt đáp án <span>↗</span></button></div>
            </div>}
          </div>}
          {game.phase === 'wrong' && <div className="wrong-card"><span className="wrong-emoji">🙈</span><h3>Suýt nữa rồi!</h3><p>{game.activeName} chưa mở được quà ở câu này. Mời một vị khách khác thử sức nhé.</p><button className="primary-button" onClick={retry}>Mời người tiếp theo <span>↗</span></button></div>}
        </section>
        <aside className="side-panel"><div className="side-heading"><span>CHUYỆN CỦA HAI ĐỨA</span><span>✦</span></div><img className="question-sticker" src={`/assets/${question.sticker}`} alt="Minh họa chibi từ bộ hashtag cưới"/><img className="side-chest" src="/assets/gift-chest-closed.png" alt=""/><div className="side-footer">Trả lời đúng, quà bí ẩn sẽ tự chọn bạn! <span>♥</span></div></aside>
      </div>
    </main>}

    {game.phase === 'gift' && gift && lastWin && <main className="gift-main layout-width"><div className="gift-topline">CÂU {lastWin.questionId} / 10 <span>✦</span> MỞ QUÀ BÍ ẨN</div><div className="gift-layout"><div className="gift-animation"><CelebrationPlayer gift={gift} winner={lastWin.player}/></div><div className="gift-copy"><div className="section-kicker">CHÚC MỪNG {lastWin.player.toLocaleUpperCase('vi-VN')}</div><h2>Đúng rồi!<br/><em>Quà đến tay.</em></h2><p>Một câu trả lời chuẩn xác, một món quà được bốc hoàn toàn ngẫu nhiên.</p>{revealReady ? <div className="gift-ticket"><span>PHIẾU NHẬN QUÀ #{String(gift.id).padStart(2, '0')}</span><strong>{gift.title}</strong><small>Quà thật: {gift.item}</small></div> : <div className="gift-ticket pending"><span>ĐANG MỞ QUÀ...</span><strong>Hồi hộp một chút nhé!</strong></div>}<button className="primary-button" disabled={!revealReady} onClick={nextQuestion}>{game.index === 9 ? 'Xem tổng kết' : 'Câu hỏi tiếp theo'} <span>↗</span></button></div></div></main>}

    {game.phase === 'finish' && <main className="finish-main layout-width"><div className="finish-head"><div className="section-kicker">KHÉP LẠI MỘT TRÒ CHƠI, MỞ RA THẬT NHIỀU NIỀM VUI</div><h1>Cảm ơn vì đã<br/><em>chơi cùng chúng mình!</em></h1><p>10 món quà đã tìm được chủ nhân. Chúc mọi người một buổi tiệc thật vui cùng Quang Trưởng và Hồng Nhung.</p></div><div className="winner-list">{game.wins.map(win => {const item = gifts.find(g => g.id === win.giftId); return <div className="winner-row" key={win.questionId}><span className="winner-number">{String(win.questionId).padStart(2, '0')}</span><strong>{win.player}</strong><span>{item?.title}</span><b>{item?.item}</b></div>;})}</div><button className="light-button finish-restart" onClick={() => setResetOpen(true)}>Chơi một lượt mới ↗</button><img className="finish-sticker" src="/assets/image14.png" alt="Thêm vợ vào cuộc chơi" /></main>}

    {resetOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setResetOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={event => event.stopPropagation()}><span className="modal-icon">🎁</span><h2 id="reset-title">Chơi lại từ đầu?</h2><p>Danh sách khách đã thắng và thứ tự quà hiện tại sẽ được xóa trên thiết bị này.</p><div><button className="light-button" onClick={() => setResetOpen(false)}>Giữ lượt chơi</button><button className="primary-button" onClick={reset}>Bắt đầu lại</button></div></div></div>}
    <footer className="footer"><span>MADE WITH ♥ FOR QUANG TRƯỞNG & HỒNG NHUNG</span><span>Quà thật do MC trao tại tiệc</span></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
