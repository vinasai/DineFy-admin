// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gutghjvgdvzmklwubsuj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dGdoanZnZHZ6bWtsd3Vic3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5NzY4MDksImV4cCI6MjA0MDU1MjgwOX0.x_PA6H7yskfdyTvXwCagBFvSOeNT75QsNpcB82oMbIM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
