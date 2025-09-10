"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabaseService = void 0;
exports.initializeDatabase = initializeDatabase;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../common/config");
exports.supabaseService = (0, supabase_js_1.createClient)(config_1.config.SUPABASE_URL, config_1.config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
exports.supabaseAdmin = (0, supabase_js_1.createClient)(config_1.config.SUPABASE_URL, config_1.config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
async function initializeDatabase() {
    try {
        const { error } = await exports.supabaseService
            .from('users')
            .select('count(*)', { count: 'exact', head: true });
        if (error && !error.message.includes('relation "users" does not exist')) {
            throw new Error(`Database connection failed: ${error.message}`);
        }
        console.log('✅ Database connection established');
        const { StorageHelper } = await Promise.resolve().then(() => require('../common/storage'));
        await StorageHelper.ensureBuckets();
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
}
initializeDatabase().catch(console.error);
//# sourceMappingURL=supabase.js.map