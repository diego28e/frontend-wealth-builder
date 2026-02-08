import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Import the router you created
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>  
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);