import React, { useState } from "react";
import { useTheme, LANDING_URL } from "../theme";
import { Pressable, Mono, Kicker, SettingsBlock } from "../components/UI";

const PLANS = [
  {
    id: "basic",
    name: "BASIC",
    earlyBird: "€29",
    regular: "€49",
    color: "#60A5FA",
    features: [
      "AI program + jedilnik",
      "Zasebni sezonski koledar",
      "AI asistent 24/7",
      "Dnevni log + history",
      "Community (opcijsko)",
    ],
    notIncluded: ["Daily Performance Report","Biometrija Apple Health","Video analiza","Post-match recovery","Tedna AI analiza","Ekskluzivni content","Early access"],
  },
  {
    id: "pro",
    name: "PRO",
    earlyBird: "€59",
    regular: "€99",
    color: "#863bff",
    badge: "PRILJUBLJEN",
    features: [
      "AI program + jedilnik",
      "Zasebni sezonski koledar",
      "AI asistent 24/7",
      "Dnevni log + history",
      "Community (opcijsko)",
      "Daily Performance Report",
      "Biometrija Apple Health",
      "Video analiza · 10/mes",
      "Post-match recovery",
    ],
    notIncluded: ["Tedna AI analiza","Ekskluzivni content (Tim)","Early access novih funkcij"],
  },
  {
    id: "elite",
    name: "ELITE",
    earlyBird: "€89",
    regular: "€149",
    color: "#FFB800",
    badge: "OPCIJSKO",
    features: [
      "Vse iz PRO plana",
      "Tedna AI analiza napredka",
      "Ekskluzivni content (Tim)",
      "Early access novih funkcij",
      "Video analiza · Neomejeno",
      "Post-match recovery",
    ],
    notIncluded: [],
    note: "Elite je opcijsko — se potrjuje.",
  },
];

const FAQ_ITEMS = [
  { q: "Kako dodam nov trening?", a: "Pojdi na zavihek Trening, pritisni 'Začni trening' in sledi navodilom. Aplikacija te vodi skozi vsako vajo." },
  { q: "Kako deluje regeneracijski score?", a: "Score temelji na tvojih podatkih o spanju, HRV in srčnem utripu v mirovanju. Višji score pomeni boljšo pripravljenost za trening." },
  { q: "Ali so moji podatki varni?", a: "Vsi podatki so shranjeni lokalno na tvojem telefonu. Nič ni poslano na strežnike brez tvoje privolitve." },
  { q: "Kako sinhroniziram z uro?", a: "Trenutno podpiramo Apple Watch in Garmin. Pojdi v Nastavitve → Naprave in sledni navodilom za povezavo." },
  { q: "Kako spremenem cilj sezone?", a: "Odpri zavihek Sezona, pritisni na cilj in ga uredi. Aplikacija samodejno prilagodi tvoj program." },
  { q: "Zakaj ne vidim napredka?", a: "Napredek se izračuna po vsaj 2 tednih rednega beleženja. Poskrbi, da redno vnaša treninge in spanje." },
];

