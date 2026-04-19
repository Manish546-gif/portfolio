import { useState, useEffect, useRef, useCallback } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        "#623187",
  block:     "#f472b6",
  blockHi:   "#fbbf24",
  ghost:     "rgba(244,114,182,0.14)",
  grid:      "rgba(255,255,255,0.06)",
  border:    "rgba(255,255,255,0.22)",
  borderHot: "rgba(255,255,255,0.6)",
  text:      "rgba(255,255,255,0.95)",
  textDim:   "rgba(255,255,255,0.38)",
  textMid:   "rgba(255,255,255,0.62)",
};

// ── Pieces ────────────────────────────────────────────────────────────────────
const PIECES = {
  I: [[0,0],[1,0],[2,0],[3,0]],
  O: [[0,0],[1,0],[0,1],[1,1]],
  T: [[1,0],[0,1],[1,1],[2,1]],
  S: [[1,0],[2,0],[0,1],[1,1]],
  Z: [[0,0],[1,0],[1,1],[2,1]],
  J: [[0,0],[0,1],[1,1],[2,1]],
  L: [[2,0],[0,1],[1,1],[2,1]],
};
const KEYS = Object.keys(PIECES);
const COLS = 10, ROWS = 20;
const PTS = [0, 100, 300, 500, 800];

