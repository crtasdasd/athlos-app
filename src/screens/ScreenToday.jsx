import React, { useState } from "react";
import { useTheme } from "../theme";
import { Pressable, Mono, useCountUp } from "../components/UI";

const DAYS_SL   = ["ned","pon","tor","sre","čet","pet","sob"];
const MONTHS_SL = ["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec"];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return { eye: "🌙", title: "Pozna noč", sub: "Regeneracija je tvoj trening nocoj." };
  if (h < 12) return { eye: "☀️", title: "Dobro jutro", sub: "Danes si pripravljen na odlično jutro." };
  if (h < 17) return { eye: "⚡", title: "Dober dan",  sub: "Sredi dneva — ostaj fokusiran." };
  if (h < 21) return { eye: "🔥", title: "Dober večer", sub: "Pravi čas za trening ali oporavek." };
  return              { eye: "🌙", title: "Dober večer", sub: "Pripravi se na kvaliteten spanec." };
}

function RecoveryArc({ score, C }) {
  const size = 160;
  const r = 60;
  const circ = 2 * Math.PI * r;           // full circumference ≈ 376.99
  const arcDeg = 240;                      // visible arc = 240°, gap = 120° at bottom
  const trackLen = (arcDeg / 360) * circ; // 251.33
  const gapLen = circ - trackLen;         // 125.66
  const filled = (score / 100) * trackLen;
  const color = score >= 70 ? C.accent : score >= 40 ? "#FFB800" : "#FF4C4C";
  // rotate so arc starts bottom-left (-210° from 3-o-clock = rotate SVG -210°)
  const rotation = -210;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={`${color}1a`} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${trackLen} ${gapLen}`}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          style={{ filter: `drop-shadow(0 0 10px ${color}bb)`, transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 10 }}>
        <span style={{ fontFamily: C.display, fontWeight: 900, fontSize: 44, color, lineHeight: 1, letterSpacing: "-0.05em" }}>{score}</span>
        <Mono style={{ color: C.muted, fontSize: 8, marginTop: 2, letterSpacing: "0.16em" }}>/ 100</Mono>
      </div>
    </div>
  );
}

function StatPill({ label, value, unit, C }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Mono style={{ color: C.muted, fontSize: 8, letterSpacing: "0.14em" }}>{label}</Mono>
      <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 18, color: C.text, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}
        {unit && <span style={{ fontSize: 10, color: C.muted, marginLeft: 2, fontWeight: 500 }}>{unit}</span>}
      </div>
    </div>
  );
}

function QuickRow({ icon, title, sub, value, badge, onClick, C }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
        padding: "13px 14px", borderRadius: 14,
        background: pressed ? C.surface2 : C.surface,
        border: `1px solid ${C.border}`,
        cursor: "pointer", WebkitTapHighlightColor: "transparent",
        transition: "transform 0.12s, background 0.12s",
        transform: pressed ? "scale(0.975)" : "scale(1)",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 11, background: `${C.accent}0e`, border: `1px solid ${C.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 13, color: C.text, letterSpacing: "-0.01em" }}>{title}</div>
        <Mono style={{ color: C.muted, fontSize: 8, marginTop: 1 }}>{sub}</Mono>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {badge && <div style={{ padding: "2px 7px", borderRadius: 999, background: `${C.accent}15`, border: `1px solid ${C.accent}28` }}>
          <Mono style={{ color: C.accent, fontSize: 8 }}>{badge}</Mono>
        </div>}
        <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 18, color: C.accent, letterSpacing: "-0.03em" }}>{value}</div>
        <svg width="5" height="9" viewBox="0 0 5 9" fill="none" stroke={C.muted} strokeWidth="1.6" strokeLinecap="round"><path d="M1 1l3 3.5L1 8"/></svg>
      </div>
    </button>
  );
}

