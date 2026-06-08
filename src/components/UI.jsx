import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../theme";

/* ── Count-up animation hook ── */
export function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let current = 0;
    const steps = Math.max(1, Math.round(duration / 16));
    const increment = target / steps;
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      current = Math.min(target, Math.round(increment * frame));
      setVal(current);
      if (current >= target) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [target, duration]);
  return val;
}

export function Pressable({ children, onClick, style, scale = 0.97, disabled }) {
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState(null);
  const ref = useRef(null);

  const handleDown = (e) => {
    if (disabled) return;
    setPressed(true);
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height / 2) - rect.top;
      const id = Date.now();
      setRipple({ x, y, id });
      setTimeout(() => setRipple(r => r?.id === id ? null : r), 550);
    }
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={handleDown}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        cursor: disabled ? "default" : "pointer",
        position: "relative", overflow: "hidden",
        transition: "transform 0.14s cubic-bezier(.2,.8,.2,1), opacity 0.14s, filter 0.14s",
        transform: pressed ? `scale(${scale})` : "scale(1)",
        filter: pressed ? "brightness(1.08)" : "brightness(1)",
        WebkitTapHighlightColor: "transparent",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {children}
      {ripple && (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x, top: ripple.y,
            width: 6, height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.22)",
            transform: "translate(-50%,-50%) scale(0)",
            animation: "rippleExpand 0.52s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      )}
    </button>
  );
}

export function SkeletonBlock({ width = "100%", height = 16, radius = 8, style }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "rgba(255,255,255,0.06)",
      animation: "skeletonPulse 1.4s ease-in-out infinite",
      ...style,
    }} />
  );
}

export const Mono = ({ children, style }) => {
  const C = useTheme();
  return (
    <span style={{ fontFamily: C.mono, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 11, ...style }}>
      {children}
    </span>
  );
};

export const Kicker = ({ children, color }) => {
  const C = useTheme();
  return (
    <div style={{
      fontFamily: C.mono, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
      color: color || C.accent, fontWeight: 700, marginBottom: 6,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ display: "inline-block", width: 18, height: 2, borderRadius: 1, background: color || C.accent, verticalAlign: "middle", opacity: 0.7 }} />
      {children}
    </div>
  );
};

export const Pill = ({ children, fill, color }) => {
  const C = useTheme();
  const c = color || C.accent;
  return (
    <span style={{
      fontFamily: C.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
      padding: "5px 11px", borderRadius: 999, fontWeight: 700,
      color: fill ? "#000" : c, background: fill ? c : `${c}1f`,
      border: fill ? "none" : `1px solid ${c}40`,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
};

export const PrimaryBtn = ({ children, onClick, style }) => {
  const C = useTheme();
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className="btn-shimmer"
      style={{
        width: "100%", padding: "15px 16px", borderRadius: 14, border: "none",
        background: C.accent, color: "#000",
        fontFamily: C.display, fontWeight: 900, textTransform: "uppercase",
        letterSpacing: "0.12em", fontSize: 13,
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.14s cubic-bezier(.2,.8,.2,1), box-shadow 0.14s",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        boxShadow: pressed ? "none" : `0 4px 20px ${C.accent}55`,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export const BackBtn = ({ onClick }) => {
  const C = useTheme();
  return (
    <Pressable onClick={onClick} scale={0.82} style={{
      background: C.surface2, border: "none", borderRadius: 50,
      width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
      color: C.text, fontSize: 20, marginRight: 12, lineHeight: 1, flexShrink: 0,
    }}>
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 1L1 9l8 8"/>
      </svg>
    </Pressable>
  );
};

export const Icon = ({ name, color, size = 22 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "today":    return (<svg {...common}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>);
    case "train":    return (<svg {...common}><path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/></svg>);
    case "fuel":     return (<svg {...common}><path d="M6 3v7a2 2 0 004 0V3M8 11v10M18 3c-1.5 0-3 1.5-3 5s1.5 4 3 4v9"/></svg>);
    case "ai":       return (<svg {...common}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color} stroke="none"/></svg>);
    case "season":   return (<svg {...common}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><circle cx="12" cy="14" r="1.6" fill={color} stroke="none"/></svg>);
    case "settings": return (<svg {...common}><circle cx="12" cy="8" r="3.2"/><path d="M6 20v-1a6 6 0 0112 0v1"/><line x1="12" y1="14" x2="12" y2="14.5"/></svg>);
    default: return null;
  }
};

export function TabButton({ n, active, onClick }) {
  const C = useTheme();
  const [pressed, setPressed] = useState(false);
  const color = active ? C.accent : C.muted;

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "row", alignItems: "center",
        gap: active ? 7 : 0,
        padding: active ? "8px 16px" : "8px 14px",
        borderRadius: 999,
        background: active
          ? C.name === "light" ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.09)"
          : "transparent",
        WebkitTapHighlightColor: "transparent",
        transition: "all 0.22s cubic-bezier(.2,.8,.2,1)",
        transform: pressed ? "scale(0.9)" : "scale(1)",
        overflow: "hidden",
      }}
    >
      <span
        key={`${n.id}-${active}`}
        style={{
          display: "flex", flexShrink: 0,
          animation: active ? "navPop 0.28s cubic-bezier(.2,.8,.2,1)" : "none",
          filter: active ? `drop-shadow(0 0 5px ${C.accent}88)` : "none",
          transition: "filter 0.2s",
        }}
      >
        <Icon name={n.icon} color={color} size={20} />
      </span>

      {/* Label only on active */}
      <span style={{
        fontFamily: C.mono, fontSize: 9, letterSpacing: "0.1em",
        color: C.accent, fontWeight: 700,
        whiteSpace: "nowrap",
        maxWidth: active ? 70 : 0,
        opacity: active ? 1 : 0,
        overflow: "hidden",
        transition: "max-width 0.22s cubic-bezier(.2,.8,.2,1), opacity 0.18s",
      }}>
        {n.label}
      </span>
    </button>
  );
}

export function SettingsBlock({ title, children }) {
  const C = useTheme();
  return (
    <div style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
      <Mono style={{ color: C.muted, fontSize: 9, display: "block", marginBottom: 12 }}>{title}</Mono>
      {children}
    </div>
  );
}
