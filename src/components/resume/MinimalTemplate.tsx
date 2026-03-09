import type { ResumeContent } from "@/lib/supabase";

export default function MinimalTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", padding: "48px", color: "#111", background: "white" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 900, margin: "0 0 6px", letterSpacing: "-1px" }}>{info.name}</h1>
        <div style={{ fontSize: "12px", color: "#999", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>{info.phone}</span>}
          {info.location && <span>{info.location}</span>}
          {info.linkedin && <span>🔗 {info.linkedin}</span>}
          {info.github && <span>🐙 {info.github}</span>}
        </div>
      </div>

      {info.summary && (
        <div style={{ marginBottom: "28px" }}>
          <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.8, borderLeft: "2px solid #ddd", paddingLeft: "12px", margin: 0 }}>{info.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <ST>Experience</ST>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>{job.role}</span>
                  <span style={{ color: "#999", fontSize: "13px" }}> — {job.company}</span>
                </div>
                <span style={{ fontSize: "11px", color: "#bbb" }}>{job.startDate} – {job.endDate}</span>
              </div>
              <ul style={{ margin: "5px 0 0", paddingLeft: "16px" }}>
                {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "12px", color: "#555", marginBottom: "2px" }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <ST>Education</ST>
          {education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "13px" }}>{edu.school}</span>
                <div style={{ fontSize: "12px", color: "#999" }}>{edu.degree} · {edu.field}</div>
              </div>
              <span style={{ fontSize: "11px", color: "#bbb" }}>{edu.graduationYear}</span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <ST>Skills</ST>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((s, i) => (
              <span key={i} style={{ background: "#f5f5f5", color: "#333", padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ST({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#aaa", marginBottom: "12px" }}>{children}</h2>;
}