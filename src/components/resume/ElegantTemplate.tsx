import type { ResumeContent } from "@/lib/supabase";

export default function ElegantTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", background: "white", padding: "48px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#b8860b", marginBottom: "12px" }}>Curriculum Vitae</div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, margin: "0 0 12px", letterSpacing: "0.05em", color: "#1a1a1a" }}>{info.name}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ height: "1px", width: "60px", background: "#b8860b" }} />
          <div style={{ width: "6px", height: "6px", background: "#b8860b", borderRadius: "50%", margin: "0 8px" }} />
          <div style={{ height: "1px", width: "60px", background: "#b8860b" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", fontSize: "12px", color: "#666" }}>
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>{info.phone}</span>}
          {info.location && <span>{info.location}</span>}
          {info.linkedin && <span>🔗 {info.linkedin}</span>}
          {info.github && <span>🐙 {info.github}</span>}
        </div>
      </div>

      {info.summary && (
        <div style={{ marginBottom: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.9, color: "#555", margin: "0 auto", maxWidth: "600px", fontStyle: "italic" }}>{info.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <SE>Professional Experience</SE>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: "14px" }}>{job.role}</span>
                  <span style={{ color: "#b8860b", fontSize: "13px" }}> · {job.company}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>{job.startDate} – {job.endDate}</div>
              </div>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "13px", color: "#444", lineHeight: 1.8 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <SE>Education</SE>
          {education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px" }}>{edu.school}</div>
                <div style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>{edu.degree} in {edu.field}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#b8860b" }}>{edu.graduationYear}</div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <SE>Skills & Expertise</SE>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px" }}>
            {skills.map((s, i) => (
              <span key={i} style={{ border: "1px solid #b8860b", color: "#8B6914", padding: "4px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SE({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "16px" }}>
      <h2 style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.3em", color: "#b8860b", margin: "0 0 8px" }}>{children}</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", alignItems: "center" }}>
        <div style={{ height: "1px", width: "40px", background: "#e0c97a" }} />
        <div style={{ width: "4px", height: "4px", background: "#b8860b", borderRadius: "50%" }} />
        <div style={{ height: "1px", width: "40px", background: "#e0c97a" }} />
      </div>
    </div>
  );
}