const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_ptHWuFqRL73K@ep-twilight-waterfall-a1z22iq2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });
pool.query("SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'product'").then(res => { console.log(res.rows); pool.end(); }).catch(console.error);
