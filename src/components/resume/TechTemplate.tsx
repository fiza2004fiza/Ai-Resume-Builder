import type { ResumeContent } from "@/lib/supabase";

export default function TechTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "'Courier New', monospace", color: "#1a1a1a", background: "white", padding: "36px" }}>
      <div style={{ background: "#0d1117", borderRadius: "10px", padding: "24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28ca41" }} />
        </div>
        <div style={{ color: "#b8860b", fontSize: "12px", marginBottom: "6px" }}>$ whoami</div>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 8px", color: "white", letterSpacing: "-0.5px" }}>{info.name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#8b949e" }}>
          {info.email && <span style={{ color: "#79c0ff" }}>✉ {info.email}</span>}
          {info.phone && <span style={{ color: "#79c0ff" }}>📞 {info.phone}</span>}
          {info.location && <span style={{ color: "#79c0ff" }}>📍 {info.location}</span>}
          {info.linkedin && <span style={{ color: "#79c0ff" }}>🔗 {info.linkedin}</span>}
          {info.github && <span style={{ color: "#79c0ff" }}>🐙 {info.github}</span>}
        </div>
      </div>

      {info.summary && (
        <div style={{ marginBottom: "24px" }}>
          <ST>// About</ST>
          <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#444", margin: 0, borderLeft: "3px solid #b8860b", paddingLeft: "12px" }}>{info.summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <ST>// Tech Stack</ST>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: "#0d1117", color: "#b8860b", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, border: "1px solid #30363d" }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <ST>// Experience</ST>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "18px", padding: "16px", background: "#f6f8fa", borderRadius: "8px", border: "1px solid #e1e4e8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ fontWeight: 800, fontSize: "14px" }}>{job.role}</div>
                <div style={{ fontSize: "11px", color: "#b8860b", fontWeight: 700 }}>{job.startDate} – {job.endDate}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#b8860b", fontWeight: 700, marginBottom: "8px" }}>@ {job.company}</div>
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "12px", color: "#555", lineHeight: 1.6 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <ST>// Education</ST>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: "10px", padding: "12px 16px", background: "#f6f8fa", borderRadius: "8px", border: "1px solid #e1e4e8", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px" }}>{edu.school}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{edu.degree} in {edu.field}</div>
              </div>
              <div style={{ fontSize: "11px", color: "#b8860b", fontWeight: 700 }}>{edu.graduationYear}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ST({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "12px", fontWeight: 800, color: "#b8860b", marginBottom: "12px", fontFamily: "'Courier New', monospace" }}>{children}</h2>;
}