import { createClient } from '@supabase/supabase-js';

import CONFIG from '@/global/config';

const { API_URL, API_KEY } = CONFIG.SUPABASE;
const supabase = createClient(API_URL, API_KEY);

export default supabase;
