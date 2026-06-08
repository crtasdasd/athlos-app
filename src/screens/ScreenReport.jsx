import React from "react";
import { useTheme } from "../theme";
import { Mono, Kicker, Pill, BackBtn } from "../components/UI";

export default function ScreenReport({ go }) {
  const C = useTheme();
  return (
    <div style={{ padding: "8px 20px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <BackBtn onClick={() => go("today")} />
        <Mono style={{ color: C.accent }}>● DNEVNO POROČILO</Mono>
      </header>

      <div style={{ border: `1px solid ${C.accent}40`, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", marginBottom: 22, fontFamily: C.mono, fontSize: 12 }}>
        <span style={{ color: C.muted }}>POTEČE ČEZ</span>
        <span style={{ color: C.accent }}>11:04:35</span>
      </div>

      <Kicker color={C.muted}>TRENING #14</Kicker>
      <h2 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 32, textTransform: "uppercase", margin: "0 0 22px", letterSpacing: "-0.02em", color: C.text }}>MOČ · SPODNJI DEL</h2>

      <Mono style={{ color: C.muted, fontSize: 10 }}>SKUPNA OCENA</Mono>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, margin: "8px 0 22px" }}>
        <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 64, lineHeight: 0.8, color: C.accent }}>92</div>
        <div style={{ paddingBottom: 6 }}>
          <span style={{ color: C.muted, fontFamily: C.display, fontWeight: 700 }}>/100</span>
          <div style={{ color: C.accent, fontFamily: C.mono, fontSize: 12, marginTop: 4 }}>ODLIČNO</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
        {[["8.6", "T", "VOLUMEN", "+0.5T"], ["7.2", "", "POVP. RPE", "OPTIMALNO"], ["100", "%", "IZVEDBA", "7/7 VAJ"]].map(([v, u, l, s], i) => (
          <div key={i} style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 10px", textAlign: "center" }}>
            <Mono style={{ color: C.muted, fontSize: 8 }}>{l}</Mono>
            <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 26, color: C.accent, margin: "6px 0 4px" }}>{v}<span style={{ fontSize: 13 }}>{u}</span></div>
            <Mono style={{ color: C.muted, fontSize: 8 }}>{s}</Mono>
          </div>
        ))}
      </div>

      <div style={{ background: `${C.accent}0a`, border: `1px solid ${C.accent}2e`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: C.accent }}>⚡</span>
          <Mono style={{ color: C.accent }}>AI ANALIZA</Mono>
        </div>
        <p style={{ margin: 0, color: C.text2, fontSize: 14, lineHeight: 1.6 }}>Močan trening. Povečaj breme za 2.5 kg na počepu naslednji teden. Tehnika je stabilna — idealen čas za napredovanje.</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <Pill fill>+5KG / TEDEN</Pill>
          <Pill>TEHNIKA STABILNA</Pill>
          <Pill>FOKUS: HITROST</Pill>
        </div>
      </div>
    </div>
  );
}