export default function ScreenToday({ go, profile }) {
  const C = useTheme();
  const initial = (profile.name || "?").trim().charAt(0).toUpperCase();
  const now = new Date();
  const dateStr = `${DAYS_SL[now.getDay()].toUpperCase()} · ${now.getDate()}. ${MONTHS_SL[now.getMonth()].toUpperCase()} ${now.getFullYear()}`;
  const greeting = getGreeting();

  const SCORE = 84;
  const WORKOUT_PCT = 40;
  const animScore = useCountUp(SCORE, 1200);
  const animHRV   = useCountUp(72, 900);
  const animRHR   = useCountUp(58, 950);

  return (
    <div style={{ minHeight: "100%", background: C.bg }}>

      {/* ── HERO HEADER ── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "16px 20px 0" }}>
        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 340, height: 260, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.accent}12 0%, transparent 70%)`, pointerEvents: "none" }} />

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
          <div>
            <Mono style={{ color: C.muted, fontSize: 9, letterSpacing: "0.18em" }}>{dateStr}</Mono>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontFamily: C.display, fontWeight: 500, fontSize: 15, color: C.muted, letterSpacing: "-0.01em" }}>{greeting.title},</div>
              <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 36, color: C.text, lineHeight: 1, letterSpacing: "-0.04em", marginTop: 2 }}>
                {profile.name}
              </div>
            </div>
            <div style={{ fontFamily: C.display, fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.45, maxWidth: 220 }}>{greeting.sub}</div>
          </div>
          <Pressable
            onClick={() => go("profile")}
            scale={0.9}
            style={{
              width: 46, height: 46, borderRadius: "50%",
              border: `2px solid ${C.accent}60`,
              background: `${C.accent}14`,
              padding: 0, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.accent, fontWeight: 900, fontFamily: C.display, fontSize: 18,
              boxShadow: `0 0 24px ${C.accent}30`,
              flexShrink: 0,
            }}
          >
            {profile.photo ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
          </Pressable>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── RECOVERY CARD ── */}
        <div style={{
          borderRadius: 20,
          background: `linear-gradient(145deg, ${C.surface} 0%, ${C.surface2} 100%)`,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}>
          {/* Top: label + status */}
          <div style={{ padding: "16px 18px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono style={{ color: C.muted, fontSize: 8, letterSpacing: "0.18em" }}>REGENERACIJA</Mono>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
              <Mono style={{ color: C.accent, fontSize: 8, letterSpacing: "0.12em" }}>ODLIČNO STANJE</Mono>
            </div>
          </div>

          {/* Arc + label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0 0" }}>
            <RecoveryArc score={animScore} C={C} />
            <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 13, color: C.text2, marginTop: -8, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Danes si pripravljen na trening
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: C.border, margin: "0 18px" }} />

          {/* Stats */}
          <div style={{ display: "flex", padding: "14px 18px 18px" }}>
            <StatPill label="HRV" value={animHRV} unit="ms" C={C} />
            <div style={{ width: 1, background: C.border }} />
            <StatPill label="SPANJE" value="7:42" C={C} />
            <div style={{ width: 1, background: C.border }} />
            <StatPill label="RHR" value={animRHR} unit="bpm" C={C} />
          </div>
        </div>

        {/* ── WORKOUT CARD ── */}
        <Pressable
          onClick={() => go("train")}
          scale={0.985}
          style={{
            width: "100%", textAlign: "left", border: "none",
            background: `linear-gradient(135deg, ${C.accent}18 0%, ${C.accent}08 50%, transparent 100%)`,
            borderRadius: 20, padding: "20px",
            outline: `1px solid ${C.accent}35`,
            position: "relative", overflow: "hidden",
            boxShadow: `0 8px 32px ${C.accent}14`,
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: `${C.accent}08`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: `${C.accent}05`, pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />
                <Mono style={{ color: C.accent, fontSize: 8, letterSpacing: "0.16em" }}>TRENING DANES · 17:00</Mono>
              </div>
              <div style={{ padding: "3px 9px", borderRadius: 999, background: `${C.accent}20`, border: `1px solid ${C.accent}40` }}>
                <Mono style={{ color: C.accent, fontSize: 8 }}>ČEZ 62 MIN</Mono>
              </div>
            </div>

            {/* Title */}
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 28, color: C.text, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 6 }}>
              Moč · Spodnji del
            </div>

            {/* Meta */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, flexWrap: "wrap" }}>
              {["62 MIN", "7 VAJ", "~480 KCAL"].map((item, i) => (
                <div key={i} style={{ padding: "4px 10px", borderRadius: 999, background: `rgba(255,255,255,0.05)`, border: `1px solid ${C.border}` }}>
                  <Mono style={{ color: C.muted, fontSize: 8, letterSpacing: "0.1em" }}>{item}</Mono>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ height: 4, background: `${C.accent}18`, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${WORKOUT_PCT}%`, height: "100%", background: C.accent, borderRadius: 999, boxShadow: `0 0 12px ${C.accent}` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <Mono style={{ color: C.muted, fontSize: 8 }}>NAPREDEK</Mono>
                <Mono style={{ color: C.accent, fontSize: 8 }}>{WORKOUT_PCT}%</Mono>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "11px 22px", borderRadius: 999, background: C.accent, boxShadow: `0 4px 20px ${C.accent}55` }}>
                <Mono style={{ fontSize: 10, letterSpacing: "0.18em", color: "#000", fontWeight: 700 }}>ZAČNI TRENING</Mono>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#000"><path d="M5 3l14 9-14 9V3z"/></svg>
              </div>
              <div style={{ fontFamily: C.display, fontSize: 11, color: C.muted }}>
                40% opravljeno
              </div>
            </div>
          </div>
        </Pressable>

        {/* ── QUICK ACCESS ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingLeft: 2 }}>
            <Mono style={{ color: C.muted, fontSize: 8, letterSpacing: "0.18em" }}>HITRI DOSTOP</Mono>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <QuickRow
              C={C}
              title="Včerajšnje poročilo"
              sub="MOČ · SCORE"
              value="92"
              badge="VČERAJ"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              onClick={() => go("report")}
            />
            <QuickRow
              C={C}
              title="Naslednja tekma"
              sub="PROTI OLIMPIJI"
              value="3D"
              badge="ČET"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>}
              onClick={() => go("season")}
            />
            <QuickRow
              C={C}
              title="Naslednji obrok"
              sub="PRED TRENINGOM · 12:30"
              value="680"
              badge="KCAL"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a2 2 0 004 0V3M8 11v10M18 3c-1.5 0-3 1.5-3 5s1.5 4 3 4v9"/></svg>}
              onClick={() => go("fuel")}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
