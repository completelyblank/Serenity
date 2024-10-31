import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import AppRoutes from './Routes';
import { UserProvider } from '../src/context/userContext';
import { SnackbarProvider } from 'notistack';
import { MoodProvider } from '../src/context/moodContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <UserProvider> 
        <SnackbarProvider>
          <MoodProvider>
            <AppRoutes />
          </MoodProvider>
        </SnackbarProvider>
      </UserProvider>
    </Router>
  </React.StrictMode >,
  document.getElementById('root')
);
