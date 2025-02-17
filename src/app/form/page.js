'use client'
import React, {useEffect} from 'react';
import { FormBuilder } from '@formio/react';
// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'formiojs/dist/formio.full.min.css';

const FormDesign = () => {
//   useEffect(() => {
//     Formio.createForm(document.getElementById('form-builder'), {
//       components: [
//         {
//           type: 'textfield',
//           label: 'First Name',
//           key: 'firstName',
//           input: true,
//         },
//         {
//           type: 'email',
//           label: 'Email',
//           key: 'email',
//           input: true,
//         },
//         {
//           type: 'textarea',
//           label: 'Message',
//           key: 'message',
//           input: true,
//         },
//       ],
//     });
//   }, []);

  return (
    <div>
      <h2>Form Builder</h2>
      <div id="form-builder" />
      <FormBuilder />,
    </div>
  );
};

export default FormDesign;
