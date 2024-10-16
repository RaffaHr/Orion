import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'supersecretkey'; // Mantenha essa chave em um ambiente seguro

// Middleware para autenticar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Se não houver token, retorna 401

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token não for válido, retorna 403
        req.user = user; // Salva as informações do usuário na requisição
        next(); // Chama a próxima função middleware
    });
};

export default async function handler(req, res) {
    // Verifica se a requisição é um POST para login
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            // Verifica se o usuário existe
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'E-mail ou senha inválidos' });
            }

            // Comparação direta da senha
            if (user.password !== password) {
                return res.status(400).json({ error: 'E-mail ou senha inválidos' });
            }

            // Gera o token JWT
            const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

            // Retorna o token
            return res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            console.error(err); // Para depuração
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        // Validação do token
        authenticateToken(req, res, async () => {
            try {
                // Se o token for válido, retorna as informações do usuário
                const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
                if (!user) {
                    return res.sendStatus(404); // Usuário não encontrado
                }
                return res.status(200).json(user); // Retorna informações do usuário
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } else {
        // Método não permitido
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
