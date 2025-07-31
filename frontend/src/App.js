import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Routes, Route, useNavigate, Navigate, Link } from 'react-router-dom';

// Importa os componentes principais
import Home from './Home';
import ChatCommunity from './ChatCommunity'; 
import ChatGlobal from './ChatGlobal';       

// Importa os componentes de Autenticação
import Login from './components/Login';     
import Register from './components/Register'; 

// --- Configuração da Conexão com o Backend (Será o URL do Render) ---
const SOCKET_SERVER_URL = "https://plataforma-rpg.onrender.com"; // <-- SEU URL REAL AQUI!

// --- DADOS DO USUÁRIO ATUAL (MOCK - SIMULADO) ---
const currentUser = {
  id: 'user123',
  name: 'Aventureiro Destemido',
  avatar: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=AV', 
  roles: ['Jogador'],
};

// Dados de exemplo (mock Data) para as comunidades
const communitiesData = [
  { id: 'global', name: 'Chat Global', icon: '🌍' },
  { id: 'hogwarts', name: 'Hogwarts RPG', icon: '🧙‍♂️', channels: [
    { id: 'geral', name: 'geral', type: 'text' },
    { id: 'taverna', name: 'taverna-dos-tres-vassouras', type: 'text' },
    { id: 'sala-precisa', name: 'sala-precisa', type: 'text' },
    { id: 'salao-principal', name: 'Salão Principal', type: 'voice' },
  ]},
  { id: 'terras-proibidas', name: 'Terras Proibidas', icon: '⚔️', channels: [
    { id: 'floresta', name: 'floresta-sombria', type: 'text' },
    { id: 'montanha', name: 'pico-do-dragao', type: 'text' },
  ]},
];

function App() {
  const navigate = useNavigate();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [showCommunitiesSidebar, setShowCommunitiesSidebar] = useState(false);
  const [showChannelsSidebar, setShowChannelsSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
      navigate('/hogwarts/geral', { replace: true });
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    setShowCommunitiesSidebar(false);
    setShowChannelsSidebar(false);
  }, [activeCommunity, activeChannel]);

  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActiveCommunity(null);
    setActiveChannel(null);
    navigate('/');
    setShowCommunitiesSidebar(false);
    setShowChannelsSidebar(false);
  };

  const handleCommunityClick = (commId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
    setShowCommunitiesSidebar(false); 
    setShowChannelsSidebar(true);
  };

  const handleChannelClick = (commId, chanId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setActiveChannel(chanId);
    navigate(`/${commId}/${chanId}`);
    setShowChannelsSidebar(false);
  };

  return (
    <AppLayout className="AppLayout">
      {/* MobileHeader AGORA TEM SUAS DEFINIÇÕES DE ESTILO AQUI MESMO */}
      {(isAuthenticated || window.location.pathname === '/login' || window.location.pathname === '/register') && (
        <MobileHeader className="MobileHeader">
          <MenuButton onClick={() => setShowCommunitiesSidebar(!showCommunitiesSidebar)}>
            ☰
          </MenuButton>
          <MobileTitle>
            {activeCommunity ? communitiesData.find(c => c.id === activeCommunity)?.name : 'Plataforma RPG'}
            {activeChannel ? ` / #${communitiesData.find(c => c.id === activeCommunity)?.channels?.find(c => c.id === activeChannel)?.name}` : ''}
          </MobileTitle>
          <MenuButton onClick={() => setShowChannelsSidebar(!showChannelsSidebar)}>
            Canais
          </MenuButton>
        </MobileHeader>
      )}

      {isAuthenticated ? (
        <>
          <CommunitiesSidebar className={`CommunitiesSidebar ${showCommunitiesSidebar ? 'mobile-open-communities' : ''}`}>
            <AppLogo onClick={handleLogoClick}>RPG</AppLogo>
            <SidebarHeader>Comunidades</SidebarHeader>
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

          <ChannelsSidebar className={`ChannelsSidebar ${showChannelsSidebar ? 'mobile-open-channels' : ''}`}>
            <SidebarHeader>
              {activeCommunity ? communitiesData.find(c => c.id === activeCommunity)?.name : 'Selecione'}
            </SidebarHeader>
            {activeCommunity && communitiesData.find(c => c.id === activeCommunity)?.channels && (
              <>
                <ChannelCategory>CANAIS DE TEXTO</ChannelCategory>
                {communitiesData.find(c => c.id === activeCommunity).channels.filter(c => c.type === 'text').map(channel => (
                  <ChannelItem
                    key={channel.id}
                    active={activeChannel === channel.id}
                    onClick={() => handleChannelClick(activeCommunity, channel.id)}
                  >
                    #{channel.name}
                  </ChannelItem>
                ))}
                <ChannelCategory>CANAIS DE VOZ</Category>
                {communitiesData.find(c => c.id === activeCommunity).channels.filter(c => c.type === 'voice').map(channel => (
                  <ChannelItem
                    key={channel.id}
                    active={activeChannel === channel.id}
                    onClick={() => handleChannelClick(activeCommunity, channel.id)}
                  >
                    🔊 {channel.name}
                  </ChannelItem>
                ))}
              </>
            )}
          </ChannelsSidebar>
        </>
      ) : (
        <></>
      )}

      <ContentArea className="ContentArea">
        <Routes>
          {/* Rotas de Autenticação (sempre acessíveis) */}
          <Route path="/login" element={<Login onLoginSuccess={handleAuthSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleAuthSuccess} />} />

          {/* Rotas Protegidas (só acessíveis se isAuthenticated for true) */}
          <Route path="/" element={isAuthenticated ? <Home 
            toggleCommunitiesSidebar={() => setShowCommunitiesSidebar(!showCommunitiesSidebar)} 
            toggleChannelsSidebar={() => setShowChannelsSidebar(!showChannelsSidebar)} 
          /> : <Navigate to="/login" replace />} />
          
          <Route path="/global" element={isAuthenticated ? <ChatGlobal 
            communityId="global" 
            channelId="global" 
            socketServerUrl={SOCKET_SERVER_URL} 
            currentUser={currentUser}
            toggleCommunitiesSidebar={() => setShowCommunitiesSidebar(!showCommunitiesSidebar)} 
            toggleChannelsSidebar={() => setShowChannelsSidebar(!showChannelsSidebar)} 
          /> : <Navigate to="/login" replace />} />
          
          <Route path="/:communityId/:channelId" element={isAuthenticated ? <ChatCommunity 
            socketServerUrl={SOCKET_SERVER_URL} 
            currentUser={currentUser} 
            messagesData={communitiesData} 
            toggleCommunitiesSidebar={() => setShowCommunitiesSidebar(!showCommunitiesSidebar)} 
            toggleChannelsSidebar={() => setShowChannelsSidebar(!showChannelsSidebar)} 
          /> : <Navigate to="/login" replace />} />
        </Routes>
      </ContentArea>
    </AppLayout>
  );
}

