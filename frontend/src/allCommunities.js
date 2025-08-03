// Este arquivo simula um "banco de dados" de todas as comunidades criadas na plataforma.

// Começamos com algumas comunidades de exemplo para teste.
export const initialAllCommunities = [
    { 
        id: '1', 
        name: 'A Guilda dos Aventureiros', 
        icon: '⚔️', 
        inviteCode: 'ADV-123',
        channels: [ {id: 'geral', name: 'geral'}, {id: 'taverna', name: 'taverna'} ]
    },
    { 
        id: '2', 
        name: 'Cyberpunk Redline', 
        icon: '🤖', 
        inviteCode: 'CYB-789',
        channels: [ {id: 'geral', name: 'geral'}, {id: 'missões', name: 'missões'} ]
    },
];

// Funções para manipular esta lista "global" no localStorage
export const getAllCommunities = () => {
    const communities = localStorage.getItem('worldweaver-all-communities');
    // Se não houver nada salvo, salva a lista inicial
    if (!communities) {
        localStorage.setItem('worldweaver-all-communities', JSON.stringify(initialAllCommunities));
        return initialAllCommunities;
    }
    return JSON.parse(communities);
};

export const saveAllCommunities = (communities) => {
    localStorage.setItem('worldweaver-all-communities', JSON.stringify(communities));
};