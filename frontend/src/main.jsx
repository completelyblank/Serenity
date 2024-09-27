import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { UserProvider } from '../src/context/userContext'; // Import the UserProvider

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <UserProvider> {/* Wrap your AppRoutes with UserProvider */}
        <AppRoutes />
      </UserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);