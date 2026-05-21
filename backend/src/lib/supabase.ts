import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

/* By adding the !, you are telling TypeScript: "Trust me, I am an expert. I guarantee this variable exists and will never be undefined. Shut off the warning flags." */