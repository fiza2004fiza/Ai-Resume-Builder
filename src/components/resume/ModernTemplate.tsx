import type { ResumeContent } from "@/lib/supabase";

export default function ModernTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "40px", color: "#1a1a1a" }}>
      <div style={{ borderLeft: "5px solid #b8860b", paddingLeft: "20px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "2px" }}>{info.name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#666", marginTop: "6px" }}>
          {info.email && <span>✉ {info.email}</span>}
          {info.phone && <span>📞 {info.phone}</span>}
          {info.location && <span>📍 {info.location}</span>}
        </div>
      </div>
      {info.summary && <Section title="Profile" color="#b8860b"><p style={{ fontSize: "12px", lineHeight: 1.7, color: "#444" }}>{info.summary}</p></Section>}
      {experience.length > 0 && (
        <Section title="Experience" color="#b8860b">
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontWeight: 700, fontSize: "13px" }}>{job.role}</div><div style={{ fontSize: "12px", color: "#b8860b" }}>{job.company}</div></div>
                <div style={{ fontSize: "11px", color: "#888" }}>{job.startDate} – {job.endDate}</div>
              </div>
              <ul style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                {job.bullets.map((b, j) => <li key={j} style={{ fontSize: "12px", color: "#444", marginBottom: "2px" }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {education.length > 0 && (
        <Section title="Education" color="#b8860b">
          {education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div><div style={{ fontWeight: 700, fontSize: "13px" }}>{edu.school}</div><div style={{ fontSize: "12px", color: "#666" }}>{edu.degree} in {edu.field}</div></div>
              <div style={{ fontSize: "11px", color: "#888" }}>{edu.graduationYear}</div>
            </div>
          ))}
        </Section>
      )}
      {skills.length > 0 && (
        <Section title="Skills" color="#b8860b">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s, i) => <span key={i} style={{ background: "#b8860b", color: "white", padding: "3px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>{s}</span>)}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ borderBottom: `2px solid ${color}`, paddingBottom: "3px", marginBottom: "8px" }}>
        <h2 style={{ margin: 0, fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "3px", color }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}