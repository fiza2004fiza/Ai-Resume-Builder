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

type Template = "modern" | "classic" | "minimal";
type ActiveTab = "resume" | "cover" | "linkedin";

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
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.6 + 0.2, pulse: Math.random() * Math.PI * 2 });
    }
    let animFrame: number;
    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    canvas.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, canvas.width / 2, canvas.height / 2, canvas.width);
      grad.addColorStop(0, "#fffdf5");
      grad.addColorStop(0.4, "#fdf6e3");
      grad.addColorStop(1, "#f5e6c8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(184,134,11,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.pulse += 0.02;
        const o = p.opacity + Math.sin(p.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,134,11,${o})`;
        ctx.fill();
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animFrame = requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener("resize", handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}

export default function HomePage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("resume");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("modern");

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isFresher, setIsFresher] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", location: "" });
  const [experiences, setExperiences] = useState<Experience[]>([{ company: "", role: "", startDate: "", endDate: "", description: "" }]);
  const [educations, setEducations] = useState<Education[]>([{ school: "", degree: "", field: "", graduationYear: "" }]);
  const [skills, setSkills] = useState("");

  const [resume, setResume] = useState<ResumeContent | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  function updateExperience(index: number, field: keyof Experience, value: string) {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  }

  function updateEducation(index: number, field: keyof Education, value: string) {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  }

  async function handleGenerate() {
    setError("");
    setLoading(true);
    setResume(null);
    const experienceText = isFresher
      ? "No work experience - fresher"
      : experiences.map((e) => `- ${e.role} at ${e.company} (${e.startDate} to ${e.endDate}): ${e.description}`).join("\n");

    const userBackground = `
Name: ${personalInfo.name}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
Location: ${personalInfo.location}
Work Experience: ${experienceText}
Education: ${educations.map((e) => `- ${e.degree} in ${e.field} from ${e.school}, graduated ${e.graduationYear}`).join("\n")}
Skills: ${skills}
    `.trim();

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, userBackground }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResume(data.resume);
      setActiveTab("resume");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate resume");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateCoverLetter() {
    setCoverLoading(true);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, personalInfo, experiences, isFresher }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverLetter(data.coverLetter);
      setActiveTab("cover");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setCoverLoading(false);
    }
  }

  async function handleGenerateLinkedin() {
    setLinkedinLoading(true);
    try {
      const res = await fetch("/api/generate-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, personalInfo, experiences, skills, isFresher }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLinkedin(data.linkedin);
      setActiveTab("linkedin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate LinkedIn summary");
    } finally {
      setLinkedinLoading(false);
    }
  }

  async function handleSave() {
    if (!resume) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${resume.personalInfo.name} - ${jobTitle}`, content: resume }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-white/70 border border-amber-200 rounded-xl px-4 py-3 text-amber-900 placeholder-amber-300 focus:outline-none focus:border-amber-500 focus:bg-white transition text-sm backdrop-blur-sm";
  const goldBtn = { background: "linear-gradient(135deg, #b8860b, #d4a017)" };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
      <AnimatedBackground />
      <div className="relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <header className="border-b border-amber-200/50 sticky top-0 backdrop-blur-md" style={{ background: "rgba(255,253,245,0.9)", zIndex: 50 }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg" style={goldBtn}>✦</div>
              <span className="font-black text-2xl tracking-tight" style={{ color: "#8B6914" }}>RESUMEAI</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="text-sm font-black tracking-wide" style={{ color: "#b8860b" }}>MY RESUMES</a>
              {!showBuilder && (
                <button onClick={() => setShowBuilder(true)} className="text-sm font-black px-5 py-2 rounded-full text-white shadow-md tracking-wide" style={goldBtn}>
                  START BUILDING
                </button>
              )}
            </div>
          </div>
        </header>

        {!showBuilder ? (
          <div>
            {/* Hero */}
            <section className="min-h-screen flex items-center justify-center text-center px-6 py-24">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300 bg-white/60 backdrop-blur-sm text-amber-700 text-xs font-black tracking-widest uppercase mb-8 shadow-sm">
                  ✦ AI-POWERED · ATS-OPTIMIZED · FREE
                </div>
                <h1 className="font-black leading-none mb-6" style={{
                  fontSize: "clamp(3.5rem, 9vw, 8rem)",
                  background: "linear-gradient(135deg, #8B6914 0%, #b8860b 40%, #d4a017 60%, #8B6914 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.03em",
                  fontFamily: "'Arial Black', sans-serif",
                }}>
                  YOUR DREAM<br />RESUME,<br />INSTANTLY.
                </h1>
                <p className="text-lg max-w-lg mx-auto mb-12 leading-relaxed font-medium" style={{ color: "#8B6914", opacity: 0.8, fontFamily: "Arial, sans-serif" }}>
                  Fill in your details. Our AI crafts a perfectly tailored,
                  professional resume in seconds — designed to get you hired.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button onClick={() => setShowBuilder(true)} className="px-10 py-4 rounded-full text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 tracking-wide" style={goldBtn}>
                    ✦ BUILD MY RESUME
                  </button>
                  <a href="/dashboard" className="px-10 py-4 rounded-full font-black text-lg border-2 transition-all hover:scale-105 tracking-wide" style={{ borderColor: "#b8860b", color: "#b8860b", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
                    VIEW MY RESUMES
                  </a>
                </div>
                <div className="flex gap-12 justify-center mt-20">
                  {[["FREE", "Forever"], ["AI", "Powered"], ["ATS", "Optimized"]].map(([top, bottom]) => (
                    <div key={top} className="text-center">
                      <div className="text-2xl font-black" style={{ color: "#b8860b" }}>{top}</div>
                      <div className="text-xs tracking-widest uppercase mt-1 font-bold" style={{ color: "#b8860b", opacity: 0.6 }}>{bottom}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-center font-black mb-16 tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#8B6914" }}>
                  EVERYTHING YOU NEED
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: "📄", title: "RESUME", desc: "AI-tailored resume matched to any job description. 3 elegant templates to choose from." },
                    { icon: "✉️", title: "COVER LETTER", desc: "Compelling cover letters that don't sound robotic. Personalized for each application." },
                    { icon: "💼", title: "LINKEDIN", desc: "A powerful LinkedIn About section that gets you noticed by recruiters." },
                  ].map((f) => (
                    <div key={f.title} className="rounded-2xl p-8 border border-amber-200 text-center backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1" style={{ background: "rgba(255,253,245,0.7)" }}>
                      <div className="text-4xl mb-4">{f.icon}</div>
                      <h3 className="font-black text-lg mb-3 tracking-wide" style={{ color: "#8B6914" }}>{f.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#b8860b", opacity: 0.8, fontFamily: "Arial, sans-serif" }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
              <div className="max-w-2xl mx-auto rounded-3xl p-16 border border-amber-200 shadow-xl" style={{ background: "rgba(255,253,245,0.8)", backdropFilter: "blur(12px)" }}>
                <h2 className="font-black mb-4 tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#8B6914" }}>READY TO GET HIRED?</h2>
                <p className="mb-8 font-medium" style={{ color: "#b8860b", opacity: 0.8, fontFamily: "Arial, sans-serif" }}>Join thousands of students who landed their dream jobs.</p>
                <button onClick={() => setShowBuilder(true)} className="px-12 py-4 rounded-full text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 tracking-wide" style={goldBtn}>
                  ✦ CREATE MY RESUME — IT&apos;S FREE
                </button>
              </div>
            </section>
          </div>
        ) : (
          /* BUILDER */
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setShowBuilder(false)} className="text-amber-600 hover:text-amber-900 text-sm font-black transition-colors">← BACK</button>
              <h1 className="font-black text-3xl tracking-tight" style={{ color: "#8B6914" }}>BUILD YOUR RESUME</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT FORM */}
              <div className="space-y-6">

                <GoldSection title="📋 JOB DETAILS">
                  <GoldField label="Job Title You're Applying For">
                    <input className={inputClass} placeholder="e.g. Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </GoldField>
                  <GoldField label="Job Description">
                    <textarea className={inputClass} rows={4} placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                  </GoldField>
                </GoldSection>

                <GoldSection title="👤 PERSONAL INFORMATION">
                  <div className="grid grid-cols-2 gap-3">
                    <GoldField label="Full Name"><input className={inputClass} placeholder="John Doe" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} /></GoldField>
                    <GoldField label="Email"><input className={inputClass} placeholder="john@email.com" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} /></GoldField>
                    <GoldField label="Phone"><input className={inputClass} placeholder="+1 234 567 8900" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} /></GoldField>
                    <GoldField label="Location"><input className={inputClass} placeholder="New York, USA" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} /></GoldField>
                  </div>
                </GoldSection>

                <GoldSection title="💼 WORK EXPERIENCE">
                  <div onClick={() => setIsFresher(!isFresher)} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${isFresher ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:border-amber-400 bg-white/50"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${isFresher ? "bg-amber-500 border-amber-500" : "border-amber-300"}`}>
                      {isFresher && <span className="text-white text-xs font-black">✓</span>}
                    </div>
                    <div>
                      <p className="text-sm font-black" style={{ color: "#8B6914" }}>I AM A FRESHER</p>
                      <p className="text-xs font-medium" style={{ color: "#b8860b", opacity: 0.7 }}>No work experience yet — recent graduate or first job</p>
                    </div>
                  </div>
                  {!isFresher && (
                    <div className="space-y-4">
                      {experiences.map((exp, i) => (
                        <div key={i} className="border border-amber-200 rounded-xl p-4 space-y-3 bg-white/40">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#b8860b" }}>Experience {i + 1}</span>
                            {experiences.length > 1 && <button onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))} className="text-red-400 text-xs font-bold">✕ Remove</button>}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <GoldField label="Company"><input className={inputClass} placeholder="Acme Corp" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} /></GoldField>
                            <GoldField label="Role"><input className={inputClass} placeholder="Software Engineer" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} /></GoldField>
                            <GoldField label="Start Date"><input className={inputClass} placeholder="Jan 2022" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} /></GoldField>
                            <GoldField label="End Date"><input className={inputClass} placeholder="Present" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} /></GoldField>
                          </div>
                          <GoldField label="What did you do?">
                            <textarea className={inputClass} rows={2} placeholder="Built features, improved performance..." value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                          </GoldField>
                        </div>
                      ))}
                      <button onClick={() => setExperiences([...experiences, { company: "", role: "", startDate: "", endDate: "", description: "" }])} className="w-full border border-dashed border-amber-300 hover:border-amber-500 text-amber-600 rounded-xl py-2 text-sm font-bold transition bg-white/30">
                        + Add Another Experience
                      </button>
                    </div>
                  )}
                </GoldSection>

                <GoldSection title="🎓 EDUCATION">
                  {educations.map((edu, i) => (
                    <div key={i} className="border border-amber-200 rounded-xl p-4 space-y-3 bg-white/40">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#b8860b" }}>Education {i + 1}</span>
                        {educations.length > 1 && <button onClick={() => setEducations(educations.filter((_, idx) => idx !== i))} className="text-red-400 text-xs font-bold">✕ Remove</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <GoldField label="School / University"><input className={inputClass} placeholder="MIT" value={edu.school} onChange={(e) => updateEducation(i, "school", e.target.value)} /></GoldField>
                        <GoldField label="Graduation Year"><input className={inputClass} placeholder="2024" value={edu.graduationYear} onChange={(e) => updateEducation(i, "graduationYear", e.target.value)} /></GoldField>
                        <GoldField label="Degree"><input className={inputClass} placeholder="Bachelor's" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} /></GoldField>
                        <GoldField label="Field of Study"><input className={inputClass} placeholder="Computer Science" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} /></GoldField>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setEducations([...educations, { school: "", degree: "", field: "", graduationYear: "" }])} className="w-full border border-dashed border-amber-300 hover:border-amber-500 text-amber-600 rounded-xl py-2 text-sm font-bold transition bg-white/30">
                    + Add Another Education
                  </button>
                </GoldSection>

                <GoldSection title="⚡ SKILLS">
                  <GoldField label="Your Skills (comma separated)">
                    <input className={inputClass} placeholder="React, Node.js, TypeScript, AWS..." value={skills} onChange={(e) => setSkills(e.target.value)} />
                  </GoldField>
                </GoldSection>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">⚠️ {error}</div>}

                <div className="space-y-3">
                  <button onClick={handleGenerate} disabled={loading || !jobTitle || !personalInfo.name} className="w-full text-white font-black rounded-xl py-4 px-6 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.01] text-lg tracking-wide" style={goldBtn}>
                    {loading ? <><span className="animate-spin">⟳</span> GENERATING RESUME...</> : <>✦ GENERATE MY RESUME</>}
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleGenerateCoverLetter} disabled={coverLoading || !jobTitle || !personalInfo.name} className="text-white font-black rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm tracking-wide shadow" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
                      {coverLoading ? "GENERATING..." : "✉️ COVER LETTER"}
                    </button>
                    <button onClick={handleGenerateLinkedin} disabled={linkedinLoading || !personalInfo.name} className="text-white font-black rounded-xl py-3 px-4 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm tracking-wide shadow" style={{ background: "linear-gradient(135deg, #0077b5, #005885)" }}>
                      {linkedinLoading ? "GENERATING..." : "💼 LINKEDIN BIO"}
                    </button>
                  </div>
                </div>

                {resume && (
                  <div className="border border-amber-200 rounded-2xl p-5 flex items-center justify-between backdrop-blur-sm" style={{ background: "rgba(255,253,245,0.8)" }}>
                    <div>
                      <p className="font-black" style={{ color: "#8B6914" }}>SAVE THIS RESUME?</p>
                      <p className="text-xs mt-1 font-medium" style={{ color: "#b8860b", opacity: 0.7 }}>Saved to your Supabase database</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {saveSuccess && <span className="text-green-600 text-sm font-black">✓ SAVED!</span>}
                      <button onClick={handleSave} disabled={saving || saveSuccess} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black rounded-xl py-2 px-5 transition text-sm">
                        {saving ? "SAVING..." : "💾 SAVE"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT PREVIEW */}
              <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
                {resume && (
                  <div className="border border-amber-200 rounded-2xl p-4 backdrop-blur-sm" style={{ background: "rgba(255,253,245,0.8)" }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#8B6914" }}>Choose Template</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(["modern", "classic", "minimal"] as Template[]).map((t) => (
                        <button key={t} onClick={() => setSelectedTemplate(t)} className="py-2 rounded-xl text-xs font-black uppercase tracking-wide border transition" style={{ background: selectedTemplate === t ? "linear-gradient(135deg, #b8860b, #d4a017)" : "rgba(255,255,255,0.5)", color: selectedTemplate === t ? "white" : "#b8860b", borderColor: selectedTemplate === t ? "#b8860b" : "#e5d5a0" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(resume || coverLetter || linkedin) && (
                  <div className="flex border border-amber-200 rounded-xl overflow-hidden" style={{ background: "rgba(255,253,245,0.8)" }}>
                    {resume && <TabBtn active={activeTab === "resume"} onClick={() => setActiveTab("resume")}>📄 RESUME</TabBtn>}
                    {coverLetter && <TabBtn active={activeTab === "cover"} onClick={() => setActiveTab("cover")}>✉️ COVER</TabBtn>}
                    {linkedin && <TabBtn active={activeTab === "linkedin"} onClick={() => setActiveTab("linkedin")}>💼 LINKEDIN</TabBtn>}
                  </div>
                )}

                {activeTab === "resume" && resume && <ResumePreview resume={resume} template={selectedTemplate} />}

                {activeTab === "cover" && coverLetter && (
                  <div className="bg-white rounded-xl shadow-xl border border-amber-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-lg" style={{ color: "#8B6914" }}>COVER LETTER</h3>
                      <button onClick={() => navigator.clipboard.writeText(coverLetter)} className="text-xs font-black px-3 py-1 rounded-full text-white" style={goldBtn}>COPY</button>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#333", fontFamily: "Georgia, serif" }}>{coverLetter}</div>
                  </div>
                )}

                {activeTab === "linkedin" && linkedin && (
                  <div className="bg-white rounded-xl shadow-xl border border-amber-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-lg" style={{ color: "#8B6914" }}>LINKEDIN ABOUT</h3>
                      <button onClick={() => navigator.clipboard.writeText(linkedin)} className="text-xs font-black px-3 py-1 rounded-full text-white" style={{ background: "linear-gradient(135deg, #0077b5, #005885)" }}>COPY</button>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#333", fontFamily: "Georgia, serif" }}>{linkedin}</div>
                  </div>
                )}

                {!resume && !coverLetter && !linkedin && (
                  <div className="h-96 border border-dashed border-amber-300 rounded-2xl flex items-center justify-center backdrop-blur-sm" style={{ background: "rgba(255,253,245,0.5)" }}>
                    <div className="text-center">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="font-bold" style={{ color: "#b8860b", opacity: 0.6 }}>Your output will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <footer className="text-center py-8 border-t border-amber-200/50" style={{ color: "#b8860b", opacity: 0.5, fontSize: "0.75rem" }}>
          ✦ RESUMEAI — BUILT FOR STUDENTS, BY STUDENTS
        </footer>
      </div>
    </div>
  );
}

function GoldSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-amber-200 rounded-2xl p-6 space-y-4 backdrop-blur-sm shadow-sm" style={{ background: "rgba(255,253,245,0.75)" }}>
      <h2 className="font-black text-sm tracking-widest uppercase" style={{ color: "#8B6914" }}>{title}</h2>
      {children}
    </div>
  );
}

function GoldField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-black uppercase tracking-wider" style={{ color: "#b8860b", opacity: 0.8 }}>{label}</label>
      {children}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex-1 py-3 text-xs font-black tracking-wide transition-all" style={{ background: active ? "linear-gradient(135deg, #b8860b, #d4a017)" : "transparent", color: active ? "white" : "#b8860b" }}>
      {children}
    </button>
  );
}