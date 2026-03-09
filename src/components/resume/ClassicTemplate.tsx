import type { ResumeContent } from "@/lib/supabase";

export default function ClassicTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "Georgia, serif", padding: "40px", color: "#1a1a1a", background: "white" }}>
      <div style={{ textAlign: "center", borderBottom: "3px double #333", paddingBottom: "16px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>{info.name}</h1>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#555" }}>
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>{info.phone}</span>}
          {info.location && <span>{info.location}</span>}
          {info.linkedin && <span>🔗 {info.linkedin}</span>}
          {info.github && <span>🐙 {info.github}</span>}
        </div>
      </div>

      {info.summary && (
        <div style={{ marginBottom: "22px" }}>
          <ST>Objective</ST>
          <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#333", fontStyle: "italic", margin: 0 }}>{info.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <ST>Professional Experience</ST>
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700, fontSize: "13px" }}>{job.role}, <span style={{ fontStyle: "italic", fontWeight: 400 }}>{job.company}</span></div>
                <div style={{ fontSize: "12px", color: "#666" }}>{job.startDate} – {job.endDate}</div>
              </div>
              <ul style={{ margin: "5px 0 0", paddingLeft: "18px" }}>
                {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "13px", lineHeight: 1.7, color: "#444" }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <ST>Education</ST>
          {education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px" }}>{edu.degree} in {edu.field}</div>
                <div style={{ fontSize: "12px", color: "#555", fontStyle: "italic" }}>{edu.school}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>{edu.graduationYear}</div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "22px" }}>
          <ST>Skills</ST>
          <p style={{ fontSize: "13px", color: "#333", lineHeight: 1.7, margin: 0 }}>{skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

function ST({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a1a1a", borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "12px" }}>{children}</h2>;
}