import { dbConnect } from "./db";
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, schema, workflowId } = req.body;

    try {
      // Insert form into the database
      const result = await dbConnect.query(
        'INSERT INTO forms (name, schema, workflow_id) VALUES ($1, $2, $3) RETURNING id',
        [name, JSON.stringify(schema), workflowId]
      );

      res.status(200).json({ message: 'Form saved successfully!', formId: result.rows[0].id });
    } catch (error) {
      console.error('Error saving form:', error);
      res.status(500).json({ error: 'Failed to save form' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}