import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wtcimkqdztfrzvtbhwyx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_kTMbX0ufrgEtguzt7Ai1WQ_Q9FEpJ_w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
