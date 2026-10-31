import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GiftIllustration, Petal} from './illustrations';
import {QuestionIllustration} from './question-art';
import {StageDecor} from './stage-decor';
import {SpecialPrizeMusic} from './special-prize-music';
import {assetUrl} from './asset-url';
import {gifts, normalizeAnswer, orderedLetterIndices, questions} from './data';
import {playSfx, setSoundEnabled, startMusic} from './audio';
import {freshGame, makeBackup, parseBackup, restoreGame, storageKey} from './game-state';
import type {Game} from './game-state';
import './hallmark.css';

const loadCelebration = () => import('./animations');
const CelebrationPlayer = React.lazy(() => loadCelebration().then(module => ({default: module.CelebrationPlayer})));

const Heart = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 21s-8.4-5.5-9.7-10.5C1.4 7.1 3.2 4 6.5 4c2.1 0 3.7 1.1 5.5 3.1C13.8 5.1 15.4 4 17.5 4c3.3 0 5.1 3.1 4.2 6.5C20.4 15.5 12 21 12 21Z"/></svg>;
const keepPhrases = (value: string) => value.replace(/chú rể|cô dâu|đám cưới|dự án ma|số đo ba vòng|bài tập về nhà|âm cuối|chính tả|việc nhà|tình huống quen thuộc|mỗi tháng một lần|không tiện công khai/giu, phrase => phrase.replaceAll(' ', '\u00a0'));

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