const rnd = () => {
  const k = KEYS[Math.floor(Math.random() * KEYS.length)];
  return { cells: PIECES[k].map(c => [...c]), x: 3, y: 0 };
};
const rotate = cells => {
  const maxX = Math.max(...cells.map(c => c[0]));
  return cells.map(([x, y]) => [maxX - y, x]);
};
const valid = (board, cells, ox, oy) => {
  for (const [cx, cy] of cells) {
    const nx = cx + ox, ny = cy + oy;
    if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
    if (ny >= 0 && board[ny][nx]) return false;
  }
  return true;
};
const lockPiece = (board, piece) => {
  const nb = board.map(r => [...r]);
  piece.cells.forEach(([cx, cy]) => {
    if (cy + piece.y >= 0) nb[cy + piece.y][cx + piece.x] = true;
  });
  return nb;
};
const sweep = board => {
  const kept = board.filter(r => r.some(c => !c));
  const n = ROWS - kept.length;
  return { board: [...Array.from({ length: n }, () => Array(COLS).fill(false)), ...kept], cleared: n };
};
const ghostY = (board, piece) => {
  let gy = piece.y;
  while (valid(board, piece.cells, piece.x, gy + 1)) gy++;
  return gy;
};
const mkPart = (x, y) => {
  const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 3;
  return { x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 2.5, alpha: 1, size: 2 + Math.random()*4 };
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function RhythmTetris() {
  const boardRef = useRef(null);
  const nextRef  = useRef(null);
  const stRef = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(false)),
    cur: null, nxt: null,
    score: 0, lines: 0, level: 1,
    combo: 0, beatPulse: 0,
    flashTimer: 0, flashRows: 0,
    particles: [],
    dropTimer: 0, lastTime: 0,
    running: false, over: false,
    cell: 30,
  });
  const rafId = useRef(null);
  const [ui, setUi] = useState({
    score: 0, lines: 0, level: 1, combo: 0,
    over: false, started: false, beat: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  // ── Layout calc ───────────────────────────────────────────────────────────
  const calcCell = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mobile = vw <= 600;
    setIsMobile(mobile);
    let cell;
    if (mobile) {
      const mobileCtrlH = 165, statsH = 44, gap = 14;
      const availH = vh - mobileCtrlH - statsH - gap * 3;
      const cellByH = Math.floor(availH / ROWS);
      const cellByW = Math.floor(vw / COLS);
      cell = Math.max(18, Math.min(cellByH, cellByW));
    } else {
      const sideW = 130, gapTotal = 20;
      const availW = vw - sideW * 2 - gapTotal;
      const availH = vh - 20;
      const cellByW = Math.floor(availW / COLS);
      const cellByH = Math.floor(availH / ROWS);
      cell = Math.max(20, Math.min(cellByW, cellByH, 34));
    }
    stRef.current.cell = cell;
    return cell;
  }, []);

  // ── Start ─────────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const cell = calcCell();
    const s = stRef.current;
    s.board = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    s.cur = rnd(); s.nxt = rnd();
    s.score = 0; s.lines = 0; s.level = 1; s.combo = 0;
    s.beatPulse = 0; s.flashTimer = 0; s.flashRows = 0;
    s.particles = []; s.dropTimer = 0; s.lastTime = performance.now();
    s.running = true; s.over = false; s.cell = cell;
    setUi({ score: 0, lines: 0, level: 1, combo: 0, over: false, started: true, beat: false });
  }, [calcCell]);

  // ── Action dispatcher ─────────────────────────────────────────────────────
  const doAction = useCallback((action) => {
    const s = stRef.current;
    if (!s.running) return;
    const p = s.cur;
    if (action === 'left'   && valid(s.board, p.cells, p.x-1, p.y)) { p.x--; return; }
    if (action === 'right'  && valid(s.board, p.cells, p.x+1, p.y)) { p.x++; return; }
    if (action === 'down')  { if (valid(s.board, p.cells, p.x, p.y+1)) { p.y++; s.score++; } return; }
    if (action === 'rotate') {
      const r = rotate(p.cells);
      if      (valid(s.board, r, p.x,   p.y)) p.cells = r;
      else if (valid(s.board, r, p.x-1, p.y)) { p.cells = r; p.x--; }
      else if (valid(s.board, r, p.x+1, p.y)) { p.cells = r; p.x++; }
      return;
    }
    if (action === 'drop') {
      const gy = ghostY(s.board, p);
      s.score += (gy - p.y) * 2; p.y = gy; s.dropTimer = 9999;
    }
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      const s = stRef.current;
      if (!s.running) return;
      if (e.key === 'ArrowLeft')                      doAction('left');
      else if (e.key === 'ArrowRight')                doAction('right');
      else if (e.key === 'ArrowDown')                 doAction('down');
      else if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); doAction('rotate'); }
      else if (e.key === 'Shift')                     doAction('drop');
      else if (e.key === 'r' || e.key === 'R')        start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doAction, start]);

  // ── Resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => calcCell();
    window.addEventListener('resize', onResize);
    calcCell();
    return () => window.removeEventListener('resize', onResize);
  }, [calcCell]);

  // ── Touch button hook ─────────────────────────────────────────────────────
  const useTouchBtn = (action) => {
    const isRepeat = action === 'left' || action === 'right' || action === 'down';
    const intervalRef = useRef(null);
    const press = useCallback((e) => {
      e.preventDefault();
      doAction(action);
      if (isRepeat) intervalRef.current = setInterval(() => doAction(action), 120);
    }, []);
    const release = useCallback((e) => {
      e.preventDefault();
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }, []);
    return { onTouchStart: press, onTouchEnd: release, onTouchCancel: release, onMouseDown: press, onMouseUp: release, onMouseLeave: release };
  };

  const leftProps   = useTouchBtn('left');
  const rightProps  = useTouchBtn('right');
  const downProps   = useTouchBtn('down');
  const rotateProps = useTouchBtn('rotate');
  const dropProps   = useTouchBtn('drop');

  // ── Board swipe gestures ──────────────────────────────────────────────────
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const onBoardTouchStart = useCallback(e => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);
  const onBoardTouchEnd = useCallback(e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.t;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (dt < 200 && absDx < 10 && absDy < 10) { doAction('rotate'); return; }
    if (absDx > absDy && absDx > 30) { doAction(dx > 0 ? 'right' : 'left'); return; }
    if (absDy > absDx && dy > 30) doAction('down');
  }, [doAction]);

  // ── Draw helper ───────────────────────────────────────────────────────────
  const drawBlock = (ctx, px, py, onBeat, cell) => {
    ctx.fillStyle = onBeat ? C.blockHi : C.block;
    ctx.fillRect(px+1, py+1, cell-2, cell-2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(px+1, py+1, cell-2, 2);
    ctx.fillRect(px+1, py+1, 2, cell-2);
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px+2, py+2, cell-4, cell-4);
  };

  // ── Game loop ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const bCvs = boardRef.current;
    const nCvs = nextRef.current;
    const bCtx = bCvs.getContext('2d');
    const nCtx = nCvs.getContext('2d');

    const loop = now => {
      const s = stRef.current;
      const CELL = s.cell;
      const dt = Math.min((now - s.lastTime) / 1000, 0.1);
      s.lastTime = now;

      // sync canvas size to current cell
      if (bCvs.width !== COLS * CELL || bCvs.height !== ROWS * CELL) {
        bCvs.width  = COLS * CELL;
        bCvs.height = ROWS * CELL;
      }

      // ── Logic ──────────────────────────────────────────────────────────────
      if (s.running) {
        s.beatPulse  = Math.max(0, s.beatPulse  - dt * 5);
        s.flashTimer = Math.max(0, s.flashTimer - dt);

        const speed = Math.max(0.06, 0.48 - (s.level - 1) * 0.04);
        s.dropTimer += dt;

        if (s.dropTimer >= speed) {
          s.dropTimer = 0;
          const p = s.cur;
          if (valid(s.board, p.cells, p.x, p.y + 1)) {
            p.y++;
          } else {
            s.board = lockPiece(s.board, p);
            const { board: nb, cleared } = sweep(s.board);
            s.board = nb;
            if (cleared > 0) {
              s.combo++;
              const beatBonus = s.beatPulse > 0.4 ? 2 : 1;
              s.score += Math.round(PTS[cleared] * s.level * beatBonus * (1 + s.combo * 0.4));
              s.lines += cleared;
              s.level  = Math.floor(s.lines / 10) + 1;
              s.flashRows = cleared; s.flashTimer = 0.28;
              for (let c = 0; c < COLS; c++)
                for (let i = 0; i < 4; i++)
                  s.particles.push(mkPart((c + 0.5) * CELL, (ROWS - cleared - 0.5) * CELL));
            } else s.combo = 0;

            s.cur = s.nxt; s.nxt = rnd();
            if (!valid(s.board, s.cur.cells, s.cur.x, s.cur.y)) {
              s.running = false; s.over = true;
              setUi(u => ({ ...u, over: true, score: s.score, lines: s.lines, level: s.level }));
            }
          }
        }

        s.particles = s.particles.filter(p => p.alpha > 0.02);
        s.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.alpha -= 0.022; });
      }

      // ── Draw board ─────────────────────────────────────────────────────────
      bCtx.clearRect(0, 0, bCvs.width, bCvs.height);
      bCtx.strokeStyle = C.grid; bCtx.lineWidth = 0.5;
      for (let c = 0; c <= COLS; c++) {
        bCtx.beginPath(); bCtx.moveTo(c*CELL, 0); bCtx.lineTo(c*CELL, ROWS*CELL); bCtx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        bCtx.beginPath(); bCtx.moveTo(0, r*CELL); bCtx.lineTo(COLS*CELL, r*CELL); bCtx.stroke();
      }

      const pulse = s.beatPulse;

      s.board.forEach((row, ry) => row.forEach((cell, cx) => {
        if (!cell) return;
        if (s.flashTimer > 0 && ry >= ROWS - s.flashRows) {
          bCtx.save();
          bCtx.globalAlpha = s.flashTimer / 0.28;
          bCtx.fillStyle = "#ffffff";
          bCtx.fillRect(cx*CELL+1, ry*CELL+1, CELL-2, CELL-2);
          bCtx.restore();
        } else drawBlock(bCtx, cx*CELL, ry*CELL, pulse > 0.5, CELL);
      }));

      if (s.cur) {
        const gy = ghostY(s.board, s.cur);
        if (gy !== s.cur.y) {
          s.cur.cells.forEach(([cx, cy]) => {
            bCtx.fillStyle = C.ghost;
            bCtx.fillRect((cx+s.cur.x)*CELL+1, (cy+gy)*CELL+1, CELL-2, CELL-2);
            bCtx.strokeStyle = "rgba(244,114,182,0.26)";
            bCtx.lineWidth = 0.5;
            bCtx.strokeRect((cx+s.cur.x)*CELL+1, (cy+gy)*CELL+1, CELL-2, CELL-2);
          });
        }
        s.cur.cells.forEach(([cx, cy]) => {
          if (cy + s.cur.y >= 0) drawBlock(bCtx, (cx+s.cur.x)*CELL, (cy+s.cur.y)*CELL, pulse > 0.5, CELL);
        });
      }

      s.particles.forEach(p => {
        bCtx.save();
        bCtx.globalAlpha = p.alpha;
        bCtx.fillStyle = pulse > 0.5 ? C.blockHi : C.block;
        bCtx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        bCtx.restore();
      });

      if (pulse > 0.7) {
        bCtx.fillStyle = `rgba(255,255,255,${(pulse - 0.7) * 0.06})`;
        bCtx.fillRect(0, 0, bCvs.width, bCvs.height);
      }

      // ── Draw next piece ────────────────────────────────────────────────────
      nCtx.clearRect(0, 0, nCvs.width, nCvs.height);
      if (s.nxt) {
        const cs = 22;
        s.nxt.cells.forEach(([cx, cy]) => {
          const px = (cx+1)*cs, py = (cy+1)*cs;
          nCtx.fillStyle = C.block;
          nCtx.fillRect(px+1, py+1, cs-2, cs-2);
          nCtx.fillStyle = "rgba(255,255,255,0.18)";
          nCtx.fillRect(px+1, py+1, cs-2, 2);
          nCtx.fillRect(px+1, py+1, 2, cs-2);
        });
      }

      setUi(u => ({
        ...u,
        score: s.score, lines: s.lines, level: s.level,
        combo: s.combo, beat: s.beatPulse > 0.5,
      }));

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // ── Styles ────────────────────────────────────────────────────────────────
  const CELL = stRef.current.cell;
  const BW = COLS * CELL, BH = ROWS * CELL;

  const panel = (extra = {}) => ({
    border: `1px solid ${C.border}`,
    background: "transparent",
    padding: "8px 10px",
    ...extra,
  });
  const label   = { color: C.textDim, fontSize: 9, letterSpacing: 2.5, marginBottom: 4 };
  const valBig  = { color: C.text, fontSize: 16, fontWeight: "700" };
  const valSm   = { color: C.text, fontSize: 13, fontWeight: "700" };

  const dpadBtn = (extra = {}) => ({
    background: "rgba(255,255,255,0.08)",
    border: `1px solid ${C.border}`,
    color: C.text,
    fontSize: 16,
    height: 44,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "monospace",
    borderRadius: 4,
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
    ...extra,
  });

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "fixed", top: 0, left: 0,
      userSelect: "none",
    }}>
      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", overflow: "hidden",
      }}>
        <span style={{
          fontSize: "clamp(70px,18vw,220px)",
          fontFamily: "Georgia, serif", fontStyle: "italic",
          color: "rgba(255,255,255,0.04)", letterSpacing: "-4px",
          whiteSpace: "nowrap",
        }}>Tetris</span>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>

        {/* LEFT (desktop only) */}
        {!isMobile && (
          <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 7 }}>
            {[["SCORE", ui.score.toLocaleString(), true], ["LINES", ui.lines, false], ["LEVEL", ui.level, false]].map(([lbl, val, big]) => (
              <div key={lbl} style={panel()}>
                <div style={label}>{lbl}</div>
                <div style={big ? valBig : valSm}>{val}</div>
              </div>
            ))}
            {ui.combo > 1 && (
              <div style={{ border: "1px solid rgba(251,191,36,0.45)", background: "transparent", padding: "8px 10px" }}>
                <div style={{ ...label, color: "rgba(251,191,36,0.55)" }}>COMBO</div>
                <div style={{ color: "#fbbf24", fontSize: 18, fontWeight: "700" }}>×{ui.combo}</div>
              </div>
            )}
            <div style={panel({ paddingBottom: 10 })}>
              <div style={label}>BEAT</div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10,
                    border: `1px solid ${ui.beat && i===0 ? "rgba(251,191,36,0.8)" : C.border}`,
                    background: ui.beat && i===0 ? "#fbbf24" : "transparent",
                    transition: "all 0.05s",
                  }} />
                ))}
              </div>
            </div>
            <div style={panel()}>
              <div style={{ color: C.textDim, fontSize: 9, lineHeight: 1.75 }}>
                Clear on the<br/>
                <span style={{ color: C.text }}>beat</span> = ×2 score
              </div>
            </div>
          </div>
        )}

        {/* CENTER: Board + mobile controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>

          {/* Board */}
          <div style={{
            border: `1px solid ${ui.beat ? C.borderHot : C.border}`,
            transition: "border-color 0.08s",
            lineHeight: 0, background: "transparent",
          }}>
            <canvas
              ref={boardRef}
              width={BW} height={BH}
              style={{ display: "block" }}
              onTouchStart={onBoardTouchStart}
              onTouchEnd={onBoardTouchEnd}
            />
          </div>

          {/* Mobile controls */}
          {isMobile && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: 4 }}>
                {[["SCORE", ui.score.toLocaleString()], ["LINES", ui.lines], ["LEVEL", ui.level]].map(([l, v]) => (
                  <div key={l} style={{ ...panel({ padding: "4px 6px" }), flex: 1, textAlign: "center" }}>
                    <div style={{ ...label, fontSize: 8, marginBottom: 2 }}>{l}</div>
                    <div style={valSm}>{v}</div>
                  </div>
                ))}
                {ui.combo > 1 && (
                  <div style={{ ...panel({ padding: "4px 6px" }), flex: 1, textAlign: "center" }}>
                    <div style={{ ...label, fontSize: 8, marginBottom: 2, color: "rgba(251,191,36,0.55)" }}>COMBO</div>
                    <div style={{ color: "#fbbf24", fontSize: 13, fontWeight: "700" }}>×{ui.combo}</div>
                  </div>
                )}
              </div>

              {/* D-Pad */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, width: "100%" }}>
                {/* Row 1 */}
                <div />
                <button style={dpadBtn()} {...rotateProps}>↺</button>
                <div />
                {/* Row 2 */}
                <button style={dpadBtn()} {...leftProps}>◀</button>
                <button style={dpadBtn()} {...downProps}>▼</button>
                <button style={dpadBtn()} {...rightProps}>▶</button>
                {/* Row 3: Hard Drop full width */}
                <button
                  style={dpadBtn({
                    gridColumn: "span 3",
                    background: "rgba(244,114,182,0.12)",
                    fontSize: 11,
                    letterSpacing: 2,
                    height: 36,
                  })}
                  {...dropProps}
                >
                  ⬇ HARD DROP
                </button>
              </div>

            </div>
          )}
        </div>

        {/* RIGHT (desktop only) */}
        {!isMobile && (
          <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={panel({ padding: 10 })}>
              <div style={label}>NEXT</div>
              <canvas ref={nextRef} width={104} height={80} style={{ display: "block" }} />
            </div>
            <div style={panel()}>
              <div style={label}>CONTROLS</div>
              {[["← →","Move"],["↓","Soft drop"],["↑/SPC","Rotate"],["Shift","Hard drop"],["R","Restart"]].map(([k,a]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ border: `1px solid ${C.border}`, color: C.textMid, fontSize: 8, padding: "2px 4px", whiteSpace: "nowrap" }}>{k}</span>
                  <span style={{ color: C.textDim, fontSize: 8 }}>{a}</span>
                </div>
              ))}
            </div>
            <div style={panel()}>
              <div style={label}>PROGRESS</div>
              <div style={{ border: `1px solid ${C.border}`, height: 4, background: "transparent", marginBottom: 5 }}>
                <div style={{
                  height: "100%", background: C.text, transition: "width 0.3s",
                  width: `${((ui.lines % 10) / 10) * 100}%`,
                }} />
              </div>
              <div style={{ color: C.textDim, fontSize: 8 }}>
                {ui.lines % 10}/10 → Lv.{ui.level + 1}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Start screen ─────────────────────────────────────────────────────── */}
      {!ui.started && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(98,49,135,0.97)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.textDim, fontSize: 10, letterSpacing: 5, marginBottom: 12 }}>RHYTHM</div>
            <div style={{
              fontSize: 52, fontFamily: "Georgia,serif", fontStyle: "italic",
              color: C.text, marginBottom: 8, letterSpacing: -2,
            }}>Tetris</div>
            <div style={{ width: 240, height: 1, background: C.border, margin: "0 auto 18px" }} />
            <div style={{ color: C.textDim, fontSize: 9, letterSpacing: 3, marginBottom: 36 }}>
              INSPIRED BY LUMINES · SYNC TO THE BEAT
            </div>
            <button
              onClick={start}
              style={{
                background: "transparent", border: `1px solid ${C.border}`,
                color: C.text, padding: "12px 44px", fontSize: 12, letterSpacing: 5,
                cursor: "pointer", fontFamily: "'Courier New',monospace",
              }}
            >PLAY</button>
          </div>
        </div>
      )}

      {/* ── Game over screen ──────────────────────────────────────────────────── */}
      {ui.over && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(98,49,135,0.97)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 44, fontFamily: "Georgia,serif", fontStyle: "italic",
              color: C.text, marginBottom: 28, letterSpacing: -1,
            }}>Game Over</div>
            <div style={{ display: "flex", gap: 36, justifyContent: "center", marginBottom: 12 }}>
              {[["SCORE", ui.score.toLocaleString()], ["LINES", ui.lines], ["LEVEL", ui.level]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ color: C.textDim, fontSize: 9, letterSpacing: 3, marginBottom: 5 }}>{l}</div>
                  <div style={{ color: C.text, fontSize: 22, fontWeight: "700" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ width: 240, height: 1, background: C.border, margin: "20px auto 26px" }} />
            <button
              onClick={start}
              style={{
                background: "transparent", border: `1px solid ${C.border}`,
                color: C.text, padding: "12px 44px", fontSize: 12, letterSpacing: 5,
                cursor: "pointer", fontFamily: "'Courier New',monospace",
              }}
            >RESTART</button>
          </div>
        </div>
      )}
    </div>
  );
}