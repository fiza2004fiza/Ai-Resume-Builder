"use client";

import { useEffect, useState } from "react";
import type { Resume } from "@/lib/supabase";
import ResumePreview from "@/components/resume/ResumePreview";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Resume | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/save-resume");
        const data = await res.json();
        setResumes(data.resumes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
          <a href="/" style={{ fontSize: "14px", color: gold, fontWeight: 600, textDecoration: "none" }}>← New Resume</a>
        </div>
      </header>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 900, color: darkGold, margin: "0 0 8px", letterSpacing: "-1px" }}>My Saved Resumes</h1>
        <p style={{ color: gold, fontSize: "15px", margin: "0 0 40px", opacity: 0.8 }}>All resumes saved to your Supabase database</p>

        {loading ? (
          <div style={{ color: gold, fontSize: "16px" }}>Loading...</div>
        ) : resumes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📭</div>
            <p style={{ color: gold, fontSize: "16px", marginBottom: "12px" }}>No resumes saved yet.</p>
            <a href="/" style={{ color: darkGold, fontWeight: 700, fontSize: "15px" }}>Create your first resume →</a>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px" }}>
            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {resumes.map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => setSelected(resume)}
                  style={{
                    textAlign: "left", background: selected?.id === resume.id ? "rgba(184,134,11,0.1)" : "rgba(255,252,240,0.85)",
                    border: `1px solid ${selected?.id === resume.id ? gold : "#e8d48a"}`,
                    borderRadius: "14px", padding: "16px 20px", cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 700, color: darkGold, marginBottom: "4px" }}>{resume.title}</div>
                  <div style={{ fontSize: "12px", color: gold, opacity: 0.7 }}>{new Date(resume.created_at).toLocaleDateString()}</div>
                </button>
              ))}
            </div>

            {/* Preview */}
            <div>
              {selected ? (
                <ResumePreview resume={selected.content} />
              ) : (
                <div style={{ height: "300px", background: "rgba(255,252,240,0.7)", border: "1px dashed #e8d48a", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
                  <div style={{ fontSize: "48px" }}>📄</div>
                  <p style={{ color: gold, fontSize: "14px", opacity: 0.7, margin: 0 }}>Select a resume to preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}