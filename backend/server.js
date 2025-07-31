// 1. Importações essenciais
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- CONEXÃO COM O BANCO DE DADOS MONGODB (PRIMEIRO!) ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado ao MongoDB! A magia flui...');
})
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Importa os modelos APÓS a conexão
const Usuario = require('./models/Usuario');

// --- Configuração da IA Gemini ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 

// 2. Inicialização do App e Servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 3. Middlewares (Configurações do Express)
app.use(cors());
app.use(express.json());

// 4. Rota de Teste Simples
app.get('/', (req, res) => {
    res.send('<h1>O Cérebro da Plataforma de RPG está no ar! Bem-vindo!</h1>');
});

// --- 5. USAR AS ROTAS DE AUTENTICAÇÃO DO ARQUIVO SEPARADO ---
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- 6. Lógica da IA (Trammer) ---
app.post('/api/ia/narrar', async (req, res) => {
    const { prompt, contextoChat, fichaPersonagem } = req.body;
    try {
        let fullPrompt = `Você é um narrador de RPG experiente, focado em imersão. 
                         Narrei a situação, as consequências das ações do jogador, ou assuma o papel de um NPC.
                         Seja conciso, mas descritivo. Mantenha o tom de fantasia/medieval.
                         
                         Contexto da Ficha do Personagem: ${JSON.stringify(fichaPersonagem)}
                         Histórico recente do chat: ${contextoChat.join('\n')}
                         
                         Ação ou Pedido do Jogador: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        res.json({ narrative: text });
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        res.status(500).json({ error: "Falha na narração da IA. O Mago Gemini está ocupado." });
    }
});

// 7. Lógica do Socket.IO (O Nosso Chat em Tempo Real!)
io.on('connection', (socket) => {
    console.log(`Usuário conectado (Socket.ID): ${socket.id}`);

    socket.on('entrar_sala', (sala) => {
        socket.join(sala);
        console.log(`Usuário ${socket.id} entrou na sala ${sala}`);
    });

    socket.on('enviar_mensagem', (data) => {
        io.to(data.sala).emit('receber_mensagem', data);
        console.log(`Mensagem na sala ${data.sala} de ${data.remetente}: ${data.texto}`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

// 8. Iniciar o Servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}. O RPG começou!`);
});