export default function ScreenSettings({ profile, setProfile, theme, setTheme, onPrivacy, onLogout }) {
  const C = useTheme();
  const fileRef = React.useRef(null);
  const [name, setName] = useState(profile.name);
  const [editingName, setEditingName] = useState(false);

  // Password change
  const [changingPw, setChangingPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // Plan
  const [currentPlan, setCurrentPlan] = useState("basic");
  const [planSuccess, setPlanSuccess] = useState("");

  const upgradePlan = (id) => {
    setCurrentPlan(id);
    setPlanSuccess(id);
    setTimeout(() => setPlanSuccess(""), 2000);
  };

  // FAQ
  const [openFaq, setOpenFaq] = useState(null);

  // Contact
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const initial = (name || "?").trim().charAt(0).toUpperCase();

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(f);
  };

  const saveName = () => {
    setProfile((p) => ({ ...p, name: name.trim() || "Športnik" }));
    setEditingName(false);
  };

  const savePassword = () => {
    if (!oldPw || !newPw) { setPwMsg("Izpolni oba polja."); return; }
    if (newPw.length < 6) { setPwMsg("Novo geslo mora imeti vsaj 6 znakov."); return; }
    setPwMsg("✓ Geslo uspešno posodobljeno.");
    setTimeout(() => { setChangingPw(false); setOldPw(""); setNewPw(""); setPwMsg(""); }, 1800);
  };

  const sendContact = () => {
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setTimeout(() => { setContactOpen(false); setContactMsg(""); setContactSent(false); }, 2000);
  };

  const row = { display: "flex", justifyContent: "space-between", alignItems: "center" };
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 600, fontSize: 15, outline: "none", boxSizing: "border-box", colorScheme: "dark", marginTop: 8 };

  return (
    <div style={{ padding: "8px 20px 40px" }}>
      <header style={{ marginBottom: 20 }}>
        <Kicker>ATHLOS</Kicker>
        <h2 style={{ fontFamily: C.display, fontWeight: 900, fontSize: 26, textTransform: "uppercase", margin: 0, color: C.text }}>NASTAVITVE</h2>
      </header>

      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />

      {/* Profile row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
        <Pressable onClick={() => fileRef.current && fileRef.current.click()} scale={0.94} style={{ position: "relative", width: 64, height: 64, borderRadius: "50%", border: `1px solid ${C.border2}`, background: C.surface2, padding: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontWeight: 900, fontSize: 26, fontFamily: C.display, flexShrink: 0 }}>
          {profile.photo ? <img src={profile.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initial}
          <span style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: C.accent, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.bg}` }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </span>
        </Pressable>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: C.display, fontWeight: 800, fontSize: 18, color: C.text }}>{profile.name}</div>
          <Mono style={{ color: C.muted, fontSize: 9 }}>{profile.sport || "—"}</Mono>
        </div>
        <Pressable onClick={() => fileRef.current && fileRef.current.click()} scale={0.95} style={{ padding: "8px 14px", borderRadius: 999, border: `1px solid ${C.border2}`, background: "none", color: C.text, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Slika</Pressable>
      </div>

      {/* Username */}
      <SettingsBlock title="UPORABNIŠKO IME">
        {!editingName ? (
          <div style={row}>
            <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 15, color: C.text }}>{profile.name}</span>
            <Pressable onClick={() => { setName(profile.name); setEditingName(true); }} scale={0.95} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: "none", color: C.accent, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Uredi</Pressable>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: C.surface, color: C.text, fontFamily: C.display, fontWeight: 600, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            <Pressable onClick={saveName} scale={0.93} style={{ padding: "0 18px", borderRadius: 10, border: "none", background: C.accent, color: "#000", fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Shrani</Pressable>
          </div>
        )}
      </SettingsBlock>

      {/* Theme */}
      <SettingsBlock title="TEMA">
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setTheme("dark")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", border: `1px solid ${theme === "dark" ? C.accent : C.border2}`, background: theme === "dark" ? `${C.accent}1f` : "transparent", color: theme === "dark" ? C.accent : C.muted, fontFamily: C.display, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            Temna
          </button>
          <button onClick={() => setTheme("light")} style={{ flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer", border: `1px solid ${theme === "light" ? C.accent : C.border2}`, background: theme === "light" ? `${C.accent}1f` : "transparent", color: theme === "light" ? C.accent : C.muted, fontFamily: C.display, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, WebkitTapHighlightColor: "transparent" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
            Svetla
          </button>
        </div>
      </SettingsBlock>

      {/* Password */}
      <SettingsBlock title="GESLO">
        {!changingPw ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={row}>
              <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text }}>Spremeni geslo</span>
              <Pressable onClick={() => setChangingPw(true)} scale={0.95} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: "none", color: C.accent, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Uredi</Pressable>
            </div>
            <div style={{ width: "100%", height: 1, background: C.border }} />
            <div style={row}>
              <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text2 }}>Pozabljeno geslo?</span>
              <Pressable onClick={() => window.open(LANDING_URL, "_blank", "noopener,noreferrer")} scale={0.95} style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border2}`, background: "none", color: C.accent, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}>Ponastavi</Pressable>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Mono style={{ color: C.muted, fontSize: 9 }}>TRENUTNO GESLO</Mono>
            <input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="••••••••" style={inp} />
            <Mono style={{ color: C.muted, fontSize: 9, marginTop: 4 }}>NOVO GESLO</Mono>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" style={inp} />
            {pwMsg && (
              <div style={{ padding: "10px 12px", borderRadius: 10, background: pwMsg.startsWith("✓") ? `${C.accent}14` : `${C.red}14`, border: `1px solid ${pwMsg.startsWith("✓") ? C.accent : C.red}40`, color: pwMsg.startsWith("✓") ? C.accent : C.red, fontFamily: C.display, fontSize: 12, marginTop: 4 }}>{pwMsg}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => { setChangingPw(false); setOldPw(""); setNewPw(""); setPwMsg(""); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.border2}`, background: "transparent", color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 13, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Prekliči</button>
              <button onClick={savePassword} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.accent, color: "#000", fontFamily: C.display, fontWeight: 900, fontSize: 13, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Shrani geslo</button>
            </div>
          </div>
        )}
      </SettingsBlock>

      {/* Plan */}
      <SettingsBlock title="MOJ PLAN">
        {/* Current plan badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 14, color: C.text }}>Trenutni plan</div>
            <Mono style={{ color: C.muted, fontSize: 8, marginTop: 2 }}>EARLY BIRD CENA AKTIVNA</Mono>
          </div>
          <div style={{ padding: "5px 12px", borderRadius: 999, background: `${PLANS.find(p=>p.id===currentPlan).color}20`, border: `1px solid ${PLANS.find(p=>p.id===currentPlan).color}50` }}>
            <Mono style={{ color: PLANS.find(p=>p.id===currentPlan).color, fontSize: 9 }}>{currentPlan.toUpperCase()}</Mono>
          </div>
        </div>

        {planSuccess && (
          <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 12, background: `${C.accent}14`, border: `1px solid ${C.accent}40`, animation: "athlosFade 0.2s ease" }}>
            <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 13, color: C.accent }}>✓ Plan posodobljen na {planSuccess.toUpperCase()}!</div>
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLANS.map((plan) => {
            const active = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  borderRadius: 16, overflow: "hidden",
                  border: `1.5px solid ${active ? plan.color : C.border}`,
                  background: active ? `${plan.color}08` : C.surface,
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                {/* Card header */}
                <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontFamily: C.display, fontWeight: 900, fontSize: 17, color: plan.color, letterSpacing: "0.02em" }}>{plan.name}</div>
                      {plan.badge && (
                        <div style={{ padding: "2px 8px", borderRadius: 999, background: `${plan.color}20`, border: `1px solid ${plan.color}40` }}>
                          <Mono style={{ color: plan.color, fontSize: 7 }}>{plan.badge}</Mono>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontFamily: C.display, fontWeight: 900, fontSize: 22, color: C.text, letterSpacing: "-0.03em" }}>{plan.earlyBird}</span>
                      <span style={{ fontFamily: C.display, fontSize: 11, color: C.muted }}>/mes · early bird</span>
                    </div>
                    <Mono style={{ color: C.muted, fontSize: 8, marginTop: 2 }}>Redna cena: {plan.regular}/mes</Mono>
                  </div>
                  {active ? (
                    <div style={{ padding: "7px 14px", borderRadius: 999, background: `${plan.color}18`, border: `1px solid ${plan.color}50` }}>
                      <Mono style={{ color: plan.color, fontSize: 8 }}>AKTIVEN</Mono>
                    </div>
                  ) : (
                    <Pressable
                      onClick={() => upgradePlan(plan.id)}
                      scale={0.94}
                      style={{ padding: "7px 14px", borderRadius: 999, border: "none", background: plan.color, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
                    >
                      <Mono style={{ color: "#000", fontSize: 8, fontWeight: 700 }}>IZBERI</Mono>
                    </Pressable>
                  )}
                </div>

                {/* Features */}
                <div style={{ padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="6" fill={`${plan.color}20`}/>
                        <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke={plan.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: C.display, fontSize: 12, color: C.text2 }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.slice(0,2).map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="6" fill={`${C.muted}15`}/>
                        <path d="M4 4l4 4M8 4l-4 4" stroke={C.muted} strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      <span style={{ fontFamily: C.display, fontSize: 12, color: C.muted, textDecoration: "line-through", textDecorationColor: `${C.muted}60` }}>{f}</span>
                    </div>
                  ))}
                  {plan.note && <Mono style={{ color: C.muted, fontSize: 8, marginTop: 4 }}>{plan.note}</Mono>}
                </div>
              </div>
            );
          })}
        </div>
        <Mono style={{ color: C.muted, fontSize: 8, marginTop: 10, textAlign: "center" }}>Cene se lahko spremenijo pred launchom · Early bird cena zagotovljena ob vpisu</Mono>
      </SettingsBlock>

      {/* FAQ */}
      <SettingsBlock title="POMOČ">
        {!openFaq ? (
          <Pressable
            onClick={() => setOpenFaq(true)}
            scale={0.99}
            style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0 }}
          >
            <div>
              <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text }}>Pogosta vprašanja</span>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginTop: 3 }}>{FAQ_ITEMS.length} VPRAŠANJ IN ODGOVOROV</div>
            </div>
            <span style={{ color: C.muted, fontSize: 18 }}>›</span>
          </Pressable>
        ) : (
          <div style={{ animation: "athlosFade 0.2s ease" }}>
            <Pressable
              onClick={() => { setOpenFaq(null); }}
              scale={0.99}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: "0 0 14px", cursor: "pointer" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              <Mono style={{ color: C.muted, fontSize: 9 }}>ZAPRI</Mono>
            </Pressable>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i}>
                  <Pressable
                    onClick={() => setOpenFaq(openFaq === i ? true : i)}
                    scale={0.99}
                    style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "11px 0", gap: 12 }}
                  >
                    <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text, flex: 1 }}>{item.q}</span>
                    <span style={{ color: C.muted, fontSize: 16, transition: "transform 0.2s", transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0 }}>›</span>
                  </Pressable>
                  {openFaq === i && (
                    <div style={{ padding: "0 0 12px", animation: "athlosFade 0.2s ease" }}>
                      <p style={{ fontFamily: C.display, fontSize: 13, color: C.text2, lineHeight: 1.6, margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                  {i < FAQ_ITEMS.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </SettingsBlock>

      {/* Contact */}
      <SettingsBlock title="KONTAKTIRAJ OSEBJE">
        {!contactOpen ? (
          <Pressable
            onClick={() => setContactOpen(true)}
            scale={0.99}
            style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0 }}
          >
            <div>
              <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text }}>Pošlji sporočilo</span>
              <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginTop: 3 }}>ODGOVORIMO V 24 URAH</div>
            </div>
            <span style={{ color: C.muted, fontSize: 18 }}>›</span>
          </Pressable>
        ) : contactSent ? (
          <div style={{ padding: "16px", borderRadius: 12, background: `${C.accent}14`, border: `1px solid ${C.accent}40`, textAlign: "center", animation: "athlosFade 0.2s ease" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: C.display, fontWeight: 700, fontSize: 14, color: C.accent }}>Sporočilo poslano!</div>
            <div style={{ fontFamily: C.display, fontSize: 12, color: C.text2, marginTop: 4 }}>Odgovorili vam bomo v 24 urah.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "athlosFade 0.2s ease" }}>
            <Mono style={{ color: C.muted, fontSize: 9 }}>VAŠE SPOROČILO</Mono>
            <textarea
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              placeholder="Opišite vašo težavo ali vprašanje..."
              rows={4}
              style={{ ...inp, resize: "none", lineHeight: 1.5 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => { setContactOpen(false); setContactMsg(""); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.border2}`, background: "transparent", color: C.text, fontFamily: C.display, fontWeight: 700, fontSize: 13, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}>Prekliči</button>
              <button onClick={sendContact} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: C.accent, color: "#000", fontFamily: C.display, fontWeight: 900, fontSize: 13, cursor: "pointer", WebkitTapHighlightColor: "transparent", opacity: contactMsg.trim() ? 1 : 0.4 }}>Pošlji</button>
            </div>
          </div>
        )}
      </SettingsBlock>

      {/* Legal */}
      <SettingsBlock title="PRAVNO">
        <Pressable onClick={onPrivacy} scale={0.99} style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0 }}>
          <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text }}>Politika zasebnosti</span>
          <span style={{ color: C.muted, fontSize: 18 }}>›</span>
        </Pressable>
      </SettingsBlock>

      {/* Website */}
      <SettingsBlock title="SPLETNA STRAN">
        <Pressable onClick={() => window.open(LANDING_URL, "_blank", "noopener,noreferrer")} scale={0.99} style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: 0 }}>
          <div>
            <span style={{ fontFamily: C.display, fontWeight: 600, fontSize: 14, color: C.text }}>athlos-sync-flow.lovable.app</span>
            <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em", marginTop: 3 }}>ODPRE V BRSKALNIKU</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </Pressable>
      </SettingsBlock>

      <Pressable onClick={onLogout} scale={0.98} style={{ width: "100%", marginTop: 20, padding: 15, borderRadius: 12, border: `1px solid ${C.red}40`, background: `${C.red}14`, color: C.red, fontFamily: C.display, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 13 }}>Odjava</Pressable>
      <p style={{ textAlign: "center", color: C.muted2, fontFamily: C.mono, fontSize: 9, letterSpacing: "0.1em", marginTop: 20 }}>ATHLOS v0.6 · © 2026</p>
    </div>
  );
}
