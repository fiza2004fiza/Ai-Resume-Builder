"use client";

import { useRouter } from "next/navigation";

const templates = [
  {
    id: "default",
    name: "Default",
    description: "Clean gold & white professional style",
    preview: { bg: "#fffdf5", accent: "#b8860b", style: "serif" },
    emoji: "✦",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold left border with gold accents",
    preview: { bg: "#ffffff", accent: "#b8860b", style: "sans" },
    emoji: "▎",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Centered timeless traditional layout",
    preview: { bg: "#ffffff", accent: "#333", style: "serif" },
    emoji: "◈",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra clean with lots of whitespace",
    preview: { bg: "#ffffff", accent: "#aaa", style: "sans" },
    emoji: "○",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Dark header with two-column layout",
    preview: { bg: "#1a1a2e", accent: "#b8860b", style: "serif" },
    emoji: "◆",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Dark sidebar with colorful accents",
    preview: { bg: "#2d2d2d", accent: "#b8860b", style: "sans" },
    emoji: "◐",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Terminal-style for developers",
    preview: { bg: "#0d1117", accent: "#b8860b", style: "mono" },
    emoji: "$_",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Centered luxury with decorative dividers",
    preview: { bg: "#ffffff", accent: "#b8860b", style: "serif" },
    emoji: "✿",
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  function selectTemplate(templateId: string) {
    // Store chosen template and go to builder
    localStorage.setItem("selectedTemplate", templateId);
    router.push("/builder");
  }

  const gold = "#b8860b";
  const darkGold = "#8B6914";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fdf8f0 0%, #f5e6c8 100%)", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,248,240,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8d48a", padding: "0 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, ${gold}, #d4a017)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "16px" }}>✦</div>
            <span style={{ fontSize: "20px", fontWeight: 900, color: darkGold, letterSpacing: "-0.5px" }}>ResumeAI</span>
          </div>
          <a href="/" style={{ fontSize: "14px", color: gold, fontWeight: 600, textDecoration: "none" }}>← Back</a>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.7)", border: "1px solid #e0c97a", borderRadius: "25px", padding: "6px 18px", fontSize: "12px", fontWeight: 700, color: gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
            ✦ Step 1 of 2
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 900, color: darkGold, margin: "0 0 16px", letterSpacing: "-1.5px" }}>
            Choose Your Template
          </h1>
          <p style={{ fontSize: "16px", color: "#7a5c00", opacity: 0.8, maxWidth: "480px", margin: "0 auto" }}>
            Pick a style that represents you. You can always switch later.
          </p>
        </div>

        {/* Template Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => selectTemplate(t.id)}
              style={{ cursor: "pointer", borderRadius: "20px", overflow: "hidden", border: "2px solid #e8d48a", background: "rgba(255,252,240,0.85)", transition: "all 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(184,134,11,0.2)";
                (e.currentTarget as HTMLDivElement).style.borderColor = gold;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#e8d48a";
              }}
            >
              {/* Template Preview Card */}
              <div style={{ height: "160px", background: t.preview.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", position: "relative", overflow: "hidden" }}>
                {/* Decorative lines mimicking a resume */}
                <div style={{ width: "100%", maxWidth: "160px" }}>
                  <div style={{ height: "14px", background: t.preview.accent, borderRadius: "3px", marginBottom: "10px", opacity: 0.9 }} />
                  <div style={{ height: "6px", background: t.preview.accent, borderRadius: "3px", marginBottom: "6px", opacity: 0.4, width: "70%" }} />
                  <div style={{ height: "6px", background: t.preview.accent, borderRadius: "3px", marginBottom: "14px", opacity: 0.3, width: "50%" }} />
                  <div style={{ height: "4px", background: t.preview.accent, borderRadius: "2px", marginBottom: "5px", opacity: 0.2 }} />
                  <div style={{ height: "4px", background: t.preview.accent, borderRadius: "2px", marginBottom: "5px", opacity: 0.2, width: "85%" }} />
                  <div style={{ height: "4px", background: t.preview.accent, borderRadius: "2px", opacity: 0.2, width: "60%" }} />
                </div>
                {/* Template name badge */}
                <div style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: `1px solid ${t.preview.accent}`, borderRadius: "8px", padding: "3px 8px", fontSize: "11px", fontWeight: 800, color: t.preview.accent }}>
                  {t.emoji}
                </div>
              </div>

              {/* Template Info */}
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: darkGold, marginBottom: "4px" }}>{t.name}</div>
                <div style={{ fontSize: "12px", color: "#7a5c00", opacity: 0.7, lineHeight: 1.5 }}>{t.description}</div>
                <button style={{ marginTop: "12px", width: "100%", background: `linear-gradient(135deg, ${gold}, #d4a017)`, color: "white", border: "none", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Use This Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}