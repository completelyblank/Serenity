import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { UserProvider } from '../src/context/userContext';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <UserProvider> 
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </UserProvider>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
);