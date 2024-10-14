/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { SendIcon, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TypingAnimation = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0; // Mover o índice dentro do useEffect
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(timer);
        onComplete(); // Chamando a função quando a digitação termina
      }
    }, speed);

    return () => clearInterval(timer); // Limpeza do intervalo ao desmontar
  }, [text, speed, onComplete]);

  return <ReactMarkdown breaks={true}>{displayedText}</ReactMarkdown>; // Renderizando o texto formatado
};

const Chat = ({
  theme,
  conversations,
  currentConversationIndex,
  handleSendMessage,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null);
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = "auto"; // Reset altura para recalcular
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para o conteúdo
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight(e.target); // Ajusta altura dinamicamente
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e); // Submete mensagem com "Enter"
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { type: "user", content: inputMessage };
    handleSendMessage(userMessage);
    setInputMessage("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"; // Reseta altura após envio
    }

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      const botMessage = {
        type: "bot",
        content: result.response,
        isTyping: true,
      };
      setCurrentTypingMessage(botMessage);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        type: "bot",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem.",
        isTyping: true,
      };
      setCurrentTypingMessage(errorMessage);
    }
  };

  const handleTypingComplete = () => {
    setIsTyping(false);
    setCurrentTypingMessage(null);
    const updatedConversations = [...conversations];
    const currentConversation = updatedConversations[currentConversationIndex];
    const lastMessageIndex = currentConversation.messages.length - 1;
    currentConversation.messages[lastMessageIndex].isTyping = false;
  };

  useEffect(() => {
    if (currentTypingMessage) {
      handleSendMessage(currentTypingMessage);
    }
  }, [currentTypingMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, currentConversationIndex, isTyping]);

  return (
    <main
      className={`flex-1 flex flex-col overflow-hidden
      ${
        theme === "dark"
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="pl-40 pr-40 pb-2  mx-auto p-4 space-y-4">
          {currentConversationIndex !== null &&
            conversations[currentConversationIndex].messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[70%] ${
                      message.type === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-[0.5rem] flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-[#374151] ml-2"
                          : "bg-[#ff7947] mr-2"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User size={16} color="white" />
                      ) : (
                        <Bot size={16} color="white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        message.type === "user"
                          ? `bg-[#374151] text-white` // Estilo específico para o usuário
                          : `${
                              theme === "dark"
                                ? "text-dark-text bg-[#2f2f2f]"
                                : "text-light-text bg-[#f7f7f7]"
                            }` // Estilo para o bot baseado no tema
                      }`}
                    >
                      {message.type === "bot" && message.isTyping ? (
                        <TypingAnimation
                          text={message.content}
                          speed={10}
                          onComplete={handleTypingComplete}
                        />
                      ) : (
                        <ReactMarkdown breaks={true}>
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={onSubmit} className="relative pl-40 pr-40 pb-2 mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              placeholder="Digite sua mensagem..."
              className={`w-full pl-4 pr-12 py-3 rounded-xl transition-all duration-300 ease-in-out resize-none 
          ${
            theme === "dark"
              ? "bg-dark-inputBackground text-dark-inputTextColor placeholder-dark-inputTextColor"
              : "bg-light-inputBackground text-light-inputTextColor placeholder-light-inputTextColor"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows="1"
              style={{
                lineHeight: "1.5",
                minHeight: "48px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 ease-in-out"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Chat;
