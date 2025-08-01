import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Home from './Home';
import ChatCommunity from './ChatCommunity'; 
import ChatGlobal from './ChatGlobal';       
import Login from './components/Login';     
import Register from './components/Register'; 

const SOCKET_SERVER_URL = "https://plataforma-rpg-v2.onrender.com";

const currentUser = {
  id: 'user123',
  name: 'Aventureiro Destemido',
  avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=AV', 
  roles: ['Jogador'],
};

// SIMULANDO UMA LISTA DE COMUNIDADES QUE O USUÁRIO FAZ PARTE
// Por enquanto, ele só faz parte do Chat Global.
const userCommunities = [
  { id: 'global', name: 'Chat Global', icon: '🌍', channels: [{id: 'global', name: 'global', type: 'text'}] },
  // No futuro, quando o usuário entrar em uma comunidade, ela será adicionada aqui.
  // { id: 'hogwarts', name: 'Hogwarts RPG', icon: '🧙‍♂️', channels: [...] }, 
];

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation(); // Hook para saber a URL atual

    // O estado agora é baseado no que a URL diz
    const pathParts = location.pathname.split('/').filter(p => p);
    const activeCommunityId = pathParts[0] || null;
    const activeChannelId = pathParts[1] || null;

    const [isAuthenticated] = useState(true);

    const handleCommunityClick = (commId) => {
        const community = userCommunities.find(c => c.id === commId);
        if (community && community.channels && community.channels.length > 0) {
            const firstChannel = community.channels[0];
            navigate(`/${community.id}/${firstChannel.id}`);
        } else {
            navigate(`/${commId}`);
        }
    };
    
    // Mostra a UI principal se não estiver nas telas de login/registro
    const showMainUI = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <AppLayout>
            {showMainUI && (
                <CommunitiesSidebar>
                    <AppLogo onClick={() => navigate('/')}>RPG</AppLogo>
                    {userCommunities.map(community => (
                        <CommunityItem
                            key={community.id}
                            active={activeCommunityId === community.id}
                            onClick={() => handleCommunityClick(community.id)}
                        >
                            {community.icon}
                        </CommunityItem>
                    ))}
                </CommunitiesSidebar>
            )}

            <ContentArea>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/global/global" element={<ChatGlobal currentUser={currentUser} />} />
                    <Route path="/:communityId/:channelId" element={<ChatCommunity currentUser={currentUser} communities={userCommunities} />} />
                </Routes>
            </ContentArea>
        </AppLayout>
    );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// --- Estilos ---
const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #36393f; 
  color: #dcddde;
`;

const ContentArea = styled.main`
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: hidden; /* A rolagem será controlada pelos filhos */
`;

const Sidebar = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const CommunitiesSidebar = styled(Sidebar)`
  width: 72px;
  background-color: #202225;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  height: 100vh;
`;

const AppLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #5865f2; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
`;

const CommunityItem = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #3a3c42; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
  transition: border-radius 0.2s, background-color 0.2s;
  position: relative;

  &:hover {
    border-radius: 30%;
    background-color: #5865f2; 
  }

  ${props => props.active && `
    border-radius: 30%;
    background-color: #5865f2;
  `}
`;

export default App;