import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Database types
export type LandingPage = {
  id: string;
  slug: string;
  website_url: string;
  icp_title: string;
  icp_data: any;
  landing_page_data: any;
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
