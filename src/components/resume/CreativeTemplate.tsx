import type { ResumeContent } from "@/lib/supabase";

export default function CreativeTemplate({ resume }: { resume: ResumeContent }) {
  const info = resume?.personalInfo || {};
  const experience = resume?.experience || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#1a1a1a", background: "white", display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "600px" }}>
      {/* Left sidebar */}
      <div style={{ background: "#2d2d2d", padding: "32px 20px", color: "white" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #b8860b, #d4a017)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 900, color: "white", marginBottom: "16px" }}>
          {info.name?.charAt(0) || "?"}
        </div>
        <h1 style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 4px", color: "white", lineHeight: 1.2 }}>{info.name}</h1>
        <div style={{ height: "2px", background: "#b8860b", margin: "12px 0" }} />

        <div style={{ marginBottom: "24px" }}>
          <SL>Contact</SL>
          {info.email && <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "6px", wordBreak: "break-all" }}>✉ {info.email}</div>}
          {info.phone && <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "6px" }}>📞 {info.phone}</div>}
          {info.location && <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "6px" }}>📍 {info.location}</div>}
          {info.linkedin && <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "6px", wordBreak: "break-all" }}>🔗 {info.linkedin}</div>}
          {info.github && <div style={{ fontSize: "11px", color: "#ccc", marginBottom: "6px", wordBreak: "break-all" }}>🐙 {info.github}</div>}
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <SL>Skills</SL>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {skills.map((s, i) => (
                <span key={i} style={{ background: "rgba(184,134,11,0.3)", color: "#d4a017", padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <SL>Education</SL>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "white" }}>{edu.school}</div>
                <div style={{ fontSize: "10px", color: "#aaa" }}>{edu.degree} in {edu.field}</div>
                <div style={{ fontSize: "10px", color: "#b8860b" }}>{edu.graduationYear}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ padding: "32px 28px" }}>
        {info.summary && (
          <div style={{ marginBottom: "24px" }}>
            <SR>About Me</SR>
            <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#555", margin: 0 }}>{info.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <SR>Experience</SR>
            {experience.map((job, i) => (
              <div key={i} style={{ marginBottom: "20px", position: "relative", paddingLeft: "16px", borderLeft: "2px solid #b8860b" }}>
                <div style={{ position: "absolute", left: "-5px", top: "4px", width: "8px", height: "8px", background: "#b8860b", borderRadius: "50%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                  <div style={{ fontWeight: 800, fontSize: "13px", color: "#1a1a1a" }}>{job.role}</div>
                  <div style={{ fontSize: "11px", color: "#999" }}>{job.startDate} – {job.endDate}</div>
                </div>
                <div style={{ fontSize: "12px", color: "#b8860b", fontWeight: 600, marginBottom: "6px" }}>{job.company}</div>
                <ul style={{ margin: 0, paddingLeft: "14px" }}>
                  {(job.bullets || []).map((b, j) => <li key={j} style={{ fontSize: "12px", color: "#555", lineHeight: 1.6 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SL({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#b8860b", marginBottom: "10px" }}>{children}</h2>;
}

function SR({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#2d2d2d", borderBottom: "2px solid #b8860b", paddingBottom: "4px", marginBottom: "12px" }}>{children}</h2>;
}