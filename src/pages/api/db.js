import { Pool } from 'pg';
export const dbConnect = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business_process',
    password: 'password',
    port: 5432,
  });