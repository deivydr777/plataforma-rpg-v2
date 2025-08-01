const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ROTA DE REGISTRO (versão PRISMA)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor, inclua um e-mail e uma senha.' });
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        if (userExists) {
            return res.status(400).json({ msg: 'Usuário com este e-mail já existe.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        const payload = {
            user: {
                id: newUser.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'seu_segredo_secreto_para_testes',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );

    } catch (err) {
        console.error('Erro no registro:', err.message);
        res.status(500).send('Erro no Servidor');
    }
});

// ROTA DE LOGIN (versão PRISMA)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor, inclua um e-mail e uma senha.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'seu_segredo_secreto_para_testes',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Erro no login:', err.message);
        res.status(500).send('Erro no Servidor');
    }
});

module.exports = router;