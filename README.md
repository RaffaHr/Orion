# Aplicação de IA com RAG Avançado

## Descrição

Esta aplicação de Inteligência Artificial (IA) utiliza **Retrieval-Augmented Generation (RAG)** avançado para melhorar a eficiência dos processos internos de uma empresa. O sistema processa perguntas enviadas pelos usuários através de um frontend desenvolvido em React (com Vite), encaminhando-as para o backend, onde são processadas pelo script `app.py`. A aplicação realiza verificação de qualidade utilizando a IA da Cohere, extração de palavras-chave e ações baseadas em gatilhos como reformulação de textos.

## Funcionalidades

- **Recepção de Perguntas no Frontend:** Os usuários podem enviar perguntas relacionadas aos processos internos da empresa através de uma interface moderna e amigável.
- **Verificação de Qualidade:** A IA da Cohere avalia a qualidade das mensagens recebidas e verifica a clareza e coerência.
- **Extração de Palavras-Chave:** A aplicação utiliza técnicas de extração de palavras-chave para destacar os termos mais importantes nas mensagens.
- **Gatilhos Automatizados:** A aplicação dispara ações automáticas, como a reformulação de textos, com base em palavras-chave ou padrões identificados.
- **RAG Avançado:** Integração de Retrieval-Augmented Generation para melhorar a precisão das respostas baseadas nos dados internos da empresa.

## Pré-requisitos

Certifique-se de ter o seguinte instalado em sua máquina:

- **Python 3.12.6** ou superior
- **Node.js** (para o frontend em React com Vite)

## Instalação

### Backend (Python)

1. Clone o repositório:

```bash
   git clone https://github.com/raffahr/orion
   cd backend
```

### Instale as dependências do backend:

```bash
  pip install -r requirements.txt
```

### Navegue até a pasta do frontend:

```bash
   cd Orion
```

### Instale as dependências do frontend:

```bash
  npm install
```

### Inicie o frontend junto com todos os serviços relacionados:

```bash
  npm run start-all
```
### Resumo do Processo
- Backend: O backend em Python será iniciado, pronto para processar as requisições e interagir com o banco de dados.
- Frontend: O frontend em React será iniciado utilizando o Vite, disponibilizando a interface para o usuário e conectando-se ao backend.

## Fluxo de Interação

1.  **Envio de Perguntas:** No frontend, os usuários podem enviar perguntas relacionadas aos processos da empresa.
2.  **Processamento pelo Backend:** As perguntas são enviadas para o script `app.py`, que acessa o banco de dados `db_process.json` para buscar informações relevantes.
3.  **Verificação de Qualidade:** A IA da Cohere é acionada para verificar a clareza e a qualidade da mensagem.
4.  **Gatilhos e Ações:** Com base nas palavras-chave extraídas e nos padrões detectados, a aplicação dispara gatilhos para ações como reformulação de texto.
5.  **Resposta ao Usuário:** O sistema retorna as respostas processadas para o usuário no frontend.

## Tecnologias Utilizadas

### Backend:

- **Python**: Linguagem principal para o processamento das perguntas e integração com a IA.
- **Cohere API**: Usada para realizar a verificação de qualidade das mensagens e extração de palavras-chave.
- **JSON**: Armazenamento dos processos internos da empresa.

### Frontend:

- **React (com Vite)**: Para construir a interface do usuário de forma rápida e modular.
- **JavaScript (JSX)**: Para criar componentes interativos e responsivos.
- **TailwindCSS**: Para estilização e estruturação do layout da aplicação.
````
