import React, { useState } from "react";
import { useTheme } from "../theme";
import { Mono, Pressable } from "../components/UI";

const SUGGESTIONS = [
  "Kako izboljšam regeneracijo?",
  "Kaj naj jem pred treningom?",
  "Imam bolečino v kolenu",
];

function AvatarIcon({ size = 36, accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <defs>
        <linearGradient id="aiGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={accent + "88"} />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill={`url(#aiGrad)`} opacity="0.15" />
      <rect width="36" height="36" rx="10" stroke={accent} strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M13 24l5-12 5 12M15.5 19.5h5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function nowTime() {
  const n = new Date();
  return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
}

export default function ScreenAI() {
  const C = useTheme();
  const [msgs, setMsgs] = useState([
    { from: "bot", t: "Zdravo. Sem tvoj osebni AI trener, ki analizira tvoje podatke v realnem času. Postavi vprašanje o treningu, prehrani ali regeneraciji.", time: nowTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing]);

  const demoReply = (q) => {
    const s = q.toLowerCase();
    if (s.includes("bol") || s.includes("koleno") || s.includes("rama") || s.includes("hrbet"))
      return "Oceni bolečino od 1 do 10. Pri 3–4 zamenjam problematične vaje z varnejšimi alternativami. Pri 7+ priporočam premor in posvet s fizioterapevtom.";
    if (s.includes("prehran") || s.includes("kalor") || s.includes("jed") || s.includes("hran"))
      return "Glede na tvojo težo in fazo treninga prilagodim dnevni vnos kalorij. Povej mi, kdaj danes treniraš — sestavil bom optimalen predlog.";
    if (s.includes("regener") || s.includes("recovery") || s.includes("spanj") || s.includes("utruj"))
      return "Tvoj recovery score danes je 84/100. Optimalno za poln trening. Če pade pod 55 tri dni zapored, samodejno vstavim lahek regeneracijski dan.";
    if (s.includes("zakaj") || s.includes("kako") || s.includes("kdaj"))
      return "Vsak element tvojega programa ima jasno logiko. Povej mi konkretno vajo ali situacijo in ti razložim razlog zanjo.";
    return "Zabeležil sem. Da ti dam najnatančnejši odgovor — gre za trening, bolečino ali prehrano?";
  };

  const send = (text) => {
    const q = (text || input).trim();
    if (!q || typing) return;
    setShowSugg(false);
    setMsgs((m) => [...m, { from: "user", t: q, time: nowTime() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", t: demoReply(q), time: nowTime() }]);
      setTyping(false);
    }, 1800 + Math.random() * 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>

      {/* ── Header ── */}
      <div style={{ padding: "12px 20px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: `linear-gradient(to bottom, ${C.accent}08, transparent)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AvatarIcon size={40} accent={C.accent} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 15, color: C.text, letterSpacing: "-0.02em" }}>ATHLOS Coach</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: typing ? "#FFB800" : C.accent, boxShadow: `0 0 6px ${typing ? "#FFB800" : C.accent}` }} />
              <span style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", color: typing ? "#FFB800" : C.accent }}>
                {typing ? "PIŠE..." : "NA VOLJO"}
              </span>
            </div>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 999, background: `${C.accent}12`, border: `1px solid ${C.accent}25` }}>
            <span style={{ fontFamily: C.mono, fontSize: 8, color: C.accent, letterSpacing: "0.1em" }}>AI · GPT</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>

        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", animation: "athlosFade 0.22s ease" }}>
            {m.from === "bot" && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "86%" }}>
                {/* Small avatar beside bot message */}
                <div style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.accent}33`, background: `${C.accent}0f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 2 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={C.accent} stroke="none"/>
                  </svg>
                </div>
                <div style={{ padding: "12px 14px", borderRadius: 16, borderBottomLeftRadius: 4, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: C.display, fontSize: 13, lineHeight: 1.6 }}>
                  {m.t}
                </div>
              </div>
            )}
            {m.from === "user" && (
              <div style={{ maxWidth: "78%", padding: "12px 15px", borderRadius: 16, borderBottomRightRadius: 4, background: C.accent, color: "#000", fontFamily: C.display, fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>
                {m.t}
              </div>
            )}
            <span style={{ fontFamily: C.mono, fontSize: 8, color: C.muted2, marginTop: 3, marginLeft: m.from === "bot" ? 34 : 0, letterSpacing: "0.08em" }}>{m.time}</span>
          </div>
        ))}

        {/* Typing dots */}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, animation: "athlosFade 0.2s ease" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.accent}33`, background: `${C.accent}0f`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accent} stroke="none"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>
            </div>
            <div style={{ padding: "14px 18px", borderRadius: 16, borderBottomLeftRadius: 4, background: C.surface, border: `1px solid ${C.border}`, display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.muted, animation: "athlosDot 1.2s infinite", animationDelay: `${d}s`, display: "block" }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSugg && msgs.length === 1 && !typing && (
          <div style={{ marginTop: 8, animation: "athlosFade 0.35s ease" }}>
            {/* Stats strip */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[{ l: "Recovery", v: "84/100" }, { l: "Spanje", v: "7:42" }, { l: "HRV", v: "72 ms" }].map(({ l, v }) => (
                <div key={l} style={{ flex: 1, padding: "10px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
                  <div style={{ fontFamily: C.mono, fontSize: 8, color: C.muted, letterSpacing: "0.1em", marginBottom: 4 }}>{l.toUpperCase()}</div>
                  <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 15, color: C.accent, letterSpacing: "-0.02em" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 8, color: C.muted, letterSpacing: "0.14em", marginBottom: 8 }}>PREDLAGANA VPRAŠANJA</div>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} style={{
                width: "100%", background: "none", border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "11px 14px", textAlign: "left", cursor: "pointer", marginBottom: 6,
                color: C.text2, fontFamily: C.display, fontSize: 13, lineHeight: 1.4,
                WebkitTapHighlightColor: "transparent",
                transition: "border-color 0.15s, color 0.15s, background 0.15s",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
              }}
              onPointerEnter={(e) => { e.currentTarget.style.borderColor = C.accent + "66"; e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text; }}
              onPointerLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.text2; }}
              >
                <span>{s}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div style={{ flexShrink: 0, padding: "8px 16px 16px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 10px 16px", background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 14 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Vprašaj karkoli..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.text, fontFamily: C.display, fontSize: 13, lineHeight: 1 }}
          />
          <Pressable
            onClick={() => send()}
            scale={0.86}
            disabled={!input.trim() || typing}
            style={{
              width: 34, height: 34, borderRadius: 10, border: "none",
              background: input.trim() && !typing ? C.accent : C.surface2,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <SendIcon color={input.trim() && !typing ? "#000" : C.muted} />
          </Pressable>
        </div>
        <div style={{ textAlign: "center", marginTop: 6 }}>
          <span style={{ fontFamily: C.mono, fontSize: 8, color: C.muted2, letterSpacing: "0.1em" }}>ATHLOS AI · NI NADOMESTILO ZA ZDRAVNIKA</span>
        </div>
      </div>
    </div>
  );
}
