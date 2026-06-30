import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mcgtpzbkvuxtfrrkntjo.supabase.co'

const supabaseAnonKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZ3RwemJrdnV4dGZycmtudGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjYyNzIsImV4cCI6MjA5ODQwMjI3Mn0.REjhXcKg2Ex1GU47iF0FkjCiw_eaXbRhRr4ZFwsDOtg'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)