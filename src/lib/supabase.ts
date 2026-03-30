import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wtcimkqdztfrzvtbhwyx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2lta3FkenRmcnp2dGJod3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDU4NTQsImV4cCI6MjA5MDM4MTg1NH0.aq5tlx5MPxSrsPdIV9LJFtqbBRqBzYlTwUYW0MGy7mI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
