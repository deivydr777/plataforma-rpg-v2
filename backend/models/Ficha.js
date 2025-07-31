const mongoose = require('mongoose'); // Importa o Mongoose

// Define a estrutura (o "molde") de como uma ficha de personagem será salva
const FichaSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // ID do usuário a quem esta ficha pertence
    idComunidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Comunidade', required: true }, // ID da comunidade à qual esta ficha está associada
    nomePersonagem: { type: String, required: true }, // Nome do personagem (ex: "Kael, o Bárbaro")
    // O campo 'dados' é do tipo 'Mixed' para ser SUPER flexível.
    // Ele pode guardar qualquer estrutura de JSON, permitindo fichas de diferentes sistemas.
    // Exemplo: { atributos: {forca: 10, destreza: 14}, classe: "Guerreiro", raca: "Elfo", inventario: ["Espada", "Poção"] }
    dados: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Pode adicionar mais campos aqui no futuro, se necessário
    // ex: historia: String, imagemPersonagem: String, etc.
}, { timestamps: true }); // Adiciona automaticamente campos 'createdAt' e 'updatedAt'

module.exports = mongoose.model('Ficha', FichaSchema); // Exporta o modelo