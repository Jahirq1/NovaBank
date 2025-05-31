import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { AuthProvider } from './AuthProvider/AuthContext';  // importon AuthProvider

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
        {renderRoutes(routes)}
    </BrowserRouter>
  );
};

export default App;

