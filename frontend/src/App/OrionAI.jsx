/* eslint-disable react-hooks/exhaustive-deps */
// Importa os hooks useState e useEffect do React
import { useState, useEffect } from 'react';
// Importa os componentes Sidebar e Chat
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirecionamento
import axios from 'axios'; // Importa axios para realizar chamadas à API

// Componente principal que gerencia o estado e a estrutura da aplicação
const Main = () => {
  // Estado para armazenar o tema atual (claro ou escuro)
  const [theme, setTheme] = useState(() => {
    // Verifica se já existe um tema salvo no localStorage e retorna, caso contrário retorna 'dark' como padrão
    return localStorage.getItem('theme') || 'dark';
  });
  
  // Estado para armazenar as conversas (uma lista de objetos de conversa)
  const [conversations, setConversations] = useState([]);
  // Estado para armazenar o índice da conversa atualmente selecionada
  const [currentConversationIndex, setCurrentConversationIndex] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  // Hook useEffect que é executado quando o componente é montado
  useEffect(() => {
    // Verifica o token ao montar o componente
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Faz uma chamada à API para validar o token
          await axios.get('/api/login', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // Se a validação falhar, remove o token e navega para /login
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        // Se não houver token, navega para /login
        navigate('/login');
      }
    };

    checkToken(); // Chama a função para verificar o token

    // Cria nova conversa se não houver conversas
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [navigate, conversations.length]); // O efeito roda na montagem e quando o número de conversas muda

  // Hook useEffect que é executado sempre que o tema é alterado
  useEffect(() => {
    // Salva o tema atual no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // O efeito roda sempre que 'theme' muda

  // Função para alternar o tema entre claro e escuro
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Função que cria uma nova conversa
  const createNewConversation = () => {
    // Cria um objeto de conversa com um id único (usando o timestamp) e um título
    const newConversation = {
      id: Date.now(),
      title: `Conversa ${conversations.length + 1}`, // Nomeia a conversa com base no número atual de conversas
      messages: [] // Inicializa com uma lista vazia de mensagens
    };
    // Atualiza o estado de conversas adicionando a nova conversa
    setConversations([...conversations, newConversation]);
    // Define o índice da nova conversa como a conversa ativa
    setCurrentConversationIndex(conversations.length);
  };

  // Função que lida com o envio de uma mensagem
  const handleSendMessage = (message) => {
    // Se não houver uma conversa ativa, não faz nada
    if (currentConversationIndex === null) return;

    // Copia a lista de conversas existente
    const updatedConversations = [...conversations];
    // Adiciona a nova mensagem à conversa ativa
    updatedConversations[currentConversationIndex].messages.push(message);
    // Atualiza o estado de conversas com a nova lista
    setConversations(updatedConversations);
  };

  return (
    // Define a estrutura da página, alternando a classe de estilo com base no tema
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-dark-background' : 'bg-light-background'}`}>
      {/* Componente da barra lateral (Sidebar) */}
      <Sidebar
        theme={theme} // Passa o tema atual
        toggleTheme={toggleTheme} // Função para alternar o tema
        conversations={conversations} // Lista de conversas
        currentConversationIndex={currentConversationIndex} // Índice da conversa ativa
        setCurrentConversationIndex={setCurrentConversationIndex} // Função para definir a conversa ativa
        createNewConversation={createNewConversation} // Função para criar nova conversa
      />
      {/* Componente do chat */}
      <Chat
        theme={theme} // Passa o tema atual
        conversations={conversations} // Passa a lista de conversas
        currentConversationIndex={currentConversationIndex} // Índice da conversa ativa
        handleSendMessage={handleSendMessage} // Função para enviar mensagem
      />
    </div>
  );
};

export default Main;
