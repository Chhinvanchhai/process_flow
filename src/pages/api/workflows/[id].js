import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'business_process',
    password: 'password',
    port: 5432,
  });
  

export default async function handler(req, res) {
  const { id } = req.query; // Extract the workflow ID from the URL
    console.log("----------------------id",id)
  if (req.method === 'GET') {
    try {
      // Fetch workflow
      const workflowRes = await pool.query('SELECT * FROM workflows WHERE id = $1', [id]);
      const workflow = workflowRes.rows[0];

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      // Fetch nodes
      const nodesRes = await pool.query('SELECT * FROM nodes WHERE workflow_id = $1', [id]);
      const nodes = nodesRes.rows;

      // Fetch edges
      const edgesRes = await pool.query('SELECT * FROM edges WHERE workflow_id = $1', [id]);
      const edges = edgesRes.rows;

      res.status(200).json({ workflow, nodes, edges });
    } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ error: 'Failed to fetch workflow' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}