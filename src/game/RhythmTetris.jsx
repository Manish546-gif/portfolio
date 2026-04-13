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
const COLS = 10, ROWS = 20, CELL = 30;

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
const PTS = [0, 100, 300, 500, 800];

// ── Audio ─────────────────────────────────────────────────────────────────────
function makeBeatEngine(actx) {
  const BPM = 128;
  const bi   = 60 / BPM;          // one beat  (quarter note)
  const si   = bi / 4;            // one step  (sixteenth note)
  let step = 0;                   // 0-15 within a bar
  let next = actx.currentTime + 0.05;
  let sid = null, cb = null;

  // ── helpers ──────────────────────────────────────────────────────────────────
  const mkNoise = (dur, hpFreq = 0) => {
    const n   = Math.ceil(actx.sampleRate * dur);
    const buf = actx.createBuffer(1, n, actx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    if (hpFreq) {
      // simple one-pole high-pass baked into the buffer
      let prev = 0, rc = 1 / (2 * Math.PI * hpFreq / actx.sampleRate + 1);
      for (let i = 0; i < n; i++) { prev = rc * (prev + d[i] - (i > 0 ? d[i-1] : 0)); d[i] = prev; }
    }
    return buf;
  };

  // ── Kick drum ────────────────────────────────────────────────────────────────
  const kick = (t, vol = 0.9) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.22);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    o.start(t); o.stop(t + 0.28);
    // click transient
    const c = actx.createOscillator(), cg = actx.createGain();
    c.connect(cg); cg.connect(actx.destination);
    c.frequency.value = 3000;
    cg.gain.setValueAtTime(vol * 0.4, t);
    cg.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    c.start(t); c.stop(t + 0.015);
  };

  // ── Sub-bass note (follows chord stab on beat 1) ─────────────────────────────
  const sub = (t, freq = 55) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "sine"; o.connect(g); g.connect(actx.destination);
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + bi * 1.8);
    o.start(t); o.stop(t + bi * 1.8);
  };

  // ── Snare ─────────────────────────────────────────────────────────────────────
  const snare = (t, vol = 0.55) => {
    // tonal body
    const o = actx.createOscillator(), og = actx.createGain();
    o.connect(og); og.connect(actx.destination);
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(120, t + 0.1);
    og.gain.setValueAtTime(vol * 0.6, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    o.start(t); o.stop(t + 0.12);
    // noise crack
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = mkNoise(0.15); f.type = "bandpass"; f.frequency.value = 3500; f.Q.value = 0.5;
    s.connect(f); f.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    s.start(t); s.stop(t + 0.14);
  };

  // ── Rimshot ───────────────────────────────────────────────────────────────────
  const rimshot = (t) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    o.type = "triangle"; o.frequency.value = 800;
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    o.start(t); o.stop(t + 0.04);
  };

  // ── Clap ─────────────────────────────────────────────────────────────────────
  const clap = (t) => {
    [0, 0.008, 0.016].forEach(offset => {
      const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      s.buffer = mkNoise(0.06); f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.8;
      s.connect(f); f.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.3, t + offset);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.06);
      s.start(t + offset); s.stop(t + offset + 0.06);
    });
  };

  // ── Closed hi-hat ─────────────────────────────────────────────────────────────
  const hihatC = (t, vol = 0.18) => {
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = mkNoise(0.05); f.type = "highpass"; f.frequency.value = 9000;
    s.connect(f); f.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    s.start(t); s.stop(t + 0.04);
  };

  // ── Open hi-hat ──────────────────────────────────────────────────────────────
  const hihatO = (t, vol = 0.22) => {
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = mkNoise(0.35); f.type = "highpass"; f.frequency.value = 7500;
    s.connect(f); f.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    s.start(t); s.stop(t + 0.3);
  };

  // ── Shaker (8th-note texture) ─────────────────────────────────────────────────
  const shaker = (t) => {
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = mkNoise(0.025); f.type = "highpass"; f.frequency.value = 11000;
    s.connect(f); f.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    s.start(t); s.stop(t + 0.025);
  };

  // ── Tom ───────────────────────────────────────────────────────────────────────
  const tom = (t, freq = 120, vol = 0.4) => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.18);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.start(t); o.stop(t + 0.22);
  };

  // ── Synth chord stab ──────────────────────────────────────────────────────────
  const stab = (t, notes = [220, 277, 330], vol = 0.12) => {
    notes.forEach(freq => {
      const o = actx.createOscillator(), f = actx.createBiquadFilter(), g = actx.createGain();
      o.type = "sawtooth"; o.frequency.value = freq;
      f.type = "lowpass"; f.frequency.setValueAtTime(2000, t);
      f.frequency.exponentialRampToValueAtTime(400, t + 0.18);
      o.connect(f); f.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.start(t); o.stop(t + 0.2);
    });
  };

  // ── 16-step sequencer patterns ────────────────────────────────────────────────
  //   index: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  const kickPat   = [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0];
  const snarePat  = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
  const clapPat   = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // beat 4e
  const rimPat    = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
  const hihatCPat = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // every 16th
  const hihatOPat = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0]; // steps 6 & 14
  const shakerPat = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 8th notes
  const tomPat    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]; // fill on 15
  const stabPat   = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]; // beat 1 & 3
  const subPat    = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];

  const chords = [[220,277,330], [196,247,294], [233,293,349], [175,220,262]];
  const subFreqs = [55, 49, 58, 44];
  let bar = 0;

  const run = () => {
    while (next < actx.currentTime + 0.3) {
      const t = next;
      const s = step % 16;
      const b = Math.floor(step / 16) % 4; // bar index for chord changes

      if (kickPat[s])   kick(t, s === 0 ? 0.9 : 0.7);
      if (snarePat[s])  snare(t);
      if (clapPat[s])   clap(t);
      if (rimPat[s])    rimshot(t);
      if (hihatCPat[s] && !hihatOPat[s]) hihatC(t, s % 2 === 0 ? 0.18 : 0.1);
      if (hihatOPat[s]) hihatO(t);
      if (shakerPat[s]) shaker(t);
      if (tomPat[s])    tom(t, 100 + (s % 4) * 20, 0.38);
      if (stabPat[s])   stab(t, chords[b % chords.length], 0.1);
      if (subPat[s])    sub(t, subFreqs[b % subFreqs.length]);

      if (s === 0 && cb) cb();   // fire beat callback on bar downbeat
      if (s % 4 === 0 && cb) cb(); // also fire on every quarter note

      step++;
      if (step % 16 === 0) bar++;
      next += si;
    }
    sid = setTimeout(run, 30);
  };

  return {
    start(fn) { cb = fn; run(); },
    stop() { clearTimeout(sid); },
  };
}

