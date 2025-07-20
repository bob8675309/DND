// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ucggczovhmauhshvhusx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ2djem92aG1hdWhzaHZodXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NzAzMjIsImV4cCI6MjA2ODU0NjMyMn0.FHRtk0e02y53v9FgXNxpcxyuoXwW9uX6Qh3fuLz7-BE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
