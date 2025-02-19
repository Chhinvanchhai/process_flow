import React, { useState } from 'react';
import FormBuilderComponent from './FormBuilder';
import FormRenderer from './FormRenderer';

const App = () => {
  const [formSchema, setFormSchema] = useState(null);
  const [formName, setFormName] = useState('');
  const [workflowId, setWorkflowId] = useState('');

  const handleSaveForm = async () => {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formName,
        schema: formSchema,
        workflowId,
      }),
    });

    if (response.ok) {
      alert('Form saved successfully!');
    } else {
      alert('Failed to save form');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Form Builder</h1>

      {/* Form Name Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Form Name</label>
        <input
          type="text"
          placeholder="Enter Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Workflow ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Workflow ID</label>
        <input
          type="text"
          placeholder="Enter Workflow ID"
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Form Builder */}
      <FormBuilderComponent onChange={setFormSchema} />

      {/* Save Form Button */}
      <button
        onClick={handleSaveForm}
        className="mt-4 bg-green-600 text-white p-2 rounded"
      >
        Save Form
      </button>

      {/* Form Renderer */}
      {formSchema && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Form Preview</h2>
          <FormRenderer
            formSchema={formSchema}
            onSubmit={(submission) => console.log('Form submitted:', submission)}
          />
        </div>
      )}
    </div>
  );
};

export default App;