const sfxDrop = actx => {
  const o = actx.createOscillator(), g = actx.createGain();
  o.connect(g); g.connect(actx.destination);
  o.type = "sine"; o.frequency.setValueAtTime(220, actx.currentTime);
  o.frequency.exponentialRampToValueAtTime(60, actx.currentTime + 0.1);
  g.gain.setValueAtTime(0.15, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
  o.start(); o.stop(actx.currentTime + 0.1);
};

const sfxClear = actx =>
  [0, 80, 160, 240].forEach((d, i) => setTimeout(() => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    o.type = "sine"; o.frequency.value = 440 + i * 110;
    g.gain.setValueAtTime(0.22, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.12);
    o.start(); o.stop(actx.currentTime + 0.12);
  }, d));

// ── Particles ─────────────────────────────────────────────────────────────────
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
    actx: null, engine: null,
  });
  const rafId = useRef(null);
  const [ui, setUi] = useState({ score:0, lines:0, level:1, combo:0, over:false, started:false, beat:false });

  // ── Start ────────────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    const s = stRef.current;
    s.board = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    s.cur = rnd(); s.nxt = rnd();
    s.score = 0; s.lines = 0; s.level = 1; s.combo = 0;
    s.beatPulse = 0; s.flashTimer = 0; s.flashRows = 0;
    s.particles = []; s.dropTimer = 0; s.lastTime = performance.now();
    s.running = true; s.over = false;
    if (!s.actx) s.actx = new (window.AudioContext || window.webkitAudioContext)();
    else if (s.actx.state === "suspended") s.actx.resume();
    if (s.engine) s.engine.stop();
    s.engine = makeBeatEngine(s.actx);
    s.engine.start(() => { s.beatPulse = 1; });
    setUi({ score:0, lines:0, level:1, combo:0, over:false, started:true, beat:false });
  }, []);

  // ── Keys ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      const s = stRef.current;
      if (!s.running) return;
      const p = s.cur;
      if (e.key === "ArrowLeft"  && valid(s.board, p.cells, p.x-1, p.y)) { p.x--; return; }
      if (e.key === "ArrowRight" && valid(s.board, p.cells, p.x+1, p.y)) { p.x++; return; }
      if (e.key === "ArrowDown") { if (valid(s.board,p.cells,p.x,p.y+1)){p.y++;s.score++;} return; }
      if (e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        const r = rotate(p.cells);
        if      (valid(s.board, r, p.x,   p.y)) p.cells = r;
        else if (valid(s.board, r, p.x-1, p.y)) { p.cells = r; p.x--; }
        else if (valid(s.board, r, p.x+1, p.y)) { p.cells = r; p.x++; }
        return;
      }
      if (e.key === "Shift") {
        const gy = ghostY(s.board, p);
        s.score += (gy - p.y) * 2; p.y = gy; s.dropTimer = 9999; return;
      }
      if (e.key === "r" || e.key === "R") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  // ── Draw helper — no box-shadow ───────────────────────────────────────────────
  const drawBlock = (ctx, px, py, onBeat) => {
    ctx.fillStyle = onBeat ? C.blockHi : C.block;
    ctx.fillRect(px+1, py+1, CELL-2, CELL-2);
    // subtle bevel top/left
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(px+1, py+1, CELL-2, 2);
    ctx.fillRect(px+1, py+1, 2, CELL-2);
    // inner stroke
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px+2, py+2, CELL-4, CELL-4);
  };

  // ── Game loop ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const bCvs = boardRef.current;
    const nCvs = nextRef.current;
    const bCtx = bCvs.getContext("2d");
    const nCtx = nCvs.getContext("2d");

    const loop = now => {
      const s = stRef.current;
      const dt = Math.min((now - s.lastTime) / 1000, 0.1);
      s.lastTime = now;

      // ── Logic ────────────────────────────────────────────────────────────────
      if (s.running) {
        s.beatPulse  = Math.max(0, s.beatPulse  - dt * 5);
        s.flashTimer = Math.max(0, s.flashTimer - dt);

        const speed = Math.max(0.06, 0.48 - (s.level - 1) * 0.04);
        s.dropTimer += dt;
        if (s.dropTimer >= speed) {
          s.dropTimer = 0;
          const p = s.cur;
          if (valid(s.board, p.cells, p.x, p.y+1)) {
            p.y++;
          } else {
            s.board = lockPiece(s.board, p);
            if (s.actx) sfxDrop(s.actx);
            const { board: nb, cleared } = sweep(s.board);
            s.board = nb;
            if (cleared > 0) {
              s.combo++;
              const beatBonus = s.beatPulse > 0.4 ? 2 : 1;
              s.score += Math.round(PTS[cleared] * s.level * beatBonus * (1 + s.combo * 0.4));
              s.lines += cleared;
              s.level = Math.floor(s.lines / 10) + 1;
              s.flashRows = cleared; s.flashTimer = 0.28;
              if (s.actx) sfxClear(s.actx);
              for (let c = 0; c < COLS; c++)
                for (let i = 0; i < 4; i++)
                  s.particles.push(mkPart((c+0.5)*CELL, (ROWS-cleared-0.5)*CELL));
            } else s.combo = 0;
            s.cur = s.nxt; s.nxt = rnd();
            if (!valid(s.board, s.cur.cells, s.cur.x, s.cur.y)) {
              s.running = false; s.over = true;
              if (s.engine) s.engine.stop();
              setUi(u => ({ ...u, over:true, score:s.score, lines:s.lines, level:s.level }));
            }
          }
        }

        s.particles = s.particles.filter(p => p.alpha > 0.02);
        s.particles.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.vy+=0.18; p.alpha-=0.022; });
      }

      // ── Draw board ───────────────────────────────────────────────────────────
      bCtx.clearRect(0, 0, bCvs.width, bCvs.height);

      // grid
      bCtx.strokeStyle = C.grid;
      bCtx.lineWidth = 0.5;
      for (let c = 0; c <= COLS; c++) {
        bCtx.beginPath(); bCtx.moveTo(c*CELL,0); bCtx.lineTo(c*CELL,ROWS*CELL); bCtx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        bCtx.beginPath(); bCtx.moveTo(0,r*CELL); bCtx.lineTo(COLS*CELL,r*CELL); bCtx.stroke();
      }

      const pulse = s.beatPulse;

      // board cells
      s.board.forEach((row, ry) => row.forEach((cell, cx) => {
        if (!cell) return;
        if (s.flashTimer > 0 && ry >= ROWS - s.flashRows) {
          bCtx.save();
          bCtx.globalAlpha = s.flashTimer / 0.28;
          bCtx.fillStyle = "#ffffff";
          bCtx.fillRect(cx*CELL+1, ry*CELL+1, CELL-2, CELL-2);
          bCtx.restore();
        } else {
          drawBlock(bCtx, cx*CELL, ry*CELL, pulse > 0.5);
        }
      }));

      // ghost + active
      if (s.cur) {
        const gy = ghostY(s.board, s.cur);
        if (gy !== s.cur.y) {
          s.cur.cells.forEach(([cx, cy]) => {
            bCtx.fillStyle = C.ghost;
            bCtx.fillRect((cx+s.cur.x)*CELL+1, (cy+gy)*CELL+1, CELL-2, CELL-2);
            bCtx.strokeStyle = "rgba(244,114,182,0.26)";
            bCtx.lineWidth = 0.5;
            bCtx.strokeRect((cx+s.cur.x)*CELL+1,(cy+gy)*CELL+1,CELL-2,CELL-2);
          });
        }
        s.cur.cells.forEach(([cx, cy]) => {
          if (cy + s.cur.y >= 0) drawBlock(bCtx, (cx+s.cur.x)*CELL, (cy+s.cur.y)*CELL, pulse > 0.5);
        });
      }

      // particles
      s.particles.forEach(p => {
        bCtx.save();
        bCtx.globalAlpha = p.alpha;
        bCtx.fillStyle = pulse > 0.5 ? C.blockHi : C.block;
        bCtx.fillRect(p.x-p.size/2, p.y-p.size/2, p.size, p.size);
        bCtx.restore();
      });

      // beat flash
      if (pulse > 0.7) {
        bCtx.fillStyle = `rgba(255,255,255,${(pulse-0.7)*0.06})`;
        bCtx.fillRect(0, 0, bCvs.width, bCvs.height);
      }

      // ── Draw next piece ───────────────────────────────────────────────────────
      nCtx.clearRect(0, 0, nCvs.width, nCvs.height);
      if (s.nxt) {
        const cs = 26;
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

  const BW = COLS * CELL, BH = ROWS * CELL;

  // ── Panel style: transparent bg, white border, no shadow ─────────────────────
  const panel = (extra = {}) => ({
    border: `1px solid ${C.border}`,
    background: "transparent",
    padding: "11px 13px",
    ...extra,
  });

  const label = { color: C.textDim, fontSize: 10, letterSpacing: 2.5, marginBottom: 5 };
  const value = (big) => ({ color: C.text, fontSize: big ? 20 : 16, fontWeight: "700", letterSpacing: 0.5 });

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", position: "relative", userSelect: "none",
    }}>

      {/* Watermark */}
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden",
      }}>
        <span style={{
          fontSize: "clamp(90px,20vw,240px)",
          fontFamily: "Georgia, serif", fontStyle: "italic",
          color: "rgba(255,255,255,0.04)", letterSpacing: "-4px",
          whiteSpace: "nowrap", lineHeight: 1,
        }}>Tetris</span>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", gap: 18, alignItems: "flex-start" }}>

        {/* LEFT */}
        <div style={{ width: 148, display: "flex", flexDirection: "column", gap: 9 }}>

          {[["SCORE", ui.score.toLocaleString(), true], ["LINES", ui.lines, false], ["LEVEL", ui.level, false]].map(([lbl, val, big]) => (
            <div key={lbl} style={panel()}>
              <div style={label}>{lbl}</div>
              <div style={value(big)}>{val}</div>
            </div>
          ))}

          {ui.combo > 1 && (
            <div style={{ border: "1px solid rgba(251,191,36,0.45)", background: "transparent", padding: "11px 13px" }}>
              <div style={{ ...label, color: "rgba(251,191,36,0.55)" }}>COMBO</div>
              <div style={{ color: "#fbbf24", fontSize: 22, fontWeight: "700" }}>×{ui.combo}</div>
            </div>
          )}

          {/* Beat dots */}
          <div style={panel({ paddingBottom: 13 })}>
            <div style={label}>BEAT</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  width: 12, height: 12,
                  border: `1px solid ${ui.beat && i === 0 ? "rgba(251,191,36,0.8)" : C.border}`,
                  background: ui.beat && i === 0 ? "#fbbf24" : "transparent",
                  transition: "all 0.05s",
                }} />
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={panel()}>
            <div style={{ color: C.textDim, fontSize: 9, lineHeight: 1.75 }}>
              Clear on the<br/>
              <span style={{ color: C.text }}>beat</span> = ×2 score
            </div>
          </div>
        </div>

        {/* BOARD */}
        <div style={{
          border: `1px solid ${ui.beat ? C.borderHot : C.border}`,
          transition: "border-color 0.08s",
          lineHeight: 0, background: "transparent",
        }}>
          <canvas ref={boardRef} width={BW} height={BH} style={{ display: "block" }} />
        </div>

        {/* RIGHT */}
        <div style={{ width: 148, display: "flex", flexDirection: "column", gap: 9 }}>

          {/* Next */}
          <div style={panel({ padding: "11px" })}>
            <div style={label}>NEXT</div>
            <canvas ref={nextRef} width={130} height={104} style={{ display: "block" }} />
          </div>

          {/* Controls */}
          <div style={panel()}>
            <div style={label}>CONTROLS</div>
            {[["← →","Move"],["↓","Soft drop"],["↑/SPC","Rotate"],["Shift","Hard drop"],["R","Restart"]].map(([k,a]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ border:`1px solid ${C.border}`, color:C.textMid, fontSize:9, padding:"2px 5px", whiteSpace:"nowrap" }}>{k}</span>
                <span style={{ color:C.textDim, fontSize:9 }}>{a}</span>
              </div>
            ))}
          </div>

          {/* Level bar */}
          <div style={panel()}>
            <div style={label}>PROGRESS</div>
            <div style={{ border:`1px solid ${C.border}`, height:5, background:"transparent", marginBottom:6 }}>
              <div style={{
                height:"100%", background:C.text, transition:"width 0.3s",
                width:`${((ui.lines % 10) / 10) * 100}%`,
              }} />
            </div>
            <div style={{ color:C.textDim, fontSize:9 }}>
              {ui.lines % 10}/10 → Lv.{ui.level+1}
            </div>
          </div>
        </div>
      </div>

      {/* ── Start ─────────────────────────────────────────────────────────────── */}
      {!ui.started && (
        <div style={{
          position:"absolute", inset:0, zIndex:50,
          background:"rgba(98,49,135,0.97)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ color:C.textDim, fontSize:11, letterSpacing:6, marginBottom:14 }}>RHYTHM</div>
            <div style={{
              fontSize:68, fontFamily:"Georgia,serif", fontStyle:"italic",
              color:C.text, marginBottom:8, letterSpacing:-2,
            }}>Tetris</div>
            <div style={{ width:280, height:1, background:C.border, margin:"0 auto 22px" }} />
            <div style={{ color:C.textDim, fontSize:10, letterSpacing:3, marginBottom:42 }}>
              INSPIRED BY LUMINES · SYNC TO THE BEAT
            </div>
            <button
              onClick={start}
              style={{
                background:"transparent", border:`1px solid ${C.border}`,
                color:C.text, padding:"13px 52px", fontSize:12, letterSpacing:5,
                cursor:"pointer", fontFamily:"'Courier New',monospace", transition:"border-color 0.15s",
              }}
              onMouseOver={e=>e.target.style.borderColor=C.borderHot}
              onMouseOut={e=>e.target.style.borderColor=C.border}
            >PLAY</button>
          </div>
        </div>
      )}

      {/* ── Game Over ─────────────────────────────────────────────────────────── */}
      {ui.over && (
        <div style={{
          position:"absolute", inset:0, zIndex:50,
          background:"rgba(98,49,135,0.97)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{
              fontSize:54, fontFamily:"Georgia,serif", fontStyle:"italic",
              color:C.text, marginBottom:32, letterSpacing:-1,
            }}>Game Over</div>
            <div style={{ display:"flex", gap:44, justifyContent:"center", marginBottom:14 }}>
              {[["SCORE",ui.score.toLocaleString()],["LINES",ui.lines],["LEVEL",ui.level]].map(([l,v])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ color:C.textDim, fontSize:10, letterSpacing:3, marginBottom:6 }}>{l}</div>
                  <div style={{ color:C.text, fontSize:26, fontWeight:"700" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ width:280, height:1, background:C.border, margin:"22px auto 30px" }} />
            <button
              onClick={start}
              style={{
                background:"transparent", border:`1px solid ${C.border}`,
                color:C.text, padding:"13px 52px", fontSize:12, letterSpacing:5,
                cursor:"pointer", fontFamily:"'Courier New',monospace", transition:"border-color 0.15s",
              }}
              onMouseOver={e=>e.target.style.borderColor=C.borderHot}
              onMouseOut={e=>e.target.style.borderColor=C.border}
            >RESTART</button>
          </div>
        </div>
      )}
    </div>
  );
}