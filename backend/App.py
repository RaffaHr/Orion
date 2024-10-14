import json
import os
import re
import requests
import cohere
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

# Carregar as variáveis de ambiente do arquivo .env, como chaves de API
load_dotenv()

# Inicializa o cliente Cohere usando a chave de API extraída do .env
api_key = os.getenv("COHERE_API_KEY")
if api_key is None:
    # Lança um erro caso a chave da API não seja encontrada
    raise ValueError("API key da Cohere não encontrada. Verifique seu arquivo .env.")
else:
    # Cria uma instância do cliente Cohere
    co = cohere.Client(api_key)

# Inicializa a aplicação FastAPI
app = FastAPI()

# Configura o CORS (Cross-Origin Resource Sharing) para permitir o frontend em localhost:5173 acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Endereço do frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

# Define o modelo de dados para as mensagens de chat (aceitando uma string de mensagem)
class ChatMessage(BaseModel):
    message: str

# Função para verificar a relação entre a pergunta do usuário e a resposta usando a API da Cohere
def check_response_with_cohere(question, completion):
    # Prompt usado para verificar a relação entre pergunta e resposta
    prompt = f"Pergunta do usuário: {question}\nResposta sugerida: {completion}\n\nA resposta sugerida está relacionada com a pergunta? Responda apenas 'sim' ou 'não'."
    
    # Gera uma resposta usando o modelo Cohere
    response = co.generate(
        model='command-xlarge-nightly',
        prompt=prompt,
        max_tokens=40,
        temperature=0.2  # Controle de diversidade da resposta, valores mais baixos geram respostas mais focadas
    )
    
    # Verifica se a resposta foi gerada e se a primeira geração foi "sim"
    if response.generations:
        return response.generations[0].text.strip().lower() == 'sim'
    else:
        raise ValueError("Erro ao verificar relação da resposta: Nenhuma geração retornada.")

# Função para carregar dados de um arquivo JSON
def load_json_data():
    try:
        # Carrega o conteúdo do arquivo 'db_process.json'
        with open('db_process.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise ValueError(f"Erro ao carregar os dados do JSON: {e}")

# Carrega a base de dados do JSON ao iniciar a aplicação
data = load_json_data()
if data is None:
    raise ValueError("Erro ao carregar a base de dados JSON")

# Função para extrair palavras-chave específicas da entrada do usuário
def extract_keywords(user_input):
    # Lista de palavras-chave importantes para detectar
    keywords = ["prazo", "acareação", "acareaçao", "transportadora", "protheus", "nota fiscal", "cce", "cc", "cc-e", 
                "baixar", "emitir nf", "baixar nf", "imprimir nf", "nf", "emitir", "gerar", "jadlog", "generoso", 
                "solistica", "correios", "favorita", "comprovante de entrega", "comprovante"]
    # Busca as palavras-chave no input do usuário (ignorando maiúsculas e minúsculas)
    found_keywords = [word for word in keywords if re.search(r'\b' + re.escape(word) + r'\b', user_input.lower())]
    return found_keywords

# Função para processar e gerar a resposta baseada no input do usuário
def run_chain(user_input):
    keywords = extract_keywords(user_input)  # Extrai palavras-chave
    response = None  # Inicializa a resposta como None

    # Verifica se há palavras-chave detectadas
    if keywords:
        # Percorre a lista de transportadoras da base de dados
        for empresa in data["transportadoras"]:
            transportadora_nome = empresa["transportadora"]["nome"].upper()
            # Verifica se o nome da transportadora está no input do usuário
            if transportadora_nome in user_input.upper():
                # Para cada palavra-chave encontrada, busca uma resposta correspondente
                for key in keywords:
                    for sub_key, content in empresa["transportadora"].items():
                        if key in sub_key.lower():
                            # Se encontrar uma "completion" associada, define como resposta
                            possible_response = content.get("completions", "")
                            if possible_response:
                                response = possible_response
                            break
                if response:
                    break

        # Se não encontrou resposta nas transportadoras, busca em sistemas (ex: Protheus)
        if not response:
            for sistema in data["sistemas"]:
                protheus = sistema["sistema"].get("Protheus", {})
                for key in keywords:
                    for sub_key, content in protheus.items():
                        if key.lower() in sub_key.lower():
                            possible_response = content.get("completions", "")
                            if possible_response:
                                response = possible_response
                            break
                if response:
                    break

    # Retorna a resposta ou uma mensagem padrão se nada foi encontrado
    return response if response else "Desculpe, não tenho informações suficientes para responder a essa pergunta no momento."

# Função para detectar palavras-chave que indicam uma solicitação de reformulação de texto
def detect_reformulation_keywords(user_input):
    reformulation_keywords = ["keep", "reformule", "formule", "reformular"]
    return any(keyword in user_input.lower() for keyword in reformulation_keywords)

# Função para reformular um texto usando a API Cohere
def reformulate_text_with_cohere(text):
    # Prompt para reformular o texto com foco em empatia e clareza
    prompt = f"Você agora é um profissional no atendimento, e visa sempre pela empatia ao cliente, e sempre fala visando na qualidade do atendimento e com palavras fáceis e claras de se entender, com base nisso, você vai reformular o seguinte texto: {text}"
    
    # Gera a reformulação com o modelo da Cohere
    response = co.generate(
        model='command-xlarge-nightly',
        prompt=prompt,
        max_tokens=350,
        temperature=0.7  # Um valor mais alto para gerar respostas mais variadas
    )
    
    # Verifica se houve resposta e a retorna, caso contrário, gera um erro
    if response.generations:
        return response.generations[0].text.strip()
    else:
        raise ValueError("Erro ao reformular o texto: Nenhuma geração retornada.")

# Endpoint principal da API para lidar com as interações do usuário
@app.post("/api/chat")
async def handle_chat(message: ChatMessage):
    user_input = message.message  # Captura a mensagem do usuário
    # Verifica se o usuário solicitou reformulação de texto
    if detect_reformulation_keywords(user_input):
        # Remove as palavras-chave de reformulação do input do usuário
        reformulation_text = re.sub(r'\b(keep|reformule|formule|reformular)\b', '', user_input, flags=re.IGNORECASE).strip()
        
        # Se ainda houver texto para reformular, faz a reformulação
        if reformulation_text:
            reformulated_response = reformulate_text_with_cohere(reformulation_text)
            return {"response": reformulated_response} if reformulated_response else {"response": "Não foi possível reformular o texto."}
        else:
            return {"response": "Nenhum texto encontrado para reformular."}
    else:
        # Caso não haja pedido de reformulação, processa a pergunta normalmente
        response = run_chain(user_input)
        return {"response": response}

# Executa a aplicação FastAPI localmente (quando não está sendo executada como módulo)
if __name__ == "__main__":
    import uvicorn
    # Configura a execução do servidor na porta 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)
