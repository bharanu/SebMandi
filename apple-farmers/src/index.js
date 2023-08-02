// index.js (or the entry point of your application)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

ReactDOM.render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_dmVyaWZpZWQtb2N0b3B1cy05Ni5jbGVyay5hY2NvdW50cy5kZXYk">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


