import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business_process',
    password: 'password',
    port: 5432,
  });
export default async function handler(req, res) {
  const { workflowId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM forms WHERE workflow_id = $1',
        [workflowId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching forms:', error);
      res.status(500).json({ error: 'Failed to fetch forms' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}