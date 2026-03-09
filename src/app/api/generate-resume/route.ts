import { NextRequest, NextResponse } from "next/server";
import { generateResumeWithAI } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, jobDescription, userBackground } = body;

    if (!jobTitle || !userBackground) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rawResponse = await generateResumeWithAI({ jobTitle, jobDescription, userBackground });

    let resumeContent;
    try {
      const cleaned = rawResponse.replace(/```json|```/g, "").trim();
      resumeContent = JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned invalid JSON. Try again.");
    }

    const safeResume = {
      personalInfo: {
        name: resumeContent?.personalInfo?.name || "",
        email: resumeContent?.personalInfo?.email || "",
        phone: resumeContent?.personalInfo?.phone || "",
        location: resumeContent?.personalInfo?.location || "",
        linkedin: resumeContent?.personalInfo?.linkedin || "",
        github: resumeContent?.personalInfo?.github || "",
        website: resumeContent?.personalInfo?.website || "",
        summary: resumeContent?.personalInfo?.summary || "",
      },
      experience: Array.isArray(resumeContent?.experience) ? resumeContent.experience.map((e: {
        company?: string; role?: string; startDate?: string; endDate?: string; bullets?: string[];
      }) => ({
        company: e?.company || "",
        role: e?.role || "",
        startDate: e?.startDate || "",
        endDate: e?.endDate || "",
        bullets: Array.isArray(e?.bullets) ? e.bullets : [],
      })) : [],
      education: Array.isArray(resumeContent?.education) ? resumeContent.education.map((e: {
        school?: string; degree?: string; field?: string; graduationYear?: string;
      }) => ({
        school: e?.school || "",
        degree: e?.degree || "",
        field: e?.field || "",
        graduationYear: e?.graduationYear || "",
      })) : [],
      skills: Array.isArray(resumeContent?.skills) ? resumeContent.skills : [],
      certificates: Array.isArray(resumeContent?.certificates) ? resumeContent.certificates.map((c: {
        name?: string; issuer?: string; year?: string;
      }) => ({
        name: c?.name || "",
        issuer: c?.issuer || "",
        year: c?.year || "",
      })) : [],
      achievements: Array.isArray(resumeContent?.achievements) ? resumeContent.achievements : [],
    };

    return NextResponse.json({ success: true, resume: safeResume });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Something went wrong" }, { status: 500 });
  }
}