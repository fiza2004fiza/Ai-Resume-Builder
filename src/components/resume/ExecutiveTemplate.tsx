import type { ResumeContent } from "@/lib/supabase";

export default function ExecutiveTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "Georgia, serif", color: "#1a1a1a", background: "white" }}>
      <div style={{ background: "#1a1a2e", padding: "36px 40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 8px", color: "white", letterSpacing: "0.05em", textTransform: "uppercase" }}>{info.name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "12px", color: "#b8860b" }}>
          {info.email && <span>✉ {info.email}</span>}
          {info.phone && <span>📞 {info.phone}</span>}
          {info.location && <span>📍 {info.location}</span>}
          {info.linkedin && <span>🔗 {info.linkedin}</span>}
          {info.github && <span>🐙 {info.github}</span>}
        </div>
      </div>
      <div style={{ height: "4px", background: "linear-gradient(90deg, #b8860b, #d4a017, #b8860b)" }} />

      <div style={{ padding: "32px 40px" }}>
        {info.summary && (
          <div style={{ marginBottom: "24px", padding: "16px 20px", background: "#f8f5ee", borderLeft: "4px solid #b8860b", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#333", margin: 0, fontStyle: "italic" }}>{info.summary}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "32px" }}>
          <div>
            {experience.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <ST>Career History</ST>
                {experience.map((job, i) => (
                  <div key={i} style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: i < experience.length - 1 ? "1px solid #eee" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div style={{ fontWeight: 800, fontSize: "14px", color: "#1a1a2e" }}>{job.role}</div>
                      <div style={{ fontSize: "11px", color: "#b8860b", fontWeight: 700, background: "#fff8e7", padding: "2px 10px", borderRadius: "12px", border: "1px solid #e8c84a" }}>{job.startDate} – {job.endDate}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#b8860b", fontWeight: 700, marginBottom: "8px" }}>{job.company}</div>
                    <ul style={{ margin: 0, paddingLeft: "16px" }}>
                      {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "12px", color: "#444", lineHeight: 1.7 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <ST>Expertise</ST>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {skills.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "6px", height: "6px", background: "#b8860b", borderRadius: "50%", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <ST>Education</ST>
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ fontWeight: 700, fontSize: "12px", color: "#1a1a2e" }}>{edu.school}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>{edu.degree} in {edu.field}</div>
                    <div style={{ fontSize: "11px", color: "#b8860b" }}>{edu.graduationYear}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ST({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a1a2e", borderBottom: "2px solid #b8860b", paddingBottom: "6px", marginBottom: "14px" }}>{children}</h2>;
}