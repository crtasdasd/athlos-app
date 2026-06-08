import React, { useState } from "react";
import { useTheme, LOGO, LANDING_URL } from "../theme";
import { Mono, PrimaryBtn } from "../components/UI";

function SocialBtn({ onClick, children, style }) {
  const C = useTheme();
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "13px 10px", borderRadius: 12,
        border: `1px solid ${C.border2}`, background: C.surface,
        color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 13,
        cursor: "pointer", WebkitTapHighlightColor: "transparent",
        transition: "border-color 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default function LoginScreen({ onLogin, onPrivacy }) {
  const C = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = () => {
    if (!email.includes("@") || password.length < 1) {
      setError("Vnesi veljaven e-naslov in geslo.");
      return;
    }
    setError("");
    onLogin();
  };

  const inp = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: `1px solid ${C.border2}`, background: C.surface,
    color: C.text, fontFamily: C.display, fontWeight: 600,
    fontSize: 15, outline: "none", boxSizing: "border-box",
    marginTop: 8, colorScheme: "dark",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: C.bg,
      display: "flex", flexDirection: "column",
      paddingTop: "env(safe-area-inset-top, 44px)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      overflowY: "auto",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px 32px" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
          {LOGO
            ? <img src={LOGO} alt="ATHLOS" style={{ width: 78, height: 78, borderRadius: 22, marginBottom: 20, boxShadow: `0 0 40px ${C.accent}50, 0 8px 24px rgba(0,0,0,0.4)` }} />
            : (
              <div style={{ width: 78, height: 78, borderRadius: 22, background: `${C.accent}18`, border: `1px solid ${C.accent}40`, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 64 64" fill="none">
                  <path d="M22 46l10-28 10 28M26 36h12" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )
          }
          <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 32, letterSpacing: "0.08em", color: C.text }}>ATHL<span style={{ color: C.accent }}>OS</span></div>
          <Mono style={{ color: C.muted, fontSize: 8, marginTop: 8, textAlign: "center", letterSpacing: "0.2em" }}>THE SYSTEM THAT KNOWS EVERY ATHLETE</Mono>
        </div>

        {/* Social login */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <SocialBtn onClick={onLogin}>
            {/* Apple icon */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple
          </SocialBtn>
          <SocialBtn onClick={onLogin}>
            {/* Google icon */}
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </SocialBtn>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <Mono style={{ color: C.muted, fontSize: 9 }}>ALI</Mono>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 8 }}>
          <Mono style={{ color: C.muted, fontSize: 9 }}>E-POŠTA</Mono>
          <input
            type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="ime@email.com"
            autoComplete="email"
            style={inp}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 4, position: "relative" }}>
          <Mono style={{ color: C.muted, fontSize: 9 }}>GESLO</Mono>
          <input
            type={showPass ? "text" : "password"} value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="••••••••"
            autoComplete="current-password"
            style={{ ...inp, paddingRight: 44 }}
          />
          <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 12, bottom: 14, background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 4, lineHeight: 0 }}>
            {showPass
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10 10 0 0112 20c-7 0-11-8-11-8a18.1 18.1 0 015.06-5.94M9.9 4.24A9 9 0 0112 4c7 0 11 8 11 8a18.1 18.1 0 01-2.14 2.86M1 1l22 22"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>

        {error && (
          <div style={{ color: C.red, fontSize: 12, marginTop: 8, fontFamily: C.display, padding: "10px 12px", borderRadius: 10, background: `${C.red}14`, border: `1px solid ${C.red}40` }}>
            {error}
          </div>
        )}

        <button onClick={() => window.open(LANDING_URL, "_blank", "noopener,noreferrer")} style={{ background: "none", border: "none", color: C.muted, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "right", cursor: "pointer", marginTop: 10, padding: 0 }}>
          Pozabljeno geslo?
        </button>

        <PrimaryBtn onClick={submit} style={{ marginTop: 20 }}>Prijava</PrimaryBtn>

        <p style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 20, fontFamily: C.display, lineHeight: 1.5 }}>
          Še nimaš računa?{" "}
          <button onClick={() => window.open(LANDING_URL, "_blank", "noopener,noreferrer")} style={{ background: "none", border: "none", padding: 0, color: C.accent, fontWeight: 700, fontFamily: C.display, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
            Registracija
          </button>
        </p>

        <button onClick={onPrivacy} style={{ background: "none", border: "none", color: C.muted2, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", marginTop: 14, padding: 0, textAlign: "center", width: "100%" }}>
          Politika zasebnosti
        </button>
      </div>
    </div>
  );
}
