import React, { useState } from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Importação dos componentes de página
import Home from './Home';
import ChatGlobal from './ChatGlobal';
import ChatCommunity from './ChatCommunity'; 
import Login from './components/Login';     
import Register from './components/Register'; 

// Dados simulados do usuário atual
const currentUser = {
  id: 'user123',
  name: 'Aventureiro Destemido',
  avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=AV', 
  roles: ['Jogador'],
};

// Lista de comunidades do usuário (começa apenas com o Mural Global)
// O ícone do Mural Global foi atualizado para o pergaminho 📜
const userCommunities = [
  { id: 'global', name: 'Mural & Chat Global', icon: '📜', channels: [{id: 'global', name: 'global', type: 'text'}] },
];

// Componente principal que gerencia o layout e a navegação
function AppContent() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obter informações sobre a rota atual

    // Determina qual comunidade está ativa com base na URL
    const pathParts = location.pathname.split('/').filter(p => p);
    const activeCommunityId = pathParts[0] || null;

    // Simula que o usuário está sempre autenticado
    const [isAuthenticated] = useState(true);

    // Função para navegar para uma comunidade
    const handleCommunityClick = (commId) => {
        const community = userCommunities.find(c => c.id === commId);
        if (community && community.channels && community.channels.length > 0) {
            const firstChannel = community.channels[0];
            navigate(`/${community.id}/${firstChannel.id}`);
        } else {
            navigate(`/${commId}`);
        }
    };
    
    // Condição para mostrar a interface principal (qualquer tela exceto login/registro)
    const showMainUI = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <AppLayout>
            {/* A barra lateral de comunidades só aparece se showMainUI for verdadeiro */}
            {showMainUI && (
                <CommunitiesSidebar>
                    {/* LOGO ATUALIZADA para o globo 🌍 */}
                    <AppLogo onClick={() => navigate('/')} title="Voltar para o Início">🌍</AppLogo>
                    
                    {/* Mapeia as comunidades do usuário para criar os ícones */}
                    {userCommunities.map(community => (
                        <CommunityItem
                            key={community.id}
                            active={activeCommunityId === community.id}
                            onClick={() => handleCommunityClick(community.id)}
                            title={community.name} // Mostra o nome da comunidade ao passar o mouse
                        >
                            {community.icon}
                        </CommunityItem>
                    ))}
                </CommunitiesSidebar>
            )}

            {/* A área de conteúdo principal onde as páginas são renderizadas */}
            <ContentArea>
                <Routes>
                    {/* Rotas de autenticação */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Rotas principais da aplicação */}
                    <Route path="/" element={<Home />} />
                    <Route path="/global/global" element={<ChatGlobal currentUser={currentUser} />} />
                    
                    {/* Rota dinâmica para comunidades e canais */}
                    <Route path="/:communityId/:channelId" element={<ChatCommunity currentUser={currentUser} communities={userCommunities} />} />
                </Routes>
            </ContentArea>
        </AppLayout>
    );
}

// O componente App raiz que envolve tudo com o HashRouter, essencial para o GitHub Pages
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// --- Estilos com Styled Components ---

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #36393f; 
  color: #dcddde;
  overflow: hidden; /* Impede a rolagem no nível mais alto */
`;

const ContentArea = styled.main`
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
`;

const CommunitiesSidebar = styled(Sidebar)`
  width: 72px;
  background-color: #202225;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
`;

const AppLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #36393f; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8em;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-radius 0.2s ease-in-out;

  &:hover {
    border-radius: 30%;
  }
`;

const CommunityItem = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #36393f; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
  transition: border-radius 0.2s ease-in-out, background-color 0.2s ease-in-out;
  position: relative;

  &:hover {
    border-radius: 30%;
    background-color: #5865f2; 
  }

  /* Estilo para o item ativo */
  ${props => props.active && `
    border-radius: 30%;
    background-color: #5865f2;
  `}
`;

export default App;