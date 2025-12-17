import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  if (!global.hasOwnProperty('pool')) {
    (global as any).pool = new Pool();
  }
  pool = (global as any).pool;
}

export default pool;
