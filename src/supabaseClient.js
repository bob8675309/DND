// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ucggczovhmauhshvhusx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZ2djem92aG1hdWhzaHZodXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzgyOTEsImV4cCI6MjA2Nzg1NDI5MX0.TtFwgRX9xrnQoPBZ1b9o1sLBddVPNO5L-IuP0IFLQF8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
