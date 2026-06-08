import React, { useState } from "react";
import { useTheme } from "../theme";
import { Pressable, Mono, Kicker, PrimaryBtn, BackBtn } from "../components/UI";

export const SPORTS = [
  "Nogomet", "Košarka", "Odbojka", "Rokomet", "Hokej", "Ragbi", "Ameriški nogomet", "Bejzbol", "Kriket",
  "Tenis", "Badminton", "Namizni tenis", "Squash",
  "Tek / Atletika", "Maraton", "Sprint", "Triatlon", "Duatlon",
  "Plavanje", "Vaterpolo", "Sinhronizovano plavanje",
  "Kolesarstvo", "Gorsko kolesarstvo", "BMX",
  "Fitnes / Moč", "Dviganje uteži", "Powerlifting", "Bodybuilding", "CrossFit", "Kettlebell",
  "Boks", "MMA", "Kickboks", "Muay Thai", "Judo", "Karate", "Taekwondo", "Rokoborba", "Brazilski jiu-jitsu", "Aikido", "Sabljanje",
  "Gimnastika", "Ritmična gimnastika", "Akrobatika", "Parkour",
  "Plezanje", "Skalno plezanje", "Bouldering",
  "Smučanje", "Snowboard", "Biatlon", "Tek na smučeh", "Drsanje", "Hokej na ledu",
  "Surf", "Wakeboard", "Kite surf", "Veslanje", "Kajak / Kanu",
  "Golf", "Lokostrelstvo", "Strelstvo",
  "Konjeniški šport", "Skejtanje",
  "Ples / Hip-hop", "Ples / Latinski", "Ples / Balet",
  "Joga", "Pilates",
  "Drugo",
];

export default function ScreenProfile({ go, profile, setProfile }) {
  const C = useTheme();
  const fileRef = React.useRef(null);
  const [name, setName] = useState(profile.name);
  const known = SPORTS.includes(profile.sport);
  const [sport, setSport] = useState(known ? profile.sport : "Drugo");
  const [customSport, setCustomSport] = useState(known ? "" : profile.sport);
  const [photo, setPhoto] = useState(profile.photo);
  const [pickSport, setPickSport] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };

  const save = () => {
    const finalSport = sport === "Drugo" ? (customSport.trim() || "Drugo") : sport;
    setProfile({ name: name.trim() || "Športnik", sport: finalSport, photo });
    go("today");
  };

  return (
    <div style={{ padding: "8px 20px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
        <BackBtn onClick={() => go("today")} />
        <Kicker>MOJ PROFIL</Kicker>
      </header>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 30 }}>
        <Pressable onClick={() => fileRef.current && fileRef.current.click()} scale={0.94} style={{ position: "relative", width: 110, height: 110, borderRadius: "50%", border: `1px solid ${C.border2}`, background: C.surface2, padding: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontWeight: 900, fontSize: 42, fontFamily: C.display }}>
          {photo
            ? <img src={photo} alt="profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : initial}
          <span style={{ position: "absolute", bottom: 4, right: 4, width: 30, height: 30, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}` }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </span>
        </Pressable>
        <div style={{ display: "flex", gap: 10 }}>
          <Pressable onClick={() => fileRef.current && fileRef.current.click()} scale={0.96} style={{ padding: "9px 16px", borderRadius: 999, border: `1px solid ${C.border2}`, background: "none", color: C.text, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>Naloži sliko</Pressable>
          {photo && (
            <Pressable onClick={() => setPhoto(null)} scale={0.96} style={{ padding: "9px 16px", borderRadius: 999, border: `1px solid ${C.border}`, background: "none", color: C.muted, fontFamily: C.mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}>Odstrani</Pressable>
          )}
        </div>
      </div>

      <Mono style={{ color: C.muted, fontSize: 10 }}>IME</Mono>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tvoje ime"
        style={{ width: "100%", marginTop: 8, marginBottom: 22, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 16, outline: "none", boxSizing: "border-box" }}
      />

      <Mono style={{ color: C.muted, fontSize: 10 }}>ŠPORT</Mono>
      <Pressable onClick={() => setPickSport((v) => !v)} scale={0.99} style={{ width: "100%", marginTop: 8, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 16, display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        {sport}
        <span style={{ color: C.muted, transition: "transform 0.2s", transform: pickSport ? "rotate(180deg)" : "none" }}>▾</span>
      </Pressable>
      {pickSport && (
        <div style={{ marginTop: 8, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", animation: "athlosFade 0.2s ease" }}>
          {SPORTS.map((s, i) => (
            <button key={i} onClick={() => { setSport(s); setPickSport(false); }}
              style={{ width: "100%", textAlign: "left", padding: "13px 16px", background: s === sport ? `${C.accent}14` : "transparent", border: "none", borderBottom: i < SPORTS.length - 1 ? `1px solid ${C.border}` : "none", color: s === sport ? C.accent : C.text2, fontFamily: C.display, fontWeight: 600, fontSize: 15, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {sport === "Drugo" && (
        <div style={{ animation: "athlosFade 0.2s ease" }}>
          <Mono style={{ color: C.muted, fontSize: 10, display: "block", marginTop: 16 }}>VPIŠI ŠPORT</Mono>
          <input
            value={customSport}
            onChange={(e) => setCustomSport(e.target.value)}
            placeholder="npr. Odbojka, Judo, Veslanje..."
            autoFocus
            style={{ width: "100%", marginTop: 8, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 16, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      )}

      <PrimaryBtn onClick={save} style={{ marginTop: 30 }}>Shrani profil</PrimaryBtn>
    </div>
  );
}
