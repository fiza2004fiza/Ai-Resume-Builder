"use client";

import { useState, useEffect, useRef } from "react";
import ResumePreview from "@/components/resume/ResumePreview";
import type { ResumeContent } from "@/lib/supabase";

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  school: string;
  degree: string;
  field: string;
  graduationYear: string;
};

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; pulse: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    let animFrame: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fdf8f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(184,134,11,${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.pulse += 0.015;
        const op = p.opacity + Math.sin(p.pulse) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,134,11,${op})`;
        ctx.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animFrame = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

export default function HomePage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isFresher, setIsFresher] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", location: "" });
  const [experiences, setExperiences] = useState<Experience[]>([{ company: "", role: "", startDate: "", endDate: "", description: "" }]);
  const [educations, setEducations] = useState<Education[]>([{ school: "", degree: "", field: "", graduationYear: "" }]);
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState<ResumeContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  function updateExperience(i: number, f: keyof Experience, v: string) {
    const u = [...experiences]; u[i][f] = v; setExperiences(u);
  }
  function updateEducation(i: number, f: keyof Education, v: string) {
    const u = [...educations]; u[i][f] = v; setEducations(u);
  }

  async function handleGenerate() {
    setError(""); setLoading(true); setResume(null);
    const expText = isFresher ? "Fresher - no work experience" : experiences.map(e => `- ${e.role} at ${e.company} (${e.startDate} to ${e.endDate}): ${e.description}`).join("\n");
    const bg = `Name: ${personalInfo.name}\nEmail: ${personalInfo.email}\nPhone: ${personalInfo.phone}\nLocation: ${personalInfo.location}\nExperience:\n${expText}\nEducation:\n${educations.map(e => `- ${e.degree} in ${e.field} from ${e.school}, ${e.graduationYear}`).join("\n")}\nSkills: ${skills}`;
    try {
      const res = await fetch("/api/generate-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobTitle, jobDescription, userBackground: bg }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResume(data.resume);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }

  async function handleSave() {
    if (!resume) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `${resume.personalInfo.name} - ${jobTitle}`, content: resume }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setSaving(false); }
  }

  const gold = "#b8860b";
  const darkGold = "#8B6914";
  const bg = "rgba(255,252,245,0.85)";

  const input: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.9)", border: "1px solid #e0c97a",
    borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#3a2e00",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  const sectionStyle: React.CSSProperties = {
    background: "rgba(255,252,240,0.88)", border: "1px solid #e8d48a",
    borderRadius: "16px", padding: "24px", marginBottom: "16px",
    backdropFilter: "blur(8px)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: darkGold, marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Georgia', serif", position: "relative" }}>
      <AnimatedBackground />
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(253,248,240,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8d48a", padding: "0 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, ${gold}, #d4a017)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "16px" }}>✦</div>
              <span style={{ fontSize: "20px", fontWeight: 900, color: darkGold, letterSpacing: "-0.5px" }}>ResumeAI</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <a href="/dashboard" style={{ fontSize: "14px", color: gold, fontWeight: 600, textDecoration: "none" }}>My Resumes</a>
              {!showBuilder && (
                <button onClick={() => setShowBuilder(true)} style={{ background: `linear-gradient(135deg, ${gold}, #d4a017)`, color: "white", border: "none", padding: "10px 22px", borderRadius: "25px", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
                  Start Building →
                </button>
              )}
            </div>
          </div>
        </header>

        {!showBuilder ? (
          /* ── LANDING ── */
          <div>
            {/* HERO */}
            <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px" }}>
              <div style={{ maxWidth: "800px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.7)", border: "1px solid #e0c97a", borderRadius: "25px", padding: "6px 18px", fontSize: "12px", fontWeight: 700, color: gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "32px" }}>
                  ✦ AI-Powered · ATS-Optimized · Free
                </div>

                <h1 style={{ fontSize: "clamp(48px, 10vw, 96px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 24px", color: darkGold, letterSpacing: "-2px", fontFamily: "'Georgia', serif" }}>
                  Your Dream<br />Resume,<br />
                  <span style={{ color: gold }}>Instantly.</span>
                </h1>

                <p style={{ fontSize: "18px", color: "#7a5c00", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 40px" }}>
                  Fill in your details. Our AI crafts a perfectly tailored,
                  professional resume in seconds — designed to get you hired.
                </p>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setShowBuilder(true)} style={{ background: `linear-gradient(135deg, ${gold}, #d4a017)`, color: "white", border: "none", padding: "16px 36px", borderRadius: "50px", fontWeight: 800, fontSize: "16px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 8px 32px rgba(184,134,11,0.3)" }}>
                    ✦ Build My Resume
                  </button>
                  <a href="/dashboard" style={{ background: "rgba(255,255,255,0.7)", color: darkGold, border: `2px solid ${gold}`, padding: "16px 36px", borderRadius: "50px", fontWeight: 700, fontSize: "16px", textDecoration: "none", display: "inline-block" }}>
                    View My Resumes
                  </a>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "48px", marginTop: "64px" }}>
                  {[["Free", "Forever"], ["AI", "Powered"], ["ATS", "Optimized"]].map(([t, b]) => (
                    <div key={t} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 900, color: darkGold }}>{t}</div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: gold, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px", opacity: 0.7 }}>{b}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto" }}>
              <h2 style={{ textAlign: "center", fontSize: "40px", fontWeight: 900, color: darkGold, marginBottom: "16px", letterSpacing: "-1px" }}>Why students love us</h2>
              <p style={{ textAlign: "center", color: gold, fontSize: "16px", marginBottom: "56px", opacity: 0.8 }}>Everything you need to land your dream job</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {[
                  { icon: "⚡", title: "Lightning Fast", desc: "Get a complete resume in under 30 seconds. No more hours of formatting and guessing." },
                  { icon: "🎯", title: "Job-Tailored", desc: "Paste any job description and the AI rewrites your resume specifically for that role." },
                  { icon: "🎓", title: "Fresher Friendly", desc: "No experience? No problem. We craft powerful resumes for students and freshers too." },
                ].map(f => (
                  <div key={f.title} style={{ background: "rgba(255,252,240,0.85)", border: "1px solid #e8d48a", borderRadius: "20px", padding: "36px 28px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>{f.icon}</div>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: darkGold, marginBottom: "12px" }}>{f.title}</h3>
                    <p style={{ fontSize: "14px", color: "#7a5c00", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section style={{ padding: "80px 40px", textAlign: "center" }}>
              <div style={{ maxWidth: "600px", margin: "0 auto", background: "rgba(255,252,240,0.9)", border: "1px solid #e8d48a", borderRadius: "28px", padding: "60px 40px", backdropFilter: "blur(12px)" }}>
                <h2 style={{ fontSize: "36px", fontWeight: 900, color: darkGold, marginBottom: "12px", letterSpacing: "-1px" }}>Ready to get hired?</h2>
                <p style={{ color: gold, fontSize: "15px", marginBottom: "32px", opacity: 0.8 }}>Join thousands of students who landed their dream jobs.</p>
                <button onClick={() => setShowBuilder(true)} style={{ background: `linear-gradient(135deg, ${gold}, #d4a017)`, color: "white", border: "none", padding: "16px 40px", borderRadius: "50px", fontWeight: 800, fontSize: "16px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 32px rgba(184,134,11,0.3)" }}>
                  ✦ Create My Resume — Free
                </button>
              </div>
            </section>

            <footer style={{ textAlign: "center", padding: "32px", borderTop: "1px solid #e8d48a", color: gold, fontSize: "13px", opacity: 0.6 }}>
              ✦ ResumeAI — Built for students, by students
            </footer>
          </div>

        ) : (
          /* ── BUILDER ── */
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <button onClick={() => setShowBuilder(false)} style={{ background: "none", border: `1px solid ${gold}`, color: gold, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Back</button>
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: darkGold, margin: 0, letterSpacing: "-1px" }}>Build Your Resume</h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* LEFT FORM */}
              <div>
                {/* Job Details */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: darkGold, margin: "0 0 20px", letterSpacing: "-0.3px" }}>📋 Job Details</h2>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>Job Title</label>
                    <input style={input} placeholder="e.g. Software Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Job Description</label>
                    <textarea style={{ ...input, minHeight: "100px", resize: "vertical" }} placeholder="Paste the full job description here..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                  </div>
                </div>

                {/* Personal Info */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: darkGold, margin: "0 0 20px" }}>👤 Personal Information</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {[["Full Name", "name", "John Doe"], ["Email", "email", "john@email.com"], ["Phone", "phone", "+1 234 567 8900"], ["Location", "location", "New York, USA"]].map(([lbl, key, ph]) => (
                      <div key={key}>
                        <label style={labelStyle}>{lbl}</label>
                        <input style={input} placeholder={ph} value={personalInfo[key as keyof typeof personalInfo]} onChange={e => setPersonalInfo({ ...personalInfo, [key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: darkGold, margin: "0 0 16px" }}>💼 Work Experience</h2>
                  <div onClick={() => setIsFresher(!isFresher)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", border: `1px solid ${isFresher ? gold : "#e8d48a"}`, background: isFresher ? "rgba(184,134,11,0.08)" : "rgba(255,255,255,0.5)", cursor: "pointer", marginBottom: "16px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "5px", border: `2px solid ${gold}`, background: isFresher ? gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isFresher && <span style={{ color: "white", fontSize: "12px", fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: darkGold }}>I am a Fresher</div>
                      <div style={{ fontSize: "11px", color: gold, opacity: 0.8 }}>No work experience — recent graduate or first job</div>
                    </div>
                  </div>

                  {!isFresher && experiences.map((exp, i) => (
                    <div key={i} style={{ border: "1px solid #e8d48a", borderRadius: "12px", padding: "16px", marginBottom: "12px", background: "rgba(255,255,255,0.4)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>Experience {i + 1}</span>
                        {experiences.length > 1 && <button onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#cc4444", cursor: "pointer", fontSize: "12px" }}>✕ Remove</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[["Company", "company", "Acme Corp"], ["Role", "role", "Software Engineer"], ["Start Date", "startDate", "Jan 2022"], ["End Date", "endDate", "Present"]].map(([lbl, key, ph]) => (
                          <div key={key}>
                            <label style={labelStyle}>{lbl}</label>
                            <input style={input} placeholder={ph} value={exp[key as keyof Experience]} onChange={e => updateExperience(i, key as keyof Experience, e.target.value)} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        <label style={labelStyle}>What did you do?</label>
                        <textarea style={{ ...input, minHeight: "60px", resize: "vertical" }} placeholder="Built features, improved performance..." value={exp.description} onChange={e => updateExperience(i, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                  {!isFresher && (
                    <button onClick={() => setExperiences([...experiences, { company: "", role: "", startDate: "", endDate: "", description: "" }])} style={{ width: "100%", border: `1px dashed ${gold}`, background: "transparent", color: gold, padding: "10px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit" }}>
                      + Add Another Experience
                    </button>
                  )}
                </div>

                {/* Education */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: darkGold, margin: "0 0 16px" }}>🎓 Education</h2>
                  {educations.map((edu, i) => (
                    <div key={i} style={{ border: "1px solid #e8d48a", borderRadius: "12px", padding: "16px", marginBottom: "12px", background: "rgba(255,255,255,0.4)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>Education {i + 1}</span>
                        {educations.length > 1 && <button onClick={() => setEducations(educations.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#cc4444", cursor: "pointer", fontSize: "12px" }}>✕ Remove</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[["School", "school", "MIT"], ["Graduation Year", "graduationYear", "2024"], ["Degree", "degree", "Bachelor's"], ["Field of Study", "field", "Computer Science"]].map(([lbl, key, ph]) => (
                          <div key={key}>
                            <label style={labelStyle}>{lbl}</label>
                            <input style={input} placeholder={ph} value={edu[key as keyof Education]} onChange={e => updateEducation(i, key as keyof Education, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setEducations([...educations, { school: "", degree: "", field: "", graduationYear: "" }])} style={{ width: "100%", border: `1px dashed ${gold}`, background: "transparent", color: gold, padding: "10px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit" }}>
                    + Add Another Education
                  </button>
                </div>

                {/* Skills */}
                <div style={sectionStyle}>
                  <h2 style={{ fontSize: "16px", fontWeight: 800, color: darkGold, margin: "0 0 16px" }}>⚡ Skills</h2>
                  <label style={labelStyle}>Your Skills (comma separated)</label>
                  <input style={input} placeholder="React, Node.js, TypeScript, AWS..." value={skills} onChange={e => setSkills(e.target.value)} />
                </div>

                {error && <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", color: "#cc0000", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", marginBottom: "16px" }}>⚠️ {error}</div>}

                <button onClick={handleGenerate} disabled={loading || !jobTitle || !personalInfo.name} style={{ width: "100%", background: `linear-gradient(135deg, ${gold}, #d4a017)`, color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit", opacity: loading || !jobTitle || !personalInfo.name ? 0.6 : 1, marginBottom: "12px" }}>
                  {loading ? "⟳ Generating your resume..." : "✦ Generate My Resume"}
                </button>

                {resume && (
                  <div style={{ background: "rgba(255,252,240,0.9)", border: "1px solid #e8d48a", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: darkGold }}>Save this resume?</div>
                      <div style={{ fontSize: "12px", color: gold, opacity: 0.8 }}>Saved to Supabase database</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {saveSuccess && <span style={{ color: "#2e7d32", fontSize: "13px", fontWeight: 600 }}>✓ Saved!</span>}
                      <button onClick={handleSave} disabled={saving || saveSuccess} style={{ background: "#2e7d32", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px", fontFamily: "inherit", opacity: saving || saveSuccess ? 0.6 : 1 }}>
                        {saving ? "Saving..." : "💾 Save"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT PREVIEW */}
              <div style={{ position: "sticky", top: "80px", alignSelf: "start" }}>
                {resume ? (
                  <ResumePreview
                    resume={resume}
                  />
                ) : (
                  <div style={{ height: "400px", background: "rgba(255,252,240,0.7)", border: "1px dashed #e8d48a", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "48px" }}>📄</div>
                    <p style={{ color: gold, fontSize: "14px", opacity: 0.7, margin: 0 }}>Your resume will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}