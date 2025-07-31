const express = require('express');
const router = express.Router(); // Cria um "roteador" para organizar as rotas
const bcrypt = require('bcryptjs'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para gerar tokens de sessão
const Usuario = require('../models/Usuario'); // Importa o modelo de Usuário

// Rota de Registro de Usuário (/api/auth/register)
router.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body; // Pega os dados do corpo da requisição

    try {
        // 1. Verificar se o usuário já existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'Usuário com este e-mail já existe.' });
        }

        // 2. Criar uma nova instância de usuário
        usuario = new Usuario({
            nome,
            email,
            senha
        });

        // 3. Criptografar a senha
        const salt = await bcrypt.genSalt(10); // Gera um "sal" para a criptografia
        usuario.senha = await bcrypt.hash(senha, salt); // Criptografa a senha

        // 4. Salvar o usuário no banco de dados
        await usuario.save();

        // 5. Gerar um Token de Sessão (JWT)
        const payload = {
            usuario: {
                id: usuario.id // Guarda o ID do usuário no token
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // O segredo para assinar o token (do nosso .env)
            { expiresIn: '1h' }, // Token expira em 1 hora
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Retorna o token para o frontend
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// Rota de Login de Usuário (/api/auth/login)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body; // Pega os dados do corpo da requisição

    try {
        // 1. Verificar se o usuário existe
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 2. Comparar a senha fornecida com a senha criptografada no banco de dados
        const isMatch = await bcrypt.compare(senha, usuario.senha);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // 3. Gerar um Token de Sessão (JWT)
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router; // Exporta o roteador para ser usado em server.js