// --- Estilos Usando Styled Components ---

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #36393f; /* Corrigido para valor real */
  color: #dcddde; /* Corrigido para valor real */

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
  background-color: #5865f2; /* Corrigido para valor real */
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

  @media (max-width: 768px) {
    position: absolute;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 5px rgba(0,0,0,0.5);
    left: -72px; 
    transition: left 0.3s ease-in-out; 
  }
  &.mobile-open-communities {
    left: 0;
  }
`;

const ChannelsSidebar = styled(Sidebar)`
  width: 240px;
  background-color: #2f3136;
  border-right: 1px solid #202225;

  @media (max-width: 768px) {
    position: absolute;
    height: 100vh;
    z-index: 999;
    box-shadow: 2px 0 5px rgba(0,0,0,0.5);
    left: -240px; 
    border-right: none;
    transition: left 0.3s ease-in-out; 
  }
  &.mobile-open-channels {
    left: 0;
  }
`;

const SidebarHeader = styled.h3`
  font-size: 0.7em;
  color: #99aab5; /* Corrigido para valor real */
  margin-bottom: 15px;
  margin-top: 10px;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
`;

const CommunityItem = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #3a3c42; /* Corrigido para valor real */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
  transition: border-radius 0.2s, background-color 0.2s;

  &:hover {
    border-radius: 30%;
    background-color: #5865f2; /* Corrigido para valor real */
  }
  ${props => props.active && `
    border-radius: 30%;
    background-color: #5865f2;
  `}
`;

const ChannelCategory = styled.div`
  font-size: 0.8em;
  color: #8e9297; /* Corrigido para valor real */
  margin-top: 15px;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChannelItem = styled.div`
  padding: 8px 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 1.1em;
  color: #8e9297; /* Corrigido para valor real */

  &:hover {
    background-color: #3a3c42; /* Corrigido para valor real */
    color: #dcddde; /* Corrigido para valor real */
  }
  ${props => props.active && `
    background-color: #40444b; /* Corrigido para valor real */
    color: #ffffff;
  `}
`;

const ContentArea = styled.div`
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
  background-color: #36393f; /* Corrigido para valor real */

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilos para MobileHeader e MenuButton (agora definidos aqui)
const MobileHeader = styled.div`
  display: none; 
  @media (max-width: 768px) { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background-color: #202225;
    color: #dcddde;
    height: 48px;
    flex-shrink: 0;
    width: 100%;
    position: relative; 
    z-index: 50; 
  }
`;

const MobileTitle = styled.h2`
  font-size: 1.1em;
  margin: 0;
  color: #dcddde;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 100px);
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #dcddde;
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
`;

export default App;