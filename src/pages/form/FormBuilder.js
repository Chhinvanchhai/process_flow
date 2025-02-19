import React from 'react';
import { FormBuilder } from '@formio/react';

const FormBuilderComponent = ({ onChange }) => {
  return (
    <div>
      <h1>Form Builder</h1>
      <FormBuilder
        form={{ display: 'form' }} // Start with an empty form
        onChange={onChange}
      />
    </div>
  );
};

export default FormBuilderComponent;