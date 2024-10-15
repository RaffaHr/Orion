import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(express.json());

// Configurar o CORS para permitir o frontend em localhost
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Função para verificar a relação entre a pergunta e a resposta usando a API do Cohere
async function checkResponseWithCohere(question, completion) {
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
        throw new Error("API key da Cohere não encontrada.");
    }

    const prompt = `Pergunta do usuário: ${question}\nResposta sugerida: ${completion}\n\nA resposta sugerida está relacionada com a pergunta? Responda apenas 'sim' ou 'não'.`;

    try {
        const response = await axios.post('https://api.cohere.ai/generate', {
            model: 'command-xlarge-nightly',
            prompt: prompt,
            max_tokens: 40,
            temperature: 0.2,
        }, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });

        return response.data.generations[0].text.trim().toLowerCase() === 'sim';
    } catch (error) {
        throw new Error(`Erro na API do Cohere: ${error}`);
    }
}

// Função para carregar dados do arquivo JSON
function loadJsonData() {
    const filePath = path.join(process.cwd(), 'db_process.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Erro ao carregar os dados do JSON: ${error}`);
    }
}

// Carregar a base de dados do JSON
const data = loadJsonData();

// Função para extrair palavras-chave
function extractKeywords(userInput) {
    const keywords = ["prazo", "acareação", "acareaçao", "transportadora", "protheus", "nota fiscal", "cce", "cc", "cc-e", 
                      "baixar", "emitir nf", "baixar nf", "imprimir nf", "nf", "emitir", "gerar", "jadlog", "generoso", 
                      "solistica", "correios", "favorita", "comprovante de entrega", "comprovante"];

    return keywords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(userInput));
}

// Função principal para processar e gerar respostas
function runChain(userInput) {
    const keywords = extractKeywords(userInput);
    let response = null;

    if (keywords.length > 0) {
        // Buscar nas transportadoras
        for (const empresa of data.transportadoras) {
            const transportadoraNome = empresa.transportadora.nome.toUpperCase();
            if (userInput.toUpperCase().includes(transportadoraNome)) {
                for (const key of keywords) {
                    for (const [subKey, content] of Object.entries(empresa.transportadora)) {
                        if (subKey.toLowerCase().includes(key)) {
                            response = content.completions || null;
                            break;
                        }
                    }
                }
            }
            if (response) break;
        }

        // Buscar nos sistemas (como Protheus)
        if (!response) {
            for (const sistema of data.sistemas) {
                const protheus = sistema.sistema.Protheus || {};
                for (const key of keywords) {
                    for (const [subKey, content] of Object.entries(protheus)) {
                        if (subKey.toLowerCase().includes(key)) {
                            response = content.completions || null;
                            break;
                        }
                    }
                }
                if (response) break;
            }
        }
    }

    return response || "Desculpe, não tenho informações suficientes para responder a essa pergunta no momento.";
}

// Endpoint principal da API
app.post('/api/chat', async (req, res) => {
    const userInput = req.body.message;

    // Verificação de palavras-chave para reformulação
    const reformulationKeywords = ["keep", "reformule", "formule", "reformular"];
    const reformulate = reformulationKeywords.some(keyword => userInput.toLowerCase().includes(keyword));

    if (reformulate) {
        const reformulationText = userInput.replace(new RegExp(reformulationKeywords.join('|'), 'gi'), '').trim();
        if (reformulationText) {
            const reformulatedResponse = await reformulateTextWithCohere(reformulationText);
            res.json({ response: reformulatedResponse });
        } else {
            res.json({ response: "Nenhum texto encontrado para reformular." });
        }
    } else {
        const response = runChain(userInput);
        res.json({ response });
    }
});

// Função para reformular um texto usando a API do Cohere
async function reformulateTextWithCohere(text) {
  const apiKey = process.env.COHERE_API_KEY;
  const prompt = `Você agora é um profissional no atendimento, e visa sempre pela empatia ao cliente, e sempre fala visando na qualidade do atendimento... Reformule e formate para o formato markdown, deixando a mensagem com uma boa visibilidade e quebras de linhas, não adicione titulos, somente faça a refomulação e formatação do texto em Markdown: ${text}`;

  try {
      const response = await axios.post('https://api.cohere.ai/generate', {
          model: 'command-xlarge-nightly',
          prompt: prompt,
          max_tokens: 350,
          temperature: 0.4,
      }, {
          headers: { Authorization: `Bearer ${apiKey}` }
      });

      // Acesso ao texto diretamente
      if (!response.data.text) {
          throw new Error("A resposta da API não contém texto reformulado.");
      }

      return response.data.text.trim(); // Retorna apenas o texto reformulado
  } catch (error) {
      throw new Error(`Erro na reformulação de texto: ${error.message || error}`);
  }
}

// Inicializar o servidor na porta 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
