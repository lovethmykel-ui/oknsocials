import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://payekirnjeexckzxtsqf.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_o4xJdukDD0QCV-vkhlahlQ_oaxLUtdu";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.length > 0 &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.length > 0
  );
}
