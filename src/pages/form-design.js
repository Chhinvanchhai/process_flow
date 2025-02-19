'use client';
import React, { useState } from 'react';

const FormDesignPage = () => {
  const [formFields, setFormFields] = useState([]);
  const [workflowId, setWorkflowId] = useState('');

  const addField = (type) => {
    const newField = {
      id: `field-${formFields.length + 1}`,
      type,
      label: `Field ${formFields.length + 1}`,
      required: false,
    };
    setFormFields([...formFields, newField]);
  };

  const saveForm = async () => {
    const formData = {
      workflowId,
      fields: formFields,
    };

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Form saved successfully!');
      } else {
        alert('Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Form Design</h1>

      {/* Workflow Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Link to Workflow</label>
        <input
          type="text"
          placeholder="Enter Workflow ID"
          value={workflowId}
          onChange={(e) => setWorkflowId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Form Fields */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
        <div className="space-y-4">
          {formFields.map((field) => (
            <div key={field.id} className="p-4 border rounded">
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder="Enter text"
                  className="w-full p-2 border rounded"
                />
              )}
              {field.type === 'dropdown' && (
                <select className="w-full p-2 border rounded">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              )}
              {field.type === 'checkbox' && (
                <input type="checkbox" className="mr-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Field Buttons */}
      <div className="mb-6">
        <button
          onClick={() => addField('text')}
          className="mr-2 bg-blue-500 text-white p-2 rounded"
        >
          Add Text Field
        </button>
        <button
          onClick={() => addField('dropdown')}
          className="mr-2 bg-green-500 text-white p-2 rounded"
        >
          Add Dropdown
        </button>
        <button
          onClick={() => addField('checkbox')}
          className="bg-purple-500 text-white p-2 rounded"
        >
          Add Checkbox
        </button>
      </div>

      {/* Save Form Button */}
      <button
        onClick={saveForm}
        className="bg-green-600 text-white p-2 rounded"
      >
        Save Form
      </button>
    </div>
  );
};

export default FormDesignPage;