function App() {
  const [game, setGame] = useState<Game>(restoreGame);
  const [revealReady, setRevealReady] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);
  const [giftPaused, setGiftPaused] = useState(false);
  const [giftReplayVersion, setGiftReplayVersion] = useState(0);
  const [skipArmed, setSkipArmed] = useState(false);
  const [importError, setImportError] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [autoFilledLetters, setAutoFilledLetters] = useState(false);
  const [autoFillVersion, setAutoFillVersion] = useState(0);
  const resetDialogRef = useRef<HTMLDivElement>(null);
  const resetOpenerRef = useRef<HTMLElement | null>(null);
  const importRef = useRef<HTMLInputElement>(null);
  useEffect(() => {try {localStorage.setItem(storageKey, JSON.stringify(game));} catch {/* Manual backup remains available. */}}, [game]);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL).then(registration => registration?.unregister()).catch(() => {});
    }
    if ('caches' in window) {
      void caches.keys().then(names => Promise.all(names.filter(name => name.startsWith('mo-qua-hy-')).map(name => caches.delete(name)))).catch(() => {});
    }
  }, []);
  useEffect(() => {
    if (game.phase !== 'question' && game.phase !== 'wrong') return;
    const preload = window.setTimeout(() => {void loadCelebration().catch(() => {});}, 500);
    return () => window.clearTimeout(preload);
  }, [game.phase]);
  useEffect(() => {
    if (!resetOpen) {
      if (!resetOpenerRef.current) return;
      const target = resetOpenerRef.current?.isConnected ? resetOpenerRef.current : document.querySelector<HTMLElement>('.host-button, .welcome .primary-button');
      target?.focus();
      resetOpenerRef.current = null;
      return;
    }
    const dialog = resetDialogRef.current;
    dialog?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {event.preventDefault(); setResetOpen(false); return;}
      if (event.key !== 'Tab' || !dialog) return;
      const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      if (!buttons.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (!dialog.contains(document.activeElement)) {event.preventDefault(); first.focus(); return;}
      if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [resetOpen]);
  useEffect(() => {
    if (!hostOpen) return;
    const dialog = document.querySelector<HTMLElement>('.host-modal');
    dialog?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {setHostOpen(false); return;}
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)')).filter(el => el.offsetParent !== null);
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hostOpen]);
  const openReset = () => {resetOpenerRef.current = document.activeElement as HTMLElement; setResetOpen(true);};
  const replayGift = () => {setRevealReady(false); setGiftPaused(false);};

  const question = questions[game.index];
  const letterArtRevealed = question?.kind === 'letters' && game.revealedLetterQuestionId === question.id;
  const lastWin = game.wins.at(-1);
  const gift = lastWin ? gifts.find(item => item.id === lastWin.giftId) : undefined;
  const giftDelivered = lastWin ? game.deliveredQuestionIds.includes(lastWin.questionId) : false;
  const answerText = question?.kind === 'letters' ? game.chosenLetters.map(i => question.letters?.[i] || '').join('') : '';

  const start = () => {
    setAutoFilledLetters(false);
    setGiftReplayVersion(0);
    startMusic(); playSfx('stage');
    setGame({phase: 'question', index: 0, giftOrder: shuffleGifts(), wins: [], chosenLetters: [], revealedLetterQuestionId: null, deliveredQuestionIds: []});
  };
  const grade = (correct: boolean) => {
    playSfx(correct ? 'correct' : 'wrong');
    if (!correct) {setGame(prev => ({...prev, phase: 'wrong', chosenLetters: []})); return;}
    setRevealReady(false);
    setGame(prev => ({...prev, phase: 'gift', wins: [...prev.wins, {questionId: questions[prev.index].id, player: `Khách mời ${String(prev.wins.length + 1).padStart(2, '0')}`, giftId: prev.giftOrder[prev.wins.length]}]}));
  };
  const nextQuestion = () => {
    setRevealReady(false);
    setGiftPaused(false);
    setGiftReplayVersion(0);
    setAutoFilledLetters(false);
    playSfx('click');
    setGame(prev => prev.index >= questions.length - 1
      ? {...prev, phase: 'finish', index: questions.length, chosenLetters: [], revealedLetterQuestionId: null}
      : {...prev, phase: 'question', index: prev.index + 1, chosenLetters: [], revealedLetterQuestionId: null});
  };
  const retry = () => {playSfx('click'); setAutoFilledLetters(false); setGame(prev => ({...prev, phase: 'question', chosenLetters: [], revealedLetterQuestionId: null}));};
  const reset = () => {setAutoFilledLetters(false); setGame(freshGame()); setResetOpen(false); setHostOpen(false); setGiftPaused(false); setGiftReplayVersion(0);};
  const markDelivered = (questionId: number) => setGame(prev => ({...prev, deliveredQuestionIds: prev.deliveredQuestionIds.includes(questionId) ? prev.deliveredQuestionIds : [...prev.deliveredQuestionIds, questionId]}));
  const skipQuestion = () => {
    if (!skipArmed) {setSkipArmed(true); return;}
    setSkipArmed(false);
    setHostOpen(false);
    setAutoFilledLetters(false);
    setGame(prev => prev.index >= questions.length - 1
      ? {...prev, phase: 'finish', index: questions.length, chosenLetters: [], revealedLetterQuestionId: null}
      : {...prev, phase: 'question', index: prev.index + 1, chosenLetters: [], revealedLetterQuestionId: null});
  };
  const downloadFile = (name: string, type: string, content: string) => {
    const url = URL.createObjectURL(new Blob([content], {type}));
    const link = document.createElement('a');
    link.href = url; link.download = name; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const exportBackup = () => downloadFile('mo-qua-hy-luot-choi.json', 'application/json', makeBackup(game));
  const exportSummary = () => {
    const rows = [
      ['Câu', 'Khách mời', 'Giải thưởng', 'Trạng thái'],
      ...game.wins.map(win => [String(win.questionId), win.player, gifts.find(g => g.id === win.giftId)?.title ?? '', game.deliveredQuestionIds.includes(win.questionId) ? 'Đã trao' : 'Chưa trao']),
      ...gifts.filter(gift => !game.wins.some(win => win.giftId === gift.id)).map(gift => ['', '', gift.title, 'Chưa mở']),
    ];
    const csv = '\uFEFF' + rows.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    downloadFile('mo-qua-hy-danh-sach-qua.csv', 'text/csv;charset=utf-8', csv);
  };
  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 100_000) throw new Error('Tệp quá lớn cho một lượt chơi.');
      const restored = parseBackup(await file.text());
      setGame(restored); setRevealReady(false); setGiftPaused(false); setGiftReplayVersion(0); setHostOpen(false); setImportError('');
    } catch (error) {setImportError(error instanceof Error ? error.message : 'Không đọc được bản sao lượt chơi.');}
    if (importRef.current) importRef.current.value = '';
  };
  const revealLetterAnswer = () => {
    if (question?.kind !== 'letters' || !question.letters || !question.answer) return;
    const order = orderedLetterIndices(question.letters, question.answer);
    if (order.length !== question.letters.length) return;
    playSfx('tile');
    setAutoFilledLetters(true);
    setAutoFillVersion(version => version + 1);
    setGame(prev => ({...prev, chosenLetters: order, revealedLetterQuestionId: question.id}));
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.querySelector<HTMLElement>('.site-shell')?.requestFullscreen().catch(() => {});
  };
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || hostOpen || resetOpen) return;
      if ((event.target as HTMLElement)?.closest('input, textarea, select, video, [role="slider"], [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      if (key === 'h') {event.preventDefault(); setImportError(''); setSkipArmed(false); setHostOpen(true); return;}
      if (key === 'm') {event.preventDefault(); setSoundOn(value => {setSoundEnabled(!value); return !value;}); return;}
      if (key === 'f') {event.preventDefault(); toggleFullscreen(); return;}
      if (event.key === ' ' && game.phase === 'gift' && !revealReady) {event.preventDefault(); setGiftPaused(value => !value); return;}
      if (event.key === 'ArrowRight' && game.phase === 'gift' && revealReady) {event.preventDefault(); nextQuestion();}
    };
    document.addEventListener('keydown', onShortcut);
    return () => document.removeEventListener('keydown', onShortcut);
  }, [game.phase, revealReady, hostOpen, resetOpen]);

  return <div className="site-shell" onPointerDownCapture={() => {if (soundOn && game.phase !== 'welcome') startMusic();}}>
    <StageDecor active={game.phase !== 'welcome'} celebrate={game.phase === 'gift'} award={game.phase === 'gift' && revealReady}/>
    <header className="topbar">
      <div className="brand-mark"><span className="brand-heart"><Heart/></span><span>Mở quà hỷ</span></div>
      <div className="topbar-right"><span>Quang Trưởng <b>×</b> Hồng Nhung</span><button className="sound-button" aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'} aria-pressed={soundOn} onClick={() => {setSoundOn(!soundOn); setSoundEnabled(!soundOn);}}>♫ <small>{soundOn ? 'Âm thanh bật' : 'Âm thanh tắt'}</small></button><button className="text-button fullscreen-button" aria-label="Bật hoặc tắt chế độ toàn màn hình" onClick={toggleFullscreen}>⛶ <small>Toàn màn hình</small></button><button className="text-button host-button" onClick={() => {setImportError(''); setSkipArmed(false); setHostOpen(true);}}>MC ⚙</button>{game.phase !== 'welcome' && <button className="text-button reset-button" onClick={openReset}>Chơi lại ↺</button>}</div>
    </header>

    {game.phase === 'welcome' && <main className="welcome layout-width">
      <div className="welcome-copy">
        <h1>Hiểu Nhung và Trưởng,<br/><em>chắc chắn được thưởng</em></h1>
        <p className="eyebrow">Trò chơi tiệc cưới</p>
        <p>10 câu hỏi, 10 món quà bí ẩn</p>
        <div className="welcome-actions"><button className="primary-button" onClick={start}>Bắt đầu chơi <span>↗</span></button></div>
      </div>
      <div className="welcome-art"><div className="art-orbit" /><div className="welcome-couple"><img src={assetUrl('assets/couple-square-groom-left.webp')} alt="Ảnh chibi của Quang Trưởng bên trái và Hồng Nhung bên phải" decoding="async"/><span aria-hidden="true">♡</span></div><div className="art-label">Quang Trưởng <span><Heart/></span> Hồng Nhung</div><Petal className="welcome-petal welcome-petal-one"/><Petal className="welcome-petal welcome-petal-two"/></div>
    </main>}

    {(game.phase === 'question' || game.phase === 'wrong') && question && <main className="game-main layout-width">
      <div className="progress-row"><span className="round-label">Câu hỏi <b>{String(question.id).padStart(2, '0')}</b> / 10</span><div className="progress-track"><div style={{transform: `scaleX(${question.id / 10})`}} /></div><span className="gift-counter">{question.kind === 'letters' ? 'Xếp chữ' : 'Trắc nghiệm'}</span></div>
      <div className={`question-grid ${question.kind === 'choice' ? 'choice-round' : ''} ${question.kind === 'letters' && !letterArtRevealed ? 'letters-focus' : ''} ${question.kind === 'letters' && (question.letters?.length ?? 0) > 10 ? 'letters-long' : ''}`}>
        <section className="question-panel">
          <h2>{keepPhrases(question.prompt)}</h2>
          {question.id === 2 && <div className="fiction-note">Con số vui của trò chơi, không phải số đo thật của chú rể.</div>}
          {game.phase === 'question' && <div className="answers">
            {question.kind === 'choice' ? <div className="choice-list">{question.options?.map((option, index) => <button key={option} className="choice-button" onClick={() => grade(index === question.correct)}><span className="choice-letter">{'ABCD'[index]}</span><span>{keepPhrases(option)}</span><span className="choice-arrow">↗</span></button>)}</div> : <div className="letters-game">
              <div className="answer-slots" aria-label={autoFilledLetters ? `Đáp án ${question.answer}` : 'Các chữ đã chọn'}>{game.chosenLetters.length ? game.chosenLetters.map((letterIndex, slotIndex) => <button key={`${autoFilledLetters ? autoFillVersion : 'manual'}-${letterIndex}-${slotIndex}`} className={autoFilledLetters ? 'answer-tile-auto' : undefined} style={autoFilledLetters ? {'--slot-order': slotIndex} as React.CSSProperties : undefined} onClick={() => {setAutoFilledLetters(false); setGame(prev => ({...prev, chosenLetters: prev.chosenLetters.filter((_, i) => i !== slotIndex)}));}} aria-label={`Bỏ chữ ${question.letters?.[letterIndex]}`}>{question.letters?.[letterIndex]}</button>) : <span>Chạm các chữ bên dưới để ghép đáp án</span>}</div>
              <div className="letter-bank">{question.letters?.map((letter, index) => <button key={index} disabled={game.chosenLetters.includes(index)} onClick={() => {playSfx('tile'); setAutoFilledLetters(false); setGame(prev => ({...prev, chosenLetters: [...prev.chosenLetters, index]}));}}>{letter}</button>)}</div>
              <div className="letter-actions"><button className="light-button" onClick={() => {setAutoFilledLetters(false); setGame(prev => ({...prev, chosenLetters: []}));}} disabled={!game.chosenLetters.length}>Xóa chữ</button><button className="answer-reveal-button" onClick={revealLetterAnswer}>Hiện đáp án <span>↗</span></button><button className="primary-button" disabled={game.chosenLetters.length !== question.letters?.length} onClick={() => grade(normalizeAnswer(answerText) === normalizeAnswer(question.answer || ''))}>Chốt đáp án <span>↗</span></button></div>
            </div>}
          </div>}
          {game.phase === 'wrong' && <div className="wrong-card"><h3>Suýt nữa rồi!</h3><p>Câu này vẫn đang chờ người trả lời đúng. Mời một vị khách khác thử sức nhé.</p><button className="primary-button" onClick={retry}>Thử lại câu này <span>↗</span></button></div>}
        </section>
        {(question.kind === 'choice' || letterArtRevealed) && <aside className={`side-panel ${question.kind === 'letters' ? 'letter-art-enter' : ''}`}><QuestionIllustration number={question.id}/></aside>}
      </div>
    </main>}

    {game.phase === 'gift' && gift && lastWin && <main className="gift-main layout-width"><div className="gift-layout"><div className="gift-animation"><React.Suspense fallback={<div className="gift-loading" role="status" aria-label="Đang chuẩn bị vòng quay"><GiftIllustration/></div>}><CelebrationPlayer gift={gift} winner={lastWin.player} paused={giftPaused} replayVersion={giftReplayVersion} onReplay={replayGift} onRevealReady={() => setRevealReady(true)}/></React.Suspense></div><div className="gift-copy"><div className="section-kicker gift-meta"><span>{lastWin.player}</span>{revealReady && <span className="gift-number">Quà {String(gift.id).padStart(2, '0')}</span>}</div><ol className="gift-steps" aria-label="Tiến trình mở quà"><li className={!revealReady ? 'is-current' : 'is-complete'}><b>1</b> Quay</li><li className={revealReady && !giftDelivered ? 'is-current' : revealReady ? 'is-complete' : ''}><b>2</b> Trúng</li><li className={giftDelivered ? 'is-current' : ''}><b>3</b> Đã trao</li></ol><h2 aria-live="polite">{revealReady ? gift.title : giftPaused ? 'Vòng quay tạm dừng' : 'Đang quay...'}</h2>{revealReady && gift.id === 8 && (soundOn ? <SpecialPrizeMusic/> : <div className="special-prize-muted">Bật âm thanh để nghe đoạn nhạc của giải này.</div>)}{revealReady && <button className={`delivery-button ${game.deliveredQuestionIds.includes(lastWin.questionId) ? 'delivered' : ''}`} disabled={game.deliveredQuestionIds.includes(lastWin.questionId)} onClick={() => markDelivered(lastWin.questionId)}>{game.deliveredQuestionIds.includes(lastWin.questionId) ? '✓ Đã trao quà' : '✓ Đánh dấu đã trao quà'}</button>}<button className="primary-button" disabled={!revealReady} onClick={nextQuestion}>{game.index === 9 ? 'Xem tổng kết' : 'Câu tiếp theo'} <span>↗</span></button></div></div></main>}

    {game.phase === 'finish' && <main className="finish-main layout-width"><div className="finish-head"><h1>Cảm ơn đã <em>chơi cùng!</em></h1><p>{game.deliveredQuestionIds.length} đã trao · {game.wins.length - game.deliveredQuestionIds.length} chờ trao · {gifts.length - game.wins.length} chưa mở</p></div><div className="winner-list">{game.wins.map(win => {const item = gifts.find(g => g.id === win.giftId); const delivered = game.deliveredQuestionIds.includes(win.questionId); return <div className="winner-row" key={win.questionId}><span className="winner-number">{String(win.questionId).padStart(2, '0')}</span><strong>{win.player}</strong><span>{item?.title}</span><button className={`summary-status ${delivered ? 'is-delivered' : ''}`} disabled={delivered} onClick={() => markDelivered(win.questionId)}>{delivered ? '✓ Đã trao' : 'Chưa trao ↗'}</button></div>;})}{gifts.filter(gift => !game.wins.some(win => win.giftId === gift.id)).map(gift => <div className="winner-row remaining-row" key={`remaining-${gift.id}`}><span className="winner-number">—</span><strong>Chưa mở</strong><span>{gift.title}</span><span className="summary-status">Còn lại</span></div>)}</div><div className="finish-actions"><button className="light-button" onClick={exportSummary}>Xuất danh sách CSV ↓</button><button className="light-button finish-restart" onClick={openReset}>Chơi một lượt mới ↗</button></div><div className="finish-illustration"><GiftIllustration open/></div></main>}

    {hostOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setHostOpen(false)}><div className="modal host-modal" role="dialog" aria-modal="true" aria-labelledby="host-title" tabIndex={-1} onMouseDown={event => event.stopPropagation()}><div className="host-head"><h2 id="host-title">Điều khiển MC</h2><button className="host-close" onClick={() => setHostOpen(false)} aria-label="Đóng điều khiển MC">×</button></div><p>Câu {Math.min(game.index + 1, questions.length)}/10 · {game.wins.length} quà đã mở · {game.deliveredQuestionIds.length} đã trao</p>{game.phase === 'gift' && <div className="host-actions"><button className="light-button" onClick={() => setGiftPaused(value => !value)}>{giftPaused ? '▶ Tiếp tục quay' : 'Ⅱ Tạm dừng quay'}</button><button className="light-button" onClick={() => {setGiftPaused(false); setGiftReplayVersion(v => v + 1); setRevealReady(false); setHostOpen(false);}}>↻ Quay lại</button>{revealReady && lastWin && !game.deliveredQuestionIds.includes(lastWin.questionId) && <button className="light-button" onClick={() => markDelivered(lastWin.questionId)}>✓ Đã trao quà</button>}</div>}{(game.phase === 'question' || game.phase === 'wrong') && <div className="host-actions"><button className="light-button" onClick={skipQuestion}>{skipArmed ? 'Xác nhận bỏ qua câu này' : 'Bỏ qua câu này ↗'}</button>{skipArmed && <button className="light-button" onClick={() => setSkipArmed(false)}>Giữ câu hỏi</button>}</div>}<div className="host-divider"/><div className="host-actions"><button className="light-button" onClick={exportBackup}>Lưu lượt chơi ↓</button><button className="light-button" onClick={() => importRef.current?.click()}>Khôi phục lượt chơi ↑</button><input ref={importRef} className="host-file-input" type="file" accept="application/json,.json" onChange={event => {void importBackup(event.target.files?.[0]);}}/><button className="light-button" onClick={exportSummary}>Xuất danh sách CSV ↓</button>{game.phase !== 'welcome' && <button className="light-button" onClick={() => {setHostOpen(false); openReset();}}>Chơi lại từ đầu ↺</button>}</div>{importError && <p className="host-error" role="alert">{importError}</p>}</div></div>}

    {resetOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setResetOpen(false)}><div ref={resetDialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description" tabIndex={-1} onMouseDown={event => event.stopPropagation()}><h2 id="reset-title">Chơi lại từ đầu?</h2><p id="reset-description">Danh sách khách đã thắng và thứ tự quà hiện tại sẽ được xóa trên thiết bị này.</p><div><button className="light-button" onClick={() => setResetOpen(false)}>Giữ lượt chơi</button><button className="primary-button" onClick={reset}>Bắt đầu lại</button></div></div></div>}
    <footer className="footer"><Heart/></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
