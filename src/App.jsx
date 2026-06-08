import React, { useState, useEffect, useRef } from "react";
import { ThemeContext, THEMES, DatePickerContext, TimePickerContext } from "./theme";
import { Pressable, Mono, TabButton, SkeletonBlock } from "./components/UI";
import DatePicker from "./components/DatePicker";
import TimePicker from "./components/TimePicker";
import ScreenToday from "./screens/ScreenToday";
import ScreenTrain from "./screens/ScreenTrain";
import ScreenSession from "./screens/ScreenSession";
import ScreenAI from "./screens/ScreenAI";
import ScreenReport from "./screens/ScreenReport";
import ScreenProfile from "./screens/ScreenProfile";
import ScreenSeason from "./screens/ScreenSeason";
import ScreenFuel from "./screens/ScreenFuel";
import ScreenSettings from "./screens/ScreenSettings";
import ScreenPrivacy from "./screens/ScreenPrivacy";
import LoginScreen from "./screens/LoginScreen";
import SetupFlow from "./screens/SetupFlow";
import ConsentScreen from "./screens/ConsentScreen";

const NAV = [
  { id: "today",    label: "DANES",     icon: "today" },
  { id: "train",    label: "TRENING",   icon: "train" },
  { id: "season",   label: "SEZONA",    icon: "season" },
  { id: "ai",       label: "AI",        icon: "ai" },
  { id: "settings", label: "NASTAVITVE",icon: "settings" },
];
const NAV_ORDER = ["today", "train", "season", "ai", "settings"];

function SplashScreen({ C }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 999, animation: "athlosFade 0.4s ease",
    }}>
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.accent}14 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ animation: "logoFloat 2.4s ease-in-out infinite", marginBottom: 20 }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="18" fill={`${C.accent}18`} />
          <rect width="64" height="64" rx="18" stroke={C.accent} strokeWidth="1.5" fill="none" opacity="0.5" />
          <path d="M22 46l10-28 10 28M26 36h12" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 30, letterSpacing: "0.14em", color: C.text }}>
        ATHL<span style={{ color: C.accent }}>OS</span>
      </div>
      <div style={{ fontFamily: C.mono, fontSize: 9, letterSpacing: "0.28em", color: C.muted, marginTop: 8, marginBottom: 40 }}>
        ATHLETE OPERATING SYSTEM
      </div>
      <div style={{ width: 100, height: 2, background: C.surface3, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.accent, borderRadius: 999, boxShadow: `0 0 8px ${C.accent}`, animation: "splashLoad 2.1s cubic-bezier(.4,0,.2,1) forwards" }} />
      </div>
    </div>
  );
}

