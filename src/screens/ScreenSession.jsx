import React from "react";
import { useTheme } from "../theme";
import { Mono, Kicker, PrimaryBtn, BackBtn } from "../components/UI";

export default function ScreenSession({ go }) {
  const C = useTheme();
  return (
    <div style={{ padding: "8px 20px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <BackBtn onClick={() => go("train")} />
        <div>
          <Kicker>TRENING V ŽIVO</Kicker>
          <h2 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 24, textTransform: "uppercase", margin: 0, color: C.text }}>POČEP — SET 3/5</h2>
        </div>
      </header>

      <button style={{ width: "100%", height: 180, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18, cursor: "pointer" }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", border: `1px solid ${C.accent}`, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          📷
        </div>
        <Mono style={{ color: C.muted }}>POSNEMI SET ZA VBT</Mono>
      </button>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <Mono style={{ color: C.muted }}>SET 3 OD 5</Mono>
          <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: 14, color: C.text }}>CILJ 82.5 KG ✓</span>
        </div>
        {[["TEŽA", "82.5 KG", 72], ["PONOVITVE", "3", 50], ["RPE", "7.5", 78]].map(([l, v, w], i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <Mono style={{ color: C.muted, fontSize: 10 }}>{l}</Mono>
              <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: 13, color: C.text }}>{v}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: C.surface3 }}>
              <div style={{ width: `${w}%`, height: "100%", borderRadius: 3, background: C.accent }} />
            </div>
          </div>
        ))}
        <PrimaryBtn style={{ marginTop: 8 }}>ZABELEŽI SET</PrimaryBtn>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 16, background: `${C.accent}0d`, border: `1px solid ${C.accent}2e`, borderRadius: 12 }}>
        <Mono style={{ color: C.accent }}>AI</Mono>
        <span style={{ color: C.text2, fontSize: 13, lineHeight: 1.5 }}>Padec hitrosti je pod 12%. Nadaljuj normalno — tehnika je stabilna.</span>
      </div>
    </div>
  );
}
