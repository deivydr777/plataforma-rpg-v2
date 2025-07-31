const mongoose = require('mongoose'); // Importa o Mongoose

// Define a estrutura (o "molde") de como uma comunidade de RPG será salva
const ComunidadeSchema = new mongoose.Schema({
    nome: { type: String, required: true }, // Nome da comunidade (ex: "A Guilda dos Aventureiros")
    descricao: { type: String }, // Descrição breve da comunidade
    imagem: { type: String }, // URL da imagem/logo da comunidade
    tema: { type: String }, // Tema da comunidade (ex: "Harry Potter", "Medieval", "Cyberpunk")
    dono: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // ID do usuário que criou/é dono da comunidade
    membros: [{ // Lista de membros da comunidade
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // ID do usuário membro
        cargo: { type: String, enum: ['Mestre', 'Jogador', 'Observador'], default: 'Jogador' } // Cargo do membro na comunidade
    }],
    canais: [{ nome: String, tipo: { type: String, default: 'texto' } }] // Lista de canais de chat dentro da comunidade
}, { timestamps: true }); // Adiciona automaticamente campos 'createdAt' e 'updatedAt'

module.exports = mongoose.model('Comunidade', ComunidadeSchema); // Exporta o modelo