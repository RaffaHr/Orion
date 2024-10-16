import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './routes/Login.jsx';
import ErrorPage from './routes/Error.jsx';
import App from './App/OrionAI.jsx';
import './App.css';
import { ThemeProvider } from './App/ThemeContext.jsx'; // Importa o ThemeProvider

// Componente que faz o redirecionamento
function RedirectToApp () {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app'); // Redireciona para /app
  }, [navigate]);

  return null; // Não renderiza nada
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>  {/* Envolve o App com ThemeProvider */}
    <Router>
    <Routes>
      <Route path="/" element={<RedirectToApp />} /> {/* Redireciona a rota principal */}
      <Route path="/app" element={<App />} /> {/* Rota para o componente App */}
      <Route path="/login" element={<Login />} /> {/* Rota de login */}
      <Route path="*" element={<ErrorPage />} /> {/* Rota para páginas não encontradas */}
    </Routes>
  </Router>
    </ThemeProvider>
  </StrictMode>
);
