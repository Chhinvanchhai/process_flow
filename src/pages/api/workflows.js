import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'business_process',
  password: 'password',
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, description, created_by, nodes, edges } = req.body;

    try {
      // Start a transaction
      await pool.query('BEGIN');

      // Insert workflow
      const workflowRes = await pool.query(
        'INSERT INTO workflows (name, description, created_by) VALUES ($1, $2, $3) RETURNING id',
        [name, description, created_by]
      );
      const workflowId = workflowRes.rows[0].id;

      // Insert nodes
      for (const node of nodes) {
        await pool.query(
          'INSERT INTO nodes (workflow_id, type, position_x, position_y, data) VALUES ($1, $2, $3, $4, $5)',
          [workflowId, node.type, node.position.x, node.position.y, JSON.stringify(node.data)]
        );
      }

      // Insert edges
      for (const edge of edges) {
        await pool.query(
          'INSERT INTO edges (workflow_id, source_node_id, target_node_id, label) VALUES ($1, $2, $3, $4)',
          [workflowId, edge.source, edge.target, edge.label]
        );
      }

      // Commit the transaction
      await pool.query('COMMIT');

      res.status(200).json({ message: 'Workflow saved successfully!', workflowId });
    } catch (error) {
      // Rollback the transaction on error
      await pool.query('ROLLBACK');
      console.error('Error saving workflow:', error);
      res.status(500).json({ error: 'Failed to save workflow' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}