import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

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

// LISTA DE COMUNIDADES ATUALIZADA - SÓ TEM O CHAT GLOBAL
const communitiesData = [
  { id: 'global', name: 'Chat Global', icon: '🌍', channels: [{id: 'global', name: 'global', type: 'text'}] },
];

function App() {
  const navigate = useNavigate();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showCommunitiesSidebar, setShowCommunitiesSidebar] = useState(false);
  const [showChannelsSidebar, setShowChannelsSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Lógica para esconder as sidebars quando a rota muda
    setShowCommunitiesSidebar(false);
    setShowChannelsSidebar(false);
  }, [activeCommunity, activeChannel, navigate]);

  const handleLogoClick = () => {
    setActiveCommunity(null);
    setActiveChannel(null);
    navigate('/');
  };

  const handleCommunityClick = (commId) => {
    setActiveCommunity(commId);
    const selectedCommunity = communitiesData.find(comm => comm.id === commId);
    if (selectedCommunity && selectedCommunity.channels && selectedCommunity.channels.length > 0) {
      const firstTextChannel = selectedCommunity.channels.find(c => c.type === 'text');
      if (firstTextChannel) {
        setActiveChannel(firstTextChannel.id);
        navigate(`/${commId}/${firstTextChannel.id}`);
      } else { 
        setActiveChannel(null);
        navigate(`/${commId}`);
      }
    } else {
      setActiveChannel(null);
      navigate(`/${commId}`);
    }
  };

  const handleChannelClick = (commId, chanId) => {
    setActiveChannel(chanId);
    navigate(`/${commId}/${chanId}`);
  };

  return (
    <AppLayout className="AppLayout">
      {(isAuthenticated && window.location.pathname !== '/login' && window.location.pathname !== '/register') && (
        <>
            <MobileHeader className="MobileHeader">
              <MenuButton onClick={() => setShowCommunitiesSidebar(!showCommunitiesSidebar)}>☰</MenuButton>
              <MobileTitle>
                {activeCommunity ? communitiesData.find(c => c.id === activeCommunity)?.name : 'Plataforma RPG'}
                {activeChannel && activeChannel !== 'global' ? ` / #${communitiesData.find(c => c.id === activeCommunity)?.channels?.find(c => c.id === activeChannel)?.name}` : ''}
              </MobileTitle>
              <MenuButton onClick={() => setShowChannelsSidebar(!showChannelsSidebar)}>Canais</MenuButton>
            </MobileHeader>

            <CommunitiesSidebar className={`CommunitiesSidebar ${showCommunitiesSidebar ? 'mobile-open-communities' : ''}`}>
                <AppLogo onClick={handleLogoClick}>RPG</AppLogo>
                {communitiesData.map(community => (
                <CommunityItem
                    key={community.id}
                    active={activeCommunity === community.id}
                    onClick={() => handleCommunityClick(community.id)}
                >
                    {community.icon}
                </CommunityItem>
                ))}
            </CommunitiesSidebar>

            { activeCommunity && activeCommunity !== 'global' && (
                <ChannelsSidebar className={`ChannelsSidebar ${showChannelsSidebar ? 'mobile-open-channels' : ''}`}>
                    <SidebarHeader>{communitiesData.find(c => c.id === activeCommunity)?.name}</SidebarHeader>
                    {communitiesData.find(c => c.id === activeCommunity)?.channels && (
                    <>
                        <ChannelCategory>CANAIS DE TEXTO</ChannelCategory> 
                        {communitiesData.find(c => c.id === activeCommunity).channels.filter(c => c.type === 'text').map(channel => (
                        <ChannelItem key={channel.id} active={activeChannel === channel.id} onClick={() => handleChannelClick(activeCommunity, channel.id)}>#{channel.name}</ChannelItem>
                        ))}
                        <ChannelCategory>CANAIS DE VOZ</ChannelCategory> 
                        {communitiesData.find(c => c.id === activeCommunity).channels.filter(c => c.type === 'voice').map(channel => (
                        <ChannelItem key={channel.id} active={activeChannel === channel.id} onClick={() => handleChannelClick(activeCommunity, channel.id)}>🔊 {channel.name}</ChannelItem>
                        ))}
                    </>
                    )}
                </ChannelsSidebar>
            )}
        </>
      )}

      <ContentArea className="ContentArea">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/global/global" element={isAuthenticated ? <ChatGlobal currentUser={currentUser} /> : <Navigate to="/login" replace />} />
          <Route path="/:communityId/:channelId" element={isAuthenticated ? <ChatCommunity socketServerUrl={SOCKET_SERVER_URL} currentUser={currentUser} messagesData={communitiesData} /> : <Navigate to="/login" replace />} />
        </Routes>
      </ContentArea>
    </AppLayout>
  );
}


// --- Estilos (Não precisam ser alterados) ---

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
    display: ${props => props.className.includes('mobile-open-communities') ? 'flex' : 'none'};
    position: absolute;
    height: 100vh;
    z-index: 1000;
  }
`;

const ChannelsSidebar = styled(Sidebar)`
  width: 240px;
  background-color: #2f3136;
  border-right: 1px solid #202225;

  @media (max-width: 768px) {
    display: ${props => props.className.includes('mobile-open-channels') ? 'flex' : 'none'};
    position: absolute;
    height: 100vh;
    z-index: 999;
    left: 72px;
  }
`;

const SidebarHeader = styled.h3`
  font-size: 0.9em;
  font-weight: bold;
  color: #ffffff; 
  margin-bottom: 15px;
  padding: 10px;
  text-align: left;
  width: 100%;
  border-bottom: 1px solid #202225;
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

const ChannelCategory = styled.div`
  font-size: 0.8em;
  color: #8e9297; 
  margin-top: 15px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const ChannelItem = styled.div`
  padding: 8px 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  color: #8e9297; 

  &:hover {
    background-color: #3a3c42; 
    color: #dcddde; 
  }
  ${props => props.active && `
    background-color: #40444b; 
    color: #ffffff;
  `}
`;

const ContentArea = styled.div`
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  background-color: #36393f; 

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