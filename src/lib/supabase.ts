import { createClient } from "@supabase/supabase-js";

// Only create Supabase clients if environment variables are provided
export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null;

export const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// Database types
export type LandingPage = {
  id: string;
  slug: string;
  website_url: string;
  icp_title: string;
  icp_data: Record<string, unknown>;
  landing_page_data: Record<string, unknown>;
  published_at: string;
  views: number;
  leads: number;
  conversion_rate: number;
};

export type Lead = {
  id: string;
  landing_page_id: string;
  name: string;
  email: string;
  company?: string;
  created_at: string;
};
