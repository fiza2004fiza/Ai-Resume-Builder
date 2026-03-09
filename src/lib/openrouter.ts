export type GenerateResumeInput = {
  jobTitle: string;
  jobDescription: string;
  userBackground: string;
};

export async function generateResumeWithAI(
  input: GenerateResumeInput
): Promise<string> {
  const prompt = `You are an expert resume writer. Based on the information below, create a professional, ATS-optimized resume.

JOB TITLE APPLYING FOR: ${input.jobTitle}

JOB DESCRIPTION:
${input.jobDescription}

USER'S BACKGROUND/EXPERIENCE:
${input.userBackground}

Instructions:
- Tailor the resume to the specific job
- Use strong action verbs
- Quantify achievements where possible
- Keep it concise and impactful
- Return ONLY valid JSON in the exact structure below, no markdown, no explanation

Return this exact JSON structure:
{
  "personalInfo": {
    "name": "extracted or placeholder name",
    "email": "email if mentioned or placeholder",
    "phone": "phone if mentioned or placeholder",
    "location": "location if mentioned or placeholder",
    "linkedin": "",
    "website": "",
    "summary": "2-3 sentence professional summary tailored to the job"
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "bullets": [
        "Achievement bullet 1",
        "Achievement bullet 2",
        "Achievement bullet 3"
      ]
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "graduationYear": "Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "AI Resume Maker",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}