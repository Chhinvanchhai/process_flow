// pages/api/workflow-instances.js
import { dbConnect } from "./db";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { workflowId, createdBy } = req.body;

    try {
      const result = await dbConnect.query(
        'INSERT INTO workflow_instances (workflow_id, created_by) VALUES ($1, $2) RETURNING id',
        [workflowId, createdBy]
      );

      res.status(200).json({ message: 'Workflow instance created!', instanceId: result.rows[0].id });
    } catch (error) {
      console.error('Error creating workflow instance:', error);
      res.status(500).json({ error: 'Failed to create workflow instance' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}