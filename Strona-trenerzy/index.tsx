import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CrmApp from './crm/CrmApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const isCrmPath = window.location.pathname === '/crm' || window.location.pathname.startsWith('/crm/');

root.render(
  <React.StrictMode>
    {isCrmPath ? <CrmApp /> : <App />}
  </React.StrictMode>
);
