import { dbConnect } from "../db";


export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status, performedBy } = req.body;

    try {
      // Update workflow instance status
      await dbConnect.query(
        'UPDATE workflow_instances SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [status, id]
      );

      // Log the action
      await dbConnect.query(
        'INSERT INTO workflow_instance_actions (instance_id, action_type, performed_by) VALUES ($1, $2, $3)',
        [id, status, performedBy]
      );

      res.status(200).json({ message: 'Workflow instance updated!' });
    } catch (error) {
      console.error('Error updating workflow instance:', error);
      res.status(500).json({ error: 'Failed to update workflow instance' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}