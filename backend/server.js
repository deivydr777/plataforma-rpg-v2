// 1. Importações essenciais
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// 2. Inicialização do Prisma e do Servidor
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: "*", // Permite todas as origens (bom para desenvolvimento)
          methods: ["GET", "POST"]
            }
            });

            // 3. Middlewares (Configurações do Express)
            app.use(cors());
            app.use(express.json());

            // 4. Rota de Teste Simples
            app.get('/', (req, res) => {
              res.send('<h1>Cérebro da Plataforma RPG está no ar! Bem-vindo!</h1>');
              });

              // 5. ROTAS DE AUTENTICAÇÃO (usando o Prisma)
              const authRoutes = require('./routes/auth'); // Certifique-se que o arquivo auth.js existe e usa Prisma
              app.use('/api/auth', authRoutes);


              // 6. Lógica do Socket.IO (Chat)
              io.on('connection', (socket) => {
                console.log(`Usuário Conectado: ${socket.id}`);

                  socket.on('entrar_sala', (sala) => {
                      socket.join(sala);
                          console.log(`Usuário ${socket.id} entrou na sala: ${sala}`);
                            });

                              socket.on('enviar_mensagem', (data) => {
                                  // Re-transmite a mensagem para todos na mesma sala, exceto o remetente
                                      socket.to(data.sala).emit('receber_mensagem', data);
                                        });

                                          socket.on('disconnect', () => {
                                              console.log(`Usuário Desconectado: ${socket.id}`);
                                                });
                                                });


                                                // 7. Iniciando o Servidor
                                                const PORT = process.env.PORT || 10000;
                                                server.listen(PORT, () => {
                                                  console.log(`Servidor rodando na porta ${PORT}. O RPG começou!`);
                                                  });