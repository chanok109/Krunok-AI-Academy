import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/components.css';
import './styles/lightTheme.css';
import './styles/unit1KnowledgeSheet.css';
import './styles/unit1Page.css';
import './styles/premium.css';

try {
  document.documentElement.lang = 'th';
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
