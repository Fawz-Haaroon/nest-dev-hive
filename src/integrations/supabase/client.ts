// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wjklifsspvitpgxwogcl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa2xpZnNzcHZpdHBneHdvZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NTQxODYsImV4cCI6MjA2NTQzMDE4Nn0.FJUHXqgvewYeOWnXdJmjvXC6PJazFNk2al7wcOpE498";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);