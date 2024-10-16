import { useState, useEffect } from "react";
import {
  PlusIcon,
  MoonIcon,
  SunIcon,
  MessageSquareIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const Sidebar = ({
  theme,
  toggleTheme,
  conversations,
  currentConversationIndex,
  setCurrentConversationIndex,
  createNewConversation,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarMinimized((prev) => !prev);
    }
  };

  const iconSize = "w-6 h-6";
  const buttonClass = `flex items-center justify-start w-full rounded-xl transition-all duration-300 ease-in-out p-2
    ${
      theme === "dark"
        ? "hover:bg-dark-hover text-dark-text"
        : "hover:bg-light-hover text-light-text"
    }`;

  const sidebarContent = (
    <>
      <button
        onClick={createNewConversation}
        className={`${buttonClass} mb-4`}
        aria-label="Criar novo chat"
      >
        <PlusIcon className={iconSize} />
        {!isSidebarMinimized && (
          <span className="ml-2 font-semibold">Novo Chat</span>
        )}
      </button>
      {conversations.map((conversation, index) => (
        <button
          key={conversation.id}
          onClick={() => {
            setCurrentConversationIndex(index);
            if (isMobile) toggleSidebar();
          }}
          className={`${buttonClass} mb-2 ${
            currentConversationIndex === index
              ? theme === "dark"
                ? "bg-dark-hover"
                : "bg-light-hover"
              : ""
          }`}
          aria-label={`Selecionar conversa: ${conversation.title}`}
          aria-current={currentConversationIndex === index ? "page" : undefined}
        >
          <MessageSquareIcon className={iconSize} />
          {!isSidebarMinimized && (
            <span className="ml-2 font-semibold truncate">
              {conversation.title}
            </span>
          )}
        </button>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className={`fixed z-0 ${buttonClass} w-9 m-3 cursor-pointer`}
          aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          <MenuIcon className={iconSize} />
        </button>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-300`}
          onClick={toggleSidebar}
        >
          <aside
            className={`fixed left-0 top-0 h-full w-64 py-4 px-3 overflow-y-auto flex flex-col items-start truncate transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${
              theme === "dark" ? "bg-dark-foreground" : "bg-light-foreground"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex mb-4 ml-48">
              <button
                onClick={toggleSidebar}
                className={`${buttonClass} w-auto flex justify-end`}
                aria-label="Fechar menu"
              >
                <XIcon className={`${iconSize} `} />
              </button>
            </div>
            <div className="flex-grow">{sidebarContent}</div>
            <button
              onClick={toggleTheme}
              className={`${buttonClass} justify-center`}
              aria-label={
                theme === "dark"
                  ? "Mudar para modo claro"
                  : "Mudar para modo escuro"
              }
            >
              {theme === "dark" ? (
                <SunIcon className={iconSize} />
              ) : (
                <MoonIcon className={iconSize} />
              )}
              <span className="ml-2">
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </span>
            </button>
          </aside>
        </div>
      </>
    );
  }

  return (
    <aside
      className={`rounded-r-2xl p-3 flex flex-col items-start transition-all duration-300 ease-in-out truncate
        ${theme === "dark" ? "bg-dark-foreground" : "bg-light-foreground"} 
        ${isSidebarMinimized ? "w-16" : "w-64"}`}
    >
      <div className="w-auto">
        <button
          onClick={toggleSidebar}
          className={`${buttonClass} mb-4 items-end w-10`}
          aria-label={
            isSidebarMinimized
              ? "Expandir barra lateral"
              : "Minimizar barra lateral"
          }
        >
          {isSidebarMinimized ? (
            <MenuIcon className={iconSize} />
          ) : (
            <XIcon className={iconSize} />
          )}
        </button>
      </div>
      {sidebarContent}
      <div className="flex-grow" />
      <button
        onClick={toggleTheme}
        className={`${buttonClass} mt-auto justify-center ${
          theme === "dark"
            ? "bg-dark-hover hover:bg-dark-background"
            : "bg-light-hover hover:bg-light-background"
        }`}
        aria-label={
          theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"
        }
      >
        {theme === "dark" ? (
          <SunIcon className={iconSize} />
        ) : (
          <MoonIcon className={iconSize} />
        )}
        {!isSidebarMinimized && (
          <span className="ml-2">
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </span>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
