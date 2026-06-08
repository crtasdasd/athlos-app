import React, { useState } from "react";
import { useTheme, useDatePicker, useTimePicker } from "../theme";
import { Pressable, Mono, Kicker, PrimaryBtn } from "../components/UI";

export const DAY_NAMES = ["PON", "TOR", "SRE", "ČET", "PET", "SOB", "NED"];

export function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dayIdx(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return (d.getDay() + 6) % 7;
}

export function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()}. ${["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"][d.getMonth()]}`;
}

export const evColor = (C, type) => ({ trening: C.accent, tekma: C.red, recovery: C.yellow }[type]);
export const EV_LABEL = { trening: "TRENING", tekma: "TEKMA", recovery: "RECOVERY" };

const MOBILITY = {
  "Nogomet": "Mobilnost kolkov + raztezanje zadnje lože",
  "Košarka": "Gleženj + skočna mobilnost, raztezanje mečnic",
  "Hokej": "Odpiranje kolkov + spodnji hrbet",
  "Tek / Atletika": "Raztezanje mečnic, kolkov in fleksorjev",
  "Tenis": "Rama + rotacija trupa, zapestja",
  "Plavanje": "Mobilnost ramen + prsna hrbtenica",
  "Kolesarstvo": "Razbremenitev kolkov + spodnji hrbet",
  "Fitnes / Moč": "Splošna mobilnost + foam rolling",
};

function mobilityFor(sport) {
  return MOBILITY[sport] || "Lahka mobilnost + raztezanje za tvoj šport";
}

function Legend({ color, label }) {
  const C = useTheme();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.muted }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function EventRow({ ev, onDelete }) {
  const C = useTheme();
  const [pressed, setPressed] = useState(false);
  const color = evColor(C, ev.type) || C.accent;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 4, height: 38, borderRadius: 2, background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: 15, color: C.text }}>{ev.title}</span>
          <span style={{ fontFamily: C.mono, fontSize: 8, letterSpacing: "0.1em", color, background: `${color}1f`, padding: "2px 7px", borderRadius: 999 }}>{EV_LABEL[ev.type]}</span>
        </div>
        <Mono style={{ color: C.muted, fontSize: 9 }}>{fmtDate(ev.date)} · {ev.time}</Mono>
      </div>
      <button onClick={onDelete} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
        style={{ background: "none", border: "none", color: pressed ? C.red : C.muted2, fontSize: 18, cursor: "pointer", padding: 6, transition: "color 0.15s, transform 0.12s", transform: pressed ? "scale(0.85)" : "scale(1)" }}>
        ×
      </button>
    </div>
  );
}

function AddEventForm({ onAdd, onCancel }) {
  const C = useTheme();
  const openDP = useDatePicker();
  const openTP = useTimePicker();
  const [type, setType] = useState("trening");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(isoOffset(0));
  const [time, setTime] = useState("17:00");
  const submit = () => {
    const fallback = EV_LABEL[type].charAt(0) + EV_LABEL[type].slice(1).toLowerCase();
    onAdd({ type, title: title.trim() || fallback, date, time });
  };
  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 600, fontSize: 15, outline: "none", boxSizing: "border-box", colorScheme: "dark" };
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 22, animation: "athlosFade 0.2s ease" }}>
      <Mono style={{ color: C.muted, fontSize: 10 }}>TIP</Mono>
      <div style={{ display: "flex", gap: 8, margin: "8px 0 16px" }}>
        {["trening", "tekma", "recovery"].map((t) => (
          <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${type === t ? evColor(C, t) : C.border}`, background: type === t ? `${evColor(C, t)}1f` : "transparent", color: type === t ? evColor(C, t) : C.muted, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>{EV_LABEL[t]}</button>
        ))}
      </div>
      <Mono style={{ color: C.muted, fontSize: 10 }}>NAZIV</Mono>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="npr. Moč · spodnji del" style={{ ...inputStyle, marginTop: 8, marginBottom: 18 }} />
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <Mono style={{ color: C.muted, fontSize: 10 }}>DATUM</Mono>
          <button
            onClick={() => openDP && openDP({ value: date, onChange: (v) => setDate(v), futureDays: 14 })}
            style={{
              width: "100%", marginTop: 8, padding: "12px 14px",
              borderRadius: 10, border: `1px solid ${C.accent}55`,
              background: `${C.accent}0a`, color: C.text,
              fontFamily: C.display, fontWeight: 600, fontSize: 14,
              textAlign: "left", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span>{fmtDate(date)}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>
            </svg>
          </button>
        </div>
        <div style={{ width: 110 }}>
          <Mono style={{ color: C.muted, fontSize: 10 }}>URA</Mono>
          <button
            onClick={() => openTP && openTP({ value: time, onChange: (v) => setTime(v) })}
            style={{
              width: "100%", marginTop: 8, padding: "12px 14px",
              borderRadius: 10, border: `1px solid ${C.accent}55`,
              background: `${C.accent}0a`, color: C.text,
              fontFamily: C.display, fontWeight: 700, fontSize: 15,
              textAlign: "center", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              letterSpacing: "-0.01em",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span style={{ color: C.accent }}>{time}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
            </svg>
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Pressable onClick={onCancel} scale={0.97} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${C.border2}`, background: "none", color: C.muted, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Preklici</Pressable>
        <PrimaryBtn onClick={submit} style={{ flex: 1 }}>Dodaj</PrimaryBtn>
      </div>
    </div>
  );
}

function AiPlanForm({ sport, onPlan, onCancel }) {
  const C = useTheme();
  const [days, setDays] = useState([0, 2, 4]);
  const [from, setFrom] = useState("16:00");
  const [to, setTo] = useState("20:00");
  const [matchDate, setMatchDate] = useState("");
  const [fillRest, setFillRest] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleDay = (i) => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  const generate = () => {
    if (days.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const evs = [];
      let id = 1;
      const trainings = ["Moč · spodnji del", "Moč · zgornji del", "Eksplozivnost", "Hitrost + tehnika", "Volumen"];
      let ti = 0;
      for (let off = 0; off < 14; off++) {
        const iso = isoOffset(off);
        const wd = dayIdx(iso);
        const isMatch = matchDate && iso === matchDate;
        const dayBeforeMatch = matchDate && isoOffset(off + 1) === matchDate;
        const dayAfterMatch = matchDate && isoOffset(off - 1) === matchDate;
        if (isMatch) {
          evs.push({ id: id++, date: iso, type: "tekma", title: "Tekma", time: "19:00" });
        } else if (dayAfterMatch) {
          evs.push({ id: id++, date: iso, type: "recovery", title: "Regeneracija po tekmi", time: from });
        } else if (days.includes(wd)) {
          if (dayBeforeMatch) {
            evs.push({ id: id++, date: iso, type: "trening", title: "Aktivacija (pred tekmo)", time: from });
          } else {
            evs.push({ id: id++, date: iso, type: "trening", title: trainings[ti % trainings.length], time: from });
            ti++;
          }
        } else if (fillRest) {
          evs.push({ id: id++, date: iso, type: "recovery", title: mobilityFor(sport), time: from });
        }
      }
      onPlan(evs);
      setLoading(false);
    }, 1100);
  };
  const dateStyle = { width: "100%", marginTop: 8, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 600, fontSize: 15, outline: "none", boxSizing: "border-box", colorScheme: "dark" };
  return (
    <div style={{ background: `${C.accent}0a`, border: `1px solid ${C.accent}33`, borderRadius: 16, padding: 18, marginBottom: 22, animation: "athlosFade 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ color: C.accent }}>⚡</span>
        <Mono style={{ color: C.accent }}>AI UREDI URNIK</Mono>
      </div>
      <p style={{ margin: "0 0 16px", color: C.text2, fontSize: 13, lineHeight: 1.5 }}>Povej kdaj imaš čas in kdaj je tekma — AI sestavi optimalen 2-tedenski urnik.</p>
      <Mono style={{ color: C.muted, fontSize: 10 }}>KATERE DNEVE LAHKO TRENIRAŠ</Mono>
      <div style={{ display: "flex", gap: 6, margin: "8px 0 16px" }}>
        {DAY_NAMES.map((dn, i) => {
          const on = days.includes(i);
          return (
            <button key={i} onClick={() => toggleDay(i)} style={{ flex: 1, padding: "10px 2px", borderRadius: 10, border: `1px solid ${on ? C.accent : C.border}`, background: on ? `${C.accent}26` : "transparent", color: on ? C.accent : C.muted, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.05em", cursor: "pointer", fontWeight: on ? 700 : 500 }}>{dn}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Mono style={{ color: C.muted, fontSize: 10 }}>OD KDAJ</Mono>
          <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} style={dateStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <Mono style={{ color: C.muted, fontSize: 10 }}>DO KDAJ</Mono>
          <input type="time" value={to} onChange={(e) => setTo(e.target.value)} style={dateStyle} />
        </div>
      </div>
      <Mono style={{ color: C.muted, fontSize: 10 }}>DATUM TEKME (NEOBVEZNO)</Mono>
      <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} style={{ ...dateStyle, marginBottom: 18 }} />
      {days.length < 7 && (
        <button onClick={() => setFillRest((v) => !v)}
          style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", padding: 14, marginBottom: 18, borderRadius: 12, cursor: "pointer", border: `1px solid ${fillRest ? C.accent : C.border2}`, background: fillRest ? `${C.accent}1a` : C.surface, transition: "border-color 0.15s, background 0.15s", WebkitTapHighlightColor: "transparent" }}>
          <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1, border: `1px solid ${fillRest ? C.accent : C.border2}`, background: fillRest ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
            {fillRest && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
          </span>
          <span>
            <span style={{ display: "block", fontFamily: C.display, fontWeight: 700, fontSize: 14, color: C.text }}>Izkoristi proste dni</span>
            <span style={{ display: "block", color: C.muted, fontSize: 12, lineHeight: 1.45, marginTop: 3 }}>
              Na proste dni dodam lahke <strong style={{ color: C.text2 }}>raztezne in mobilnostne vaje</strong> za {sport || "tvoj šport"}.
            </span>
          </span>
        </button>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <Pressable onClick={onCancel} scale={0.97} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1px solid ${C.border2}`, background: "none", color: C.muted, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Preklici</Pressable>
        <PrimaryBtn onClick={generate} style={{ flex: 1, opacity: days.length === 0 ? 0.5 : 1 }}>{loading ? "Generiram..." : "Generiraj urnik"}</PrimaryBtn>
      </div>
    </div>
  );
}

export default function ScreenSeason({ profile }) {
  const C = useTheme();
  const [mode, setMode] = useState("list");
  const [events, setEvents] = useState([
    { id: 1, date: isoOffset(0), type: "trening", title: "Moč · spodnji del", time: "17:00" },
    { id: 2, date: isoOffset(2), type: "trening", title: "Zgornji del", time: "17:00" },
    { id: 3, date: isoOffset(3), type: "tekma", title: "Proti Olimpiji", time: "19:00" },
    { id: 4, date: isoOffset(4), type: "recovery", title: "Regeneracija", time: "10:00" },
  ]);
  const sorted = [...events].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return (
    <div style={{ padding: "8px 20px 24px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <Kicker>SEZONA</Kicker>
          <h2 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 26, textTransform: "uppercase", margin: 0, color: C.text }}>URNIK</h2>
        </div>
      </header>

      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        <Pressable onClick={() => setMode(mode === "add" ? "list" : "add")} scale={0.97} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.border2}`, background: mode === "add" ? C.surface2 : "none", color: C.text, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>+ Dodaj sam</Pressable>
        <Pressable onClick={() => setMode(mode === "ai" ? "list" : "ai")} scale={0.97} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.accent}59`, background: mode === "ai" ? `${C.accent}1f` : `${C.accent}0d`, color: C.accent, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>⚡ AI Urnik</Pressable>
      </div>

      {mode === "add" && <AddEventForm onAdd={(ev) => { setEvents((e) => [...e, { ...ev, id: Date.now() }]); setMode("list"); }} onCancel={() => setMode("list")} />}
      {mode === "ai" && <AiPlanForm sport={profile?.sport} onPlan={(evs) => { setEvents(evs); setMode("list"); }} onCancel={() => setMode("list")} />}

      <Kicker color={C.muted}>TA TEDEN</Kicker>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {DAY_NAMES.map((dn, i) => {
          const dayEvents = events.filter((e) => dayIdx(e.date) === i);
          const hasTekma = dayEvents.some((e) => e.type === "tekma");
          const hasTrening = dayEvents.some((e) => e.type === "trening");
          const hasRec = dayEvents.some((e) => e.type === "recovery");
          const dot = hasTekma ? C.red : hasTrening ? C.accent : hasRec ? C.yellow : null;
          return (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 2px", borderRadius: 10, background: dot ? C.surface : "transparent", border: `1px solid ${dot ? C.border : "transparent"}` }}>
              <Mono style={{ color: C.muted, fontSize: 8 }}>{dn}</Mono>
              <div style={{ height: 6, marginTop: 8, display: "flex", justifyContent: "center" }}>
                {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.1em" }}>
        <Legend color={C.accent} label="TRENING" />
        <Legend color={C.red} label="TEKMA" />
        <Legend color={C.yellow} label="RECOVERY" />
      </div>

      <Kicker color={C.muted}>PRIHAJAJOČE</Kicker>
      {sorted.length === 0 && <Mono style={{ color: C.muted2 }}>Ni dogodkov — dodaj jih zgoraj.</Mono>}
      {sorted.map((e) => (
        <EventRow key={e.id} ev={e} onDelete={() => setEvents((list) => list.filter((x) => x.id !== e.id))} />
      ))}
    </div>
  );
}
