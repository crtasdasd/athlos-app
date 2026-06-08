import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../theme";
import { Mono, Kicker, Pill, BackBtn, Pressable } from "../components/UI";

export function ExRow({ num, icon, iconBg, name, d, tag, active, warn, right, onClick }) {
  const C = useTheme();
  const [pressed, setPressed] = useState(false);
  return (
    <button onClick={onClick} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{ width: "100%", textAlign: "left", background: pressed ? C.surface2 : "transparent", border: "none", borderBottom: `1px solid ${C.border}`, padding: "16px 12px", margin: "0 -12px", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.15s, transform 0.12s", transform: pressed ? "scale(0.99)" : "scale(1)", WebkitTapHighlightColor: "transparent" }}>
      {num && <Mono style={{ color: C.muted2, fontSize: 11, width: 18 }}>{num}</Mono>}
      {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6, color: C.text }}>
          {name}
          {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />}
          {warn && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFB800" }} />}
        </div>
        {d && <Mono style={{ color: C.muted, fontSize: 9 }}>{d}</Mono>}
      </div>
      {tag && <Pill>{tag}</Pill>}
      {right ? <Mono style={{ color: C.muted }}>{right}</Mono> : <span style={{ color: C.muted, marginLeft: 4, transition: "transform 0.15s", transform: pressed ? "translateX(3px)" : "none" }}>›</span>}
    </button>
  );
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

const EXERCISES = [
  { n: "01", name: "Počep (Back Squat)", d: "4 × 5 · 120 kg · 82% 1RM", tag: "VBT", sets: 4, reps: 5, rest: 180 },
  { n: "02", name: "Trap Bar Mrtvi dvig", d: "3 × 3 · 140 kg · 85% 1RM", sets: 3, reps: 3, rest: 180 },
  { n: "03", name: "Box Jump", d: "5 × 3 · 60 cm · Eksplozivno", sets: 5, reps: 3, rest: 90 },
  { n: "04", name: "Bolgarski počep", d: "3 × 8 · 24 kg", sets: 3, reps: 8, rest: 90 },
  { n: "05", name: "Nordic Hamstring", d: "3 × 6 · Prehab", sets: 3, reps: 6, rest: 60, warn: true },
  { n: "06", name: "Copenhagen Plank", d: "3 × 30s", sets: 3, reps: "30s", rest: 60 },
];

export default function ScreenTrain({ go }) {
  const C = useTheme();
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [resting, setResting] = useState(false);
  const [restLeft, setRestLeft] = useState(0);

  // Stopwatch
  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [started]);

  // Rest timer
  useEffect(() => {
    if (!resting || restLeft <= 0) return;
    if (restLeft === 0) { setResting(false); return; }
    const iv = setInterval(() => setRestLeft(r => {
      if (r <= 1) { setResting(false); return 0; }
      return r - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [resting, restLeft]);

  const ex = EXERCISES[exIdx];
  const totalSets = EXERCISES.reduce((s, e) => s + e.sets, 0);
  const doneSets = EXERCISES.slice(0, exIdx).reduce((s, e) => s + e.sets, 0) + setsDone;
  const progress = Math.round((doneSets / totalSets) * 100);

  const cameraRef = useRef(null);

  const logSet = () => {
    if (resting) return;
    // Open camera
    if (cameraRef.current) cameraRef.current.click();
  };

  const onCameraCapture = () => {
    const nextSets = setsDone + 1;
    setSetsDone(nextSets);
    setResting(true);
    setRestLeft(ex.rest);
    if (nextSets >= ex.sets) {
      setTimeout(() => {
        if (exIdx < EXERCISES.length - 1) {
          setExIdx(i => i + 1);
          setSetsDone(0);
        }
      }, 300);
    }
  };

  const skipRest = () => { setResting(false); setRestLeft(0); };

  if (!started) {
    return (
      <div style={{ padding: "8px 20px 24px" }}>
        <header style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
          <BackBtn onClick={() => go("today")} />
          <div style={{ flex: 1 }}>
            <Kicker>TRENING #14</Kicker>
            <h2 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 24, margin: 0, color: C.text, letterSpacing: "-0.02em" }}>Moč · Spodnji del</h2>
          </div>
        </header>

        <div style={{ display: "flex", gap: 14, paddingBottom: 16, borderBottom: `1px solid ${C.border}`, marginBottom: 14 }}>
          {[["62", "min"], ["82%", "intenz."], ["8.6t", "volumen"], ["7", "vaj"]].map(([v, l], i) => (
            <div key={i}>
              <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 18, color: i === 1 ? C.accent : C.text }}>{v}</div>
              <Mono style={{ color: C.muted, fontSize: 9 }}>{l}</Mono>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "10px 14px", background: `${C.accent}0d`, border: `1px solid ${C.accent}30`, borderRadius: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={C.accent} stroke="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: C.accent, letterSpacing: "0.06em" }}>AI: +2.5 kg na počepu po zadnjem RPE 7</span>
        </div>

        <ExRow icon="🔥" iconBg="rgba(255,204,77,0.1)" name="Ogrevanje" right="8 min ›" onClick={() => go("session")} />
        {EXERCISES.map((e, i) => (
          <ExRow key={i} num={e.n} name={e.name} d={e.d} tag={e.tag} warn={e.warn} onClick={() => { setStarted(true); setExIdx(i); setSetsDone(0); }} />
        ))}

        <div style={{ marginTop: 20 }}>
          <Pressable onClick={() => setStarted(true)} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: C.accent, color: "#000",
            fontFamily: C.display, fontWeight: 900, fontSize: 14,
            textTransform: "uppercase", letterSpacing: "0.12em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: `0 4px 20px ${C.accent}55`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="none"><path d="M5 3l14 9-14 9V3z"/></svg>
            Začni trening
          </Pressable>
        </div>
      </div>
    );
  }

  // ── Active workout mode ──
  const restPct = ex.rest > 0 ? (restLeft / ex.rest) * 100 : 0;

  return (
    <div style={{ padding: "8px 20px 24px", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <BackBtn onClick={() => { setStarted(false); setElapsed(0); setExIdx(0); setSetsDone(0); }} />
        <div style={{ flex: 1 }}>
          <Mono style={{ color: C.muted, fontSize: 8 }}>AKTIVEN TRENING</Mono>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: "-0.02em" }}>Moč · Spodnji del</div>
        </div>
        {/* Stopwatch */}
        <div style={{ padding: "6px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999 }}>
          <span style={{ fontFamily: C.mono, fontWeight: 700, fontSize: 15, color: C.accent, letterSpacing: "0.04em" }}>{fmtTime(elapsed)}</span>
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <Mono style={{ color: C.muted, fontSize: 8 }}>SKUPNI NAPREDEK</Mono>
          <Mono style={{ color: C.accent, fontSize: 8 }}>{doneSets}/{totalSets} SETOV</Mono>
        </div>
        <div style={{ height: 4, background: C.surface3, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: C.accent, borderRadius: 999, transition: "width 0.5s cubic-bezier(.2,.8,.2,1)", boxShadow: `0 0 8px ${C.accent}` }} />
        </div>
      </div>

      {/* Current exercise card */}
      <div style={{ padding: "20px", background: `linear-gradient(135deg, ${C.accent}12, ${C.accent}04)`, border: `1px solid ${C.accent}28`, borderRadius: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <Mono style={{ color: C.accent, fontSize: 8, marginBottom: 4 }}>TRENUTNA VAJA · {ex.n}/{EXERCISES.length}</Mono>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 20, color: C.text, letterSpacing: "-0.02em" }}>{ex.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 28, color: C.accent, lineHeight: 1 }}>{setsDone}<span style={{ fontSize: 14, color: C.muted }}>/{ex.sets}</span></div>
            <Mono style={{ color: C.muted, fontSize: 8 }}>SETI</Mono>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontFamily: C.display }}>
          <div><Mono style={{ color: C.muted, fontSize: 8 }}>PONOV.</Mono><div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{ex.reps}</div></div>
          <div><Mono style={{ color: C.muted, fontSize: 8 }}>ODMOR</Mono><div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{ex.rest}s</div></div>
        </div>
      </div>

      {/* Rest timer */}
      {resting && (
        <div style={{ padding: "16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 14, animation: "athlosFade 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Mono style={{ color: C.muted, fontSize: 8 }}>ODMOR</Mono>
            <button onClick={skipRest} style={{ background: "none", border: `1px solid ${C.border2}`, borderRadius: 999, padding: "4px 12px", color: C.muted, fontFamily: C.mono, fontSize: 8, cursor: "pointer", letterSpacing: "0.1em" }}>PRESKOČI</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 36, color: restLeft <= 10 ? "#FF4C4C" : C.text, letterSpacing: "-0.03em", transition: "color 0.3s" }}>{fmtTime(restLeft)}</div>
            <div style={{ flex: 1, height: 6, background: C.surface3, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${restPct}%`, height: "100%", background: restLeft <= 10 ? "#FF4C4C" : C.accent, borderRadius: 999, transition: "width 1s linear, background 0.3s" }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Hidden camera input */}
      <input
        ref={cameraRef}
        type="file"
        accept="video/*,image/*"
        capture="environment"
        onChange={onCameraCapture}
        style={{ display: "none" }}
      />

      {/* Log set button */}
      <Pressable
        onClick={logSet}
        disabled={resting}
        style={{
          width: "100%", padding: "18px", borderRadius: 14, border: "none",
          background: resting ? C.surface2 : C.accent,
          color: resting ? C.muted : "#000",
          fontFamily: C.display, fontWeight: 900, fontSize: 15,
          textTransform: "uppercase", letterSpacing: "0.1em",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: resting ? "none" : `0 4px 20px ${C.accent}55`,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {resting ? `Počivaj · ${fmtTime(restLeft)}` : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            {`Posnami set ${setsDone + 1}/${ex.sets}`}
          </>
        )}
      </Pressable>

      {/* Upcoming exercises */}
      {exIdx < EXERCISES.length - 1 && (
        <div style={{ marginTop: 16 }}>
          <Mono style={{ color: C.muted, fontSize: 8, marginBottom: 8 }}>NASLEDNJE</Mono>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
            <Mono style={{ color: C.muted2, fontSize: 10, width: 20 }}>{EXERCISES[exIdx + 1].n}</Mono>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: C.display, fontWeight: 600, fontSize: 13, color: C.text2 }}>{EXERCISES[exIdx + 1].name}</div>
              <Mono style={{ color: C.muted, fontSize: 8 }}>{EXERCISES[exIdx + 1].d}</Mono>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
