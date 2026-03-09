"use client";

import { useRef } from "react";
import type { ResumeContent } from "@/lib/supabase";

type Props = {
  resume: ResumeContent;
  template?: "modern" | "classic" | "minimal";
};

export default function ResumePreview({ resume, template = "modern" }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const { personalInfo, experience, education, skills, achievements, certificates } = resume;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${personalInfo.name} - Resume</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; font-size: 13px; line-height: 1.5; }
            h1 { font-size: 26px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
            .contact { display: flex; gap: 16px; font-size: 11px; color: #666; margin-top: 6px; flex-wrap: wrap; }
            .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 3px; margin: 16px 0 8px; }
            .job-header { display: flex; justify-content: space-between; align-items: baseline; }
            .role { font-weight: 700; font-size: 13px; }
            .company { font-size: 12px; color: #b8860b; font-weight: 600; }
            .date { font-size: 11px; color: #888; }
            ul { padding-left: 18px; margin-top: 4px; }
            li { font-size: 12px; color: #444; margin-bottom: 2px; }
            .skill-tag { background: #b8860b; color: white; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; display: inline-block; margin: 2px; }
            .achievement { font-size: 12px; color: #444; padding: 3px 0; border-left: 3px solid #b8860b; padding-left: 8px; margin-bottom: 4px; }
            .cert { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .cert-name { font-weight: 700; font-size: 12px; }
            .cert-issuer { font-size: 11px; color: #666; }
            .cert-year { font-size: 11px; color: #888; }
            .header-bar { border-left: 5px solid #b8860b; padding-left: 16px; margin-bottom: 20px; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  const templateStyles = {
    modern: {
      headerBorder: "4px solid #b8860b",
      accentColor: "#b8860b",
      skillBg: "#b8860b",
      skillColor: "white",
    },
    classic: {
      headerBorder: "none",
      accentColor: "#1a1a1a",
      skillBg: "#f0f0f0",
      skillColor: "#1a1a1a",
    },
    minimal: {
      headerBorder: "1px solid #e0e0e0",
      accentColor: "#555",
      skillBg: "transparent",
      skillColor: "#555",
    },
  };

  const style = templateStyles[template];

  return (
    <div className="space-y-4">
      {/* Template Switcher */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg" style={{ color: "#8B6914" }}>Preview</h2>
        <button
          onClick={handlePrint}
          className="text-sm font-semibold px-4 py-2 rounded-full text-white shadow transition hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #b8860b, #d4a017)" }}
        >
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Resume Paper */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-amber-100">
        <div ref={printRef} style={{ padding: "40px", fontFamily: "Arial, sans-serif", color: "#1a1a1a" }}>

          {/* Header */}
          <div style={{ borderLeft: style.headerBorder, paddingLeft: style.headerBorder !== "none" ? "16px" : "0", marginBottom: "20px" }}>
            {template === "classic" && (
              <div style={{ textAlign: "center", borderBottom: "2px solid #1a1a1a", paddingBottom: "12px", marginBottom: "4px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "3px" }}>{personalInfo.name}</h1>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#666", marginTop: "6px" }}>
                  {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                  {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                  {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
              </div>
            )}
            {template !== "classic" && (
              <>
                <h1 style={{ fontSize: "26px", fontWeight: "900", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>{personalInfo.name}</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#666", marginTop: "6px" }}>
                  {personalInfo.email && <span>✉ {personalInfo.email}</span>}
                  {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                  {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: "16px" }}>
              <SectionTitle color={style.accentColor}>Profile</SectionTitle>
              <p style={{ fontSize: "12px", lineHeight: "1.7", color: "#444" }}>{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <SectionTitle color={style.accentColor}>Experience</SectionTitle>
              {experience.map((job, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "13px" }}>{job.role}</div>
                      <div style={{ fontSize: "12px", color: style.accentColor, fontWeight: "600" }}>{job.company}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{job.startDate} – {job.endDate}</div>
                  </div>
                  <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: "12px", color: "#444", marginBottom: "2px", lineHeight: "1.5" }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <SectionTitle color={style.accentColor}>Education</SectionTitle>
              {education.map((edu, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "13px" }}>{edu.school}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>{edu.degree} in {edu.field}</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{edu.graduationYear}</div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <SectionTitle color={style.accentColor}>Achievements</SectionTitle>
              {achievements.map((a, i) => (
                <div key={i} style={{ fontSize: "12px", color: "#444", borderLeft: `3px solid ${style.accentColor}`, paddingLeft: "8px", marginBottom: "5px", lineHeight: "1.5" }}>
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {certificates && certificates.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <SectionTitle color={style.accentColor}>Certificates</SectionTitle>
              {certificates.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "12px" }}>{c.name}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{c.issuer}</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{c.year}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills?.length > 0 && (
            <div>
              <SectionTitle color={style.accentColor}>Skills</SectionTitle>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((s, i) => (
                  <span key={i} style={{
                    background: style.skillBg,
                    color: style.skillColor,
                    padding: "3px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                    border: template === "minimal" ? "1px solid #ccc" : "none"
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ borderBottom: `2px solid ${color}`, paddingBottom: "3px", marginBottom: "8px" }}>
      <h2 style={{ margin: 0, fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "3px", color }}>{children}</h2>
    </div>
  );
}