function ScreenSkeleton({ C }) {
  return (
    <div style={{ padding: "10px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonBlock width={80} height={10} />
          <SkeletonBlock width={180} height={26} radius={10} />
        </div>
        <SkeletonBlock width={42} height={42} radius={21} />
      </div>
      <SkeletonBlock height={130} radius={16} />
      <SkeletonBlock height={120} radius={16} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBlock width={100} height={10} />
        <SkeletonBlock height={72} radius={14} />
        <SkeletonBlock height={72} radius={14} />
        <SkeletonBlock height={72} radius={14} />
      </div>
    </div>
  );
}

export default function AthlosApp() {
  const [splash, setSplash]           = useState(true);
  const [screen, setScreen]           = useState("today");
  const [prevScreen, setPrevScreen]   = useState("settings");
  const [slideDir, setSlideDir]       = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [theme, setTheme]             = useState("dark");
  const C = THEMES[theme];
  const [consented, setConsented]     = useState(false);
  const [registered, setRegistered]   = useState(false);
  const [needsSetup, setNeedsSetup]   = useState(false);
  const [profile, setProfile]         = useState({ name: "NIK", sport: "Nogomet", photo: null });
  const [reminder, setReminder]       = useState(null);
  const [dp, setDp]                   = useState(null);
  const [tp, setTp]                   = useState(null);
  const [pullDist, setPullDist]       = useState(0);
  const [refreshing, setRefreshing]   = useState(false);
  const touchStartY = useRef(0);
  const scrollRef   = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2300);
    return () => clearTimeout(t);
  }, []);

  const navActive = ["train","session"].includes(screen) ? "train"
    : ["report","profile","fuel"].includes(screen) ? "today"
    : screen === "privacy" ? prevScreen
    : screen;

  const go = (s) => {
    const from = NAV_ORDER.indexOf(navActive);
    const to   = NAV_ORDER.indexOf(s);
    if (from !== -1 && to !== -1) setSlideDir(to >= from ? 1 : -1);
    setTransitioning(true);
    setTimeout(() => setTransitioning(false), 280);
    setScreen(s);
  };

  const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchMove  = (e) => {
    if (!scrollRef.current || scrollRef.current.scrollTop > 2) return;
    const dist = e.touches[0].clientY - touchStartY.current;
    if (dist > 0) setPullDist(Math.min(dist * 0.45, 64));
  };
  const onTouchEnd   = () => {
    if (pullDist > 44 && !refreshing) {
      setRefreshing(true);
      setTimeout(() => window.location.reload(), 600);
    } else {
      setPullDist(0);
    }
  };

  const todayWorkout = { title: "Moč · spodnji del", time: "17:00" };
  const fireReminder = (w) => setReminder(w);

  useEffect(() => {
    const check = () => {
      const [h, m] = todayWorkout.time.split(":").map(Number);
      const now = new Date(), start = new Date();
      start.setHours(h, m, 0, 0);
      const mins = (start - now) / 60000;
      if (mins <= 60 && mins > 59 && !reminder) fireReminder(todayWorkout);
    };
    const iv = setInterval(check, 30000);
    check();
    return () => clearInterval(iv);
    // eslint-disable-next-line
  }, [reminder]);

  const render = () => {
    switch (screen) {
      case "today":    return <ScreenToday go={go} profile={profile} />;
      case "train":    return <ScreenTrain go={go} />;
      case "session":  return <ScreenSession go={go} />;
      case "ai":       return <ScreenAI />;
      case "report":   return <ScreenReport go={go} />;
      case "profile":  return <ScreenProfile go={go} profile={profile} setProfile={setProfile} />;
      case "fuel":     return <ScreenFuel profile={profile} />;
      case "settings": return <ScreenSettings profile={profile} setProfile={setProfile} theme={theme} setTheme={setTheme} onPrivacy={() => { setPrevScreen("settings"); setScreen("privacy"); }} onLogout={() => { setRegistered(false); setNeedsSetup(false); setScreen("today"); }} />;
      case "season":   return <ScreenSeason go={go} profile={profile} />;
      case "privacy":  return <ScreenPrivacy onBack={() => setScreen(prevScreen || "settings")} />;
      default:         return <ScreenToday go={go} profile={profile} />;
    }
  };

  const globalStyles = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body, #root { height: 100%; margin: 0; padding: 0; overscroll-behavior: none; }
    body { -webkit-font-smoothing: antialiased; background: ${C.bg}; }
    button { font-family: inherit; }
    input, textarea { font-family: inherit; }
    ::selection { background: rgba(0,255,135,0.25); }

    @keyframes athlosFade {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes athlosScreen {
      from { opacity: 0; transform: translateY(10px) scale(0.99); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(28px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-28px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes navPop {
      0%   { transform: scale(0.5); opacity: 0; }
      65%  { transform: scale(1.12); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes athlosSlideDown {
      from { opacity: 0; transform: translateY(-16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes athlosDot {
      0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
      30%            { opacity: 1;   transform: translateY(-5px); }
    }
    @keyframes logoFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-5px); }
    }
    @keyframes shimmerSlide {
      from { transform: translateX(-100%); }
      to   { transform: translateX(200%); }
    }
    @keyframes rippleExpand {
      from { transform: translate(-50%,-50%) scale(0); opacity: 0.5; }
      to   { transform: translate(-50%,-50%) scale(28); opacity: 0; }
    }
    @keyframes skeletonPulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1; }
    }
    @keyframes splashLoad {
      from { width: 0%; }
      to   { width: 100%; }
    }
    @keyframes spinCW {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .athlos-scroll::-webkit-scrollbar { display: none; }
    .athlos-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-behavior: smooth; }

    /* Prevent iOS zoom on input focus — must be font-size >= 16px */
    input, textarea, select { font-size: 16px !important; touch-action: manipulation; }

    /* Prevent double-tap zoom on buttons */
    button { touch-action: manipulation; }

    .btn-shimmer { position: relative; overflow: hidden; }
    .btn-shimmer::after {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
      transform: translateX(-100%);
    }
    .btn-shimmer:hover::after { animation: shimmerSlide 0.55s ease; }
  `;

  return (
    <ThemeContext.Provider value={C}>
    <DatePickerContext.Provider value={setDp}>
    <TimePickerContext.Provider value={setTp}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
      <style>{globalStyles}</style>

      {/* ── SPLASH ── */}
      {splash && <SplashScreen C={C} />}

      {/* ── LOGIN ── */}
      {!splash && !registered && !needsSetup && (
        <LoginScreen onLogin={() => setNeedsSetup(true)} onPrivacy={() => setScreen("privacy")} />
      )}

      {/* ── SETUP ── */}
      {!splash && needsSetup && (
        <SetupFlow onDone={(info) => {
          setProfile(p => ({ ...p, name: info.username, birth: info.birth, height: info.height, weight: info.weight, sport: info.sport || p.sport }));
          setNeedsSetup(false);
          setRegistered(true);
        }} />
      )}

      {/* ── CONSENT ── */}
      {!splash && registered && !needsSetup && !consented && (
        <ConsentScreen onAccept={() => setConsented(true)} onReject={() => setConsented(true)} />
      )}

      {/* ── MAIN APP ── */}
      {!splash && registered && !needsSetup && consented && (
        <div style={{
          position: "fixed", inset: 0,
          background: C.bg,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          isolation: "isolate",
        }}>
          {/* Safe area top spacer */}
          <div style={{ height: "env(safe-area-inset-top, 0px)", flexShrink: 0 }} />


          {/* Reminder banner */}
          {reminder && (
            <div style={{ margin: "0 14px 6px", padding: "12px 14px", borderRadius: 16, background: `${C.accent}18`, border: `1px solid ${C.accent}60`, display: "flex", alignItems: "center", gap: 12, animation: "athlosSlideDown 0.35s cubic-bezier(.2,.8,.2,1)", flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M12 2h0M5 3L2 6M19 3l3 3"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 13, color: C.text, letterSpacing: "0.04em" }}>Trening čez 1 uro</div>
                <Mono style={{ color: C.muted, fontSize: 9 }}>{reminder.title} · {reminder.time}</Mono>
              </div>
              <button onClick={() => setReminder(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", padding: "2px 6px", lineHeight: 1 }}>×</button>
            </div>
          )}

          {/* Pull-to-refresh */}
          {(pullDist > 0 || refreshing) && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: Math.max(pullDist, refreshing ? 40 : 0), overflow: "hidden", transition: "height 0.2s", flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${C.accent}`, borderTopColor: "transparent", animation: "spinCW 0.7s linear infinite", opacity: refreshing ? 1 : pullDist / 64 }} />
            </div>
          )}

          {/* Screen content — full height, padded bottom so content clears the floating nav */}
          <div
            ref={scrollRef}
            key={screen}
            className="athlos-scroll"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              flex: 1, overflowY: "auto",
              paddingBottom: "calc(80px + env(safe-area-inset-bottom, 12px))",
              animation: `${slideDir >= 0 ? "slideInRight" : "slideInLeft"} 0.26s cubic-bezier(.2,.8,.2,1)`,
            }}
          >
            {transitioning ? <ScreenSkeleton C={C} /> : render()}
          </div>

          {/* Tab bar — truly floating pill, absolutely positioned */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            padding: "8px 16px",
            paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)",
            background: `linear-gradient(to bottom, transparent 0%, ${C.bg} 38%)`,
            pointerEvents: "none",
          }}>
            <nav style={{
              display: "flex", justifyContent: "space-around", alignItems: "center",
              padding: "6px 4px",
              background: theme === "dark" ? "rgba(18,18,18,0.96)" : "rgba(240,241,241,0.96)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderRadius: 999,
              boxShadow: theme === "dark"
                ? "0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: `1px solid ${C.border}`,
              pointerEvents: "auto",
            }}>
              {NAV.map(n => {
                const active = navActive === n.id;
                return <TabButton key={n.id} n={n} active={active} onClick={() => go(n.id)} />;
              })}
            </nav>
          </div>

          {/* Pickers */}
          {dp && <DatePicker value={dp.value} onChange={v => { dp.onChange(v); setDp(null); }} onClose={() => setDp(null)} futureDays={dp.futureDays} />}
          {tp && <TimePicker value={tp.value} onChange={v => { tp.onChange(v); setTp(null); }} onClose={() => setTp(null)} />}
        </div>
      )}

    </TimePickerContext.Provider>
    </DatePickerContext.Provider>
    </ThemeContext.Provider>
  );
}
