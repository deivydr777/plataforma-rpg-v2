import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

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

const communitiesData = [
  { id: 'global', name: 'Chat Global', icon: '🌍', channels: [{id: 'global', name: 'global', type: 'text'}] },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber a rota atual
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showCommunitiesSidebar, setShowCommunitiesSidebar] = useState(false);
  const [showChannelsSidebar, setShowChannelsSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    setShowCommunitiesSidebar(false);
    setShowChannelsSidebar(false);
  }, [location.pathname]); // Fecha os menus ao navegar

  const handleLogoClick = () => {
    setActiveCommunity(null);
    setActiveChannel(null);
    navigate('/');
  };

  const handleCommunityClick = (commId) => {
    setActiveCommunity(commId);
    const selectedCommunity = communitiesData.find(comm => comm.id === commId);
    if (selectedCommunity && selectedCommunity.channels?.[0]) {
      const firstChannelId = selectedCommunity.channels[0].id;
      setActiveChannel(firstChannelId);
      navigate(`/${commId}/${firstChannelId}`);
    }
  };

  const shouldShowSidebars = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <AppLayout>
      {shouldShowSidebars && (
        <>
          <MobileHeader>
            <MenuButton onClick={() => setShowCommunitiesSidebar(s => !s)}>☰</MenuButton>
            <MobileTitle>Plataforma RPG</MobileTitle>
          </MobileHeader>
          
          <CommunitiesSidebar className={showCommunitiesSidebar ? 'mobile-open' : ''}>
            <AppLogo onClick={handleLogoClick}>RPG</AppLogo>
            {communitiesData.map(community => (
              <CommunityItem key={community.id} active={activeCommunity === community.id} onClick={() => handleCommunityClick(community.id)}>
                {community.icon}
              </CommunityItem>
            ))}
          </CommunitiesSidebar>
        </>
      )}

      <ContentArea>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/global/global" element={isAuthenticated ? <ChatGlobal currentUser={currentUser} /> : <Navigate to="/login" replace />} />
          <Route path="/:communityId/:channelId" element={isAuthenticated ? <ChatCommunity currentUser={currentUser} /> : <Navigate to="/login" replace />} />
        </Routes>
      </ContentArea>
    </AppLayout>
  );
}

// Estilos
const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #36393f;
  color: #dcddde;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
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
  flex-shrink: 0;
`;

const CommunitiesSidebar = styled(Sidebar)`
  width: 72px;
  background-color: #202225;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  @media (max-width: 768px) {
    position: absolute;
    left: -100%;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease-in-out;
    &.mobile-open {
      left: 0;
    }
  }
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
  &:hover {
    border-radius: 30%;
    background-color: #5865f2;
  }
  ${props => props.active && `
    border-radius: 30%;
    background-color: #5865f2;
  `}
`;

const ContentArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #36393f;
  overflow-y: auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #2f3136;
    height: 48px;
    flex-shrink: 0;
    width: 100%;
    border-bottom: 1px solid #202225;
  }
`;

const MobileTitle = styled.h2`
  font-size: 1.1em;
  margin: 0;
  color: #dcddde;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #dcddde;
  font-size: 1.5em;
  cursor: pointer;
`;

export default App;