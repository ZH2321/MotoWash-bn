import { SupabaseClient } from '@supabase/supabase-js';
export declare const supabaseService: SupabaseClient;
export declare const supabaseAdmin: SupabaseClient;
export declare function initializeDatabase(): Promise<void>;
