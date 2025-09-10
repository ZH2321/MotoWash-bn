import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../common/config';

// Service role client for server-side operations
export const supabaseService: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Admin client for user-specific operations
export const supabaseAdmin: SupabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Initialize database connection and ensure storage buckets
export async function initializeDatabase(): Promise<void> {
  try {
    // Test connection
    const { error } = await supabaseService
      .from('users')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection established');
    
    // Ensure storage buckets exist
    const { StorageHelper } = await import('../common/storage');
    await StorageHelper.ensureBuckets();
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

// Call initialization on module load
initializeDatabase().catch(console.error);