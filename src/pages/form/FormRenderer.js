import React from 'react';
import { Form } from '@formio/react';

const FormRenderer = ({ formSchema, onSubmit }) => {
  return (
    <div>
      <h1>Form Renderer</h1>
      <Form
        form={formSchema}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FormRenderer;