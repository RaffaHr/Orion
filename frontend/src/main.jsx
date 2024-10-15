import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './components/ThemeContext.jsx'; // Importa o ThemeProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>  {/* Envolve o App com ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
