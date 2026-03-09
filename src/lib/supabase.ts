import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
};

export type ResumeContent = {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    graduationYear: string;
  }[];
  skills: string[];
};