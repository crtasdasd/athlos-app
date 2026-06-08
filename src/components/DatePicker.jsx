import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme";
import { Mono } from "./UI";

const MONTHS_SL = ["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"];

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

const YEAR_W  = 64;
const MIN_AGE = 10; // person must be at least 10 years old

function getMaxDate() {
  const d = new Date();
  return new Date(d.getFullYear() - MIN_AGE, d.getMonth(), d.getDate());
}

/* ── Horizontal Year Carousel ── */
function YearCarousel({ year, onChange }) {
  const C = useTheme();
  const ref = useRef(null);
  const scrolling = useRef(false);
  const scrollTimer = useRef(null);

  const maxDate = getMaxDate();
  const startY  = 1940;
  const endY    = maxDate.getFullYear();
  const years   = Array.from({ length: endY - startY + 1 }, (_, i) => startY + i);
  const clampedYear = Math.min(year, endY);
  const idx = years.indexOf(clampedYear);

  const scrollTo = (i, smooth = true) => {
    if (!ref.current) return;
    const containerW = ref.current.clientWidth;
    const targetX = i * YEAR_W - containerW / 2 + YEAR_W / 2;
    ref.current.scrollTo({ left: Math.max(0, targetX), behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => { scrollTo(idx, false); }, []); // eslint-disable-line
  useEffect(() => { scrollTo(idx); }, [clampedYear]); // eslint-disable-line

  // After scroll stops, snap to nearest and update selection
  const onScroll = () => {
    if (!ref.current) return;
    scrolling.current = true;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrolling.current = false;
      if (!ref.current) return;
      const containerW = ref.current.clientWidth;
      const center = ref.current.scrollLeft + containerW / 2;
      const i = Math.round((center - YEAR_W / 2) / YEAR_W);
      const clamped = Math.max(0, Math.min(years.length - 1, i));
      onChange(years[clamped]);
      scrollTo(clamped);
    }, 120);
  };

  const prev = () => onChange(Math.max(startY, clampedYear - 1));
  const next = () => onChange(Math.min(endY,   clampedYear + 1));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <NavArrow onClick={prev} dir="l" C={C} small />

      <div style={{ position: "relative", flex: 1, overflow: "hidden", borderRadius: 12 }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 36, background: `linear-gradient(to right, ${C.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 36, background: `linear-gradient(to left, ${C.bg}, transparent)`, zIndex: 2, pointerEvents: "none" }} />

        <div
          ref={ref}
          onScroll={onScroll}
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          <div style={{ display: "flex" }}>
            {years.map((y) => {
              const active = y === clampedYear;
              return (
                <div
                  key={y}
                  onPointerDown={(e) => {
                    // track pointer to distinguish tap vs drag
                    e.currentTarget._tapStart = e.clientX;
                  }}
                  onPointerUp={(e) => {
                    const moved = Math.abs(e.clientX - (e.currentTarget._tapStart || e.clientX));
                    if (moved < 8) {
                      onChange(y);
                      const i = years.indexOf(y);
                      scrollTo(i);
                    }
                  }}
                  style={{
                    width: YEAR_W, flexShrink: 0, scrollSnapAlign: "center",
                    height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: C.display,
                    fontWeight: active ? 900 : 400,
                    fontSize: active ? 18 : 14,
                    color: active ? C.accent : C.muted,
                    cursor: "pointer",
                    transition: "font-size 0.15s, color 0.15s, font-weight 0.15s",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    position: "relative",
                    touchAction: "pan-x",
                  }}
                >
                  {active && (
                    <div style={{ position: "absolute", inset: 4, borderRadius: 10, background: `${C.accent}14`, border: `1px solid ${C.accent}40`, zIndex: -1 }} />
                  )}
                  {y}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NavArrow onClick={next} dir="r" C={C} small />
    </div>
  );
}

/* ── Arrow button ── */
function NavArrow({ onClick, dir, C, small }) {
  const [p, setP] = useState(false);
  const sz = small ? 30 : 36;
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => setP(false)}
      style={{
        width: sz, height: sz, borderRadius: 9,
        border: `1px solid ${C.border2}`,
        background: p ? C.surface3 : "transparent",
        color: C.text, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.1s, transform 0.1s",
        transform: p ? "scale(0.86)" : "scale(1)",
        flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width="6" height="12" viewBox="0 0 6 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "l" ? <path d="M5 1L1 6 5 11"/> : <path d="M1 1l4 5-4 5"/>}
      </svg>
    </button>
  );
}

/* ── Day cell ── */
function DayCell({ day, sel, tod, disabled, C, onClick }) {
  const [p, setP] = useState(false);
  if (!day) return <div style={{ aspectRatio: "1" }} />;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setP(true)}
      onPointerUp={() => setP(false)}
      onPointerLeave={() => setP(false)}
      style={{
        aspectRatio: "1", borderRadius: 10,
        border: sel ? "none" : tod ? `1.5px solid ${C.accent}55` : "1.5px solid transparent",
        background: sel ? C.accent : p ? C.surface3 : "transparent",
        color: sel ? "#000" : disabled ? C.muted2 : C.text,
        fontFamily: C.display,
        fontWeight: sel ? 900 : tod ? 700 : 400,
        fontSize: 15,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        transition: "background 0.1s, transform 0.12s",
        transform: p ? "scale(0.8)" : "scale(1)",
        boxShadow: sel ? `0 0 14px ${C.accent}88` : "none",
        WebkitTapHighlightColor: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}
    >
      {day}
      {tod && !sel && (
        <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: C.accent }} />
      )}
    </button>
  );
}

/* ── Future-only day picker (urnik) ── */
const DAYS_SL_SHORT = ["ned","pon","tor","sre","čet","pet","sob"];
const MONTHS_SL_SHORT = ["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec"];

function FutureDatePicker({ value, onChange, onClose, futureDays }) {
  const C = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: futureDays + 1 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const toISO = (d) => d.toISOString().slice(0, 10);
  const [sel, setSel] = useState(value || toISO(today));

  const confirm = () => { onChange(sel); onClose(); };

  const fmtSel = () => {
    const d = new Date(sel + "T00:00:00");
    return `${d.getDate()}. ${MONTHS_SL_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <style>{`@keyframes dpUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }`}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.bg, borderRadius: "26px 26px 0 0", border: `1px solid ${C.border2}`, borderBottom: "none", overflow: "hidden", animation: "dpUp 0.3s cubic-bezier(.2,.8,.2,1)" }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.border2 }} />
        </div>
        {/* Selected label */}
        <div style={{ padding: "4px 20px 14px", borderBottom: `1px solid ${C.border}` }}>
          <Mono style={{ color: C.muted, fontSize: 8 }}>IZBRANI DATUM</Mono>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 20, color: sel ? C.accent : C.muted, marginTop: 3, letterSpacing: "-0.02em" }}>{fmtSel()}</div>
        </div>
        {/* Day grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "14px 10px 10px" }}>
          {days.map((d, i) => {
            const iso = toISO(d);
            const active = sel === iso;
            const isToday = i === 0;
            return (
              <button
                key={iso}
                onClick={() => setSel(iso)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 4, padding: "8px 2px", borderRadius: 12,
                  border: active ? "none" : isToday ? `1.5px solid ${C.accent}55` : `1.5px solid transparent`,
                  background: active ? C.accent : "transparent",
                  cursor: "pointer", WebkitTapHighlightColor: "transparent",
                  transition: "background 0.12s, transform 0.1s",
                  boxShadow: active ? `0 0 14px ${C.accent}88` : "none",
                }}
              >
                <span style={{ fontFamily: C.mono, fontSize: 8, color: active ? "#000" : C.muted, letterSpacing: "0.06em" }}>
                  {DAYS_SL_SHORT[d.getDay()].toUpperCase()}
                </span>
                <span style={{ fontFamily: C.display, fontWeight: active ? 900 : isToday ? 700 : 400, fontSize: 15, color: active ? "#000" : C.text, lineHeight: 1 }}>
                  {d.getDate()}
                </span>
                {isToday && !active && (
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.accent }} />
                )}
              </button>
            );
          })}
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 10, padding: "8px 16px 28px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 14, border: `1px solid ${C.border2}`, background: "transparent", color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 14, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Prekliči</button>
          <button onClick={confirm} style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: C.accent, color: "#000", fontFamily: C.display, fontWeight: 900, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", boxShadow: `0 4px 20px ${C.accent}55`, WebkitTapHighlightColor: "transparent" }}>Potrdi</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main DatePicker ── */
export default function DatePicker({ value, onChange, onClose, futureDays }) {
  if (futureDays != null) return <FutureDatePicker value={value} onChange={onChange} onClose={onClose} futureDays={futureDays} />;
  const C = useTheme();
  const maxDate = getMaxDate();
  const today   = new Date();
  const init    = value ? new Date(value) : maxDate;

  const [month, setMonth] = useState(init.getMonth());
  const [year,  setYear]  = useState(Math.min(init.getFullYear(), maxDate.getFullYear()));
  const [sel,   setSel]   = useState(value || null);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => {
    const nextM = month === 11 ? 0  : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    if (nextY > maxDate.getFullYear()) return;
    if (nextY === maxDate.getFullYear() && nextM > maxDate.getMonth()) return;
    setMonth(nextM);
    if (month === 11) setYear(y => y + 1);
  };

  // If year changes via carousel and current month is now invalid, clamp
  useEffect(() => {
    if (year === maxDate.getFullYear() && month > maxDate.getMonth()) {
      setMonth(maxDate.getMonth());
    }
  }, [year]); // eslint-disable-line

  const days  = daysInMonth(year, month);
  const cells = Array.from({ length: days }, (_, i) => i + 1);
  while (cells.length % 7 !== 0) cells.push(null);

  const isDayDisabled = (d) => {
    if (!d) return false;
    const dt = new Date(year, month, d);
    return dt > maxDate;
  };
  const isSelected = (d) => {
    if (!sel || !d) return false;
    const s = new Date(sel);
    return s.getFullYear() === year && s.getMonth() === month && s.getDate() === d;
  };
  const isToday = (d) => d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const pick = (d) => {
    if (!d || isDayDisabled(d)) return;
    setSel(`${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`);
  };

  const confirm = () => { if (sel) { onChange(sel); onClose(); } };

  const fmtSel = () => {
    if (!sel) return "Izberi datum";
    const d = new Date(sel);
    return `${d.getDate()}. ${MONTHS_SL[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
    >
      <style>{`@keyframes dpUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }`}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", zIndex: 1, background: C.bg, borderRadius: "26px 26px 0 0", border: `1px solid ${C.border2}`, borderBottom: "none", overflow: "hidden", animation: "dpUp 0.3s cubic-bezier(.2,.8,.2,1)" }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: C.border2 }} />
        </div>

        {/* Selected date label */}
        <div style={{ padding: "4px 20px 12px", borderBottom: `1px solid ${C.border}` }}>
          <Mono style={{ color: C.muted, fontSize: 8 }}>IZBRANI DATUM</Mono>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 20, color: sel ? C.accent : C.muted, marginTop: 3, letterSpacing: "-0.02em" }}>
            {fmtSel()}
          </div>
        </div>

        {/* Month nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 6px" }}>
          <NavArrow onClick={prevMonth} dir="l" C={C} />
          <div style={{ flex: 1, textAlign: "center", fontFamily: C.display, fontWeight: 800, fontSize: 17, color: C.text, letterSpacing: "-0.01em", userSelect: "none" }}>
            {MONTHS_SL[month]}
          </div>
          <NavArrow onClick={nextMonth} dir="r" C={C} />
        </div>

        {/* Year horizontal carousel */}
        <div style={{ padding: "0 14px 10px", borderBottom: `1px solid ${C.border}` }}>
          <YearCarousel year={year} onChange={setYear} />
        </div>

        {/* Day grid — sequential, no weekday offset */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 10px 8px", gap: 2 }}>
          {cells.map((d, i) => (
            <DayCell key={i} day={d} sel={isSelected(d)} tod={isToday(d)} disabled={isDayDisabled(d)} C={C} onClick={() => pick(d)} />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, padding: "8px 16px 28px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: 14, border: `1px solid ${C.border2}`, background: "transparent", color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 14, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
            Prekliči
          </button>
          <button onClick={confirm} style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: sel ? C.accent : C.surface3, color: sel ? "#000" : C.muted, fontFamily: C.display, fontWeight: 900, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", cursor: sel ? "pointer" : "default", transition: "background 0.2s, box-shadow 0.2s", boxShadow: sel ? `0 4px 20px ${C.accent}55` : "none", WebkitTapHighlightColor: "transparent" }}>
            Potrdi
          </button>
        </div>
      </div>
    </div>
  );
}
