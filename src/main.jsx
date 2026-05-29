import React from 'react';
import ReactDOM from 'react-dom/client';
import { ScrollProvider } from './providers/ScrollProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScrollProvider>
      <App />
    </ScrollProvider>
  </React.StrictMode>
);
