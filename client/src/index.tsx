import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { initializeServices } from './services';
import { registerSW } from './utils/serviceWorker';
import reportWebVitals from './reportWebVitals';

import './index.css';

// Initialize app services
initializeServices();

// Register service worker
registerSW();

// Hide loading screen
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  loadingScreen.style.display = 'none';
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();