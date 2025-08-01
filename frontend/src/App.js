import React from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Home from './Home';
import ChatGlobal from './ChatGlobal';       
import CreateCommunity from './CreateCommunity'; // <-- 1. IMPORTA A NOVA PÁGINA

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathParts = location.pathname.split('/').filter(p => p);
    const activeCommunityId = pathParts[0] || null;

    const userCommunities = [
      { id: 'global', name: 'Chat Global', icon: '📜', channels: [{id: 'global', name: 'global', type: 'text'}] },
    ];

    const handleCommunityClick = (commId) => {
        navigate(`/${commId}/global`);
    };
    
    const showSidebar = location.pathname !== '/create-community'; // Não mostra a sidebar na tela de criação

    return (
        <AppLayout>
            {showSidebar && (
                <CommunitiesSidebar>
                    <AppLogo onClick={() => navigate('/')}>WW</AppLogo>
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
                    <Route path="/" element={<Home />} />
                    <Route path="/global/global" element={<ChatGlobal currentUser={{name: 'Aventureiro'}} />} />
                    <Route path="/create-community" element={<CreateCommunity />} /> {/* <-- 2. ADICIONA A NOVA ROTA */}
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

// (O resto do arquivo App.js com os estilos continua o mesmo)
const AppLayout = styled.div`
  display: flex; height: 100vh; background-color: #36393f;
`;
const ContentArea = styled.main`
  flex-grow: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: hidden;
`;
const Sidebar = styled.div`
  padding: 10px; display: flex; flex-direction: column; flex-shrink: 0;
`;
const CommunitiesSidebar = styled(Sidebar)`
  width: 72px; background-color: #202225; align-items: center; gap: 8px; padding-top: 12px; height: 100vh;
`;
const AppLogo = styled.div`
  width: 48px; height: 48px; border-radius: 50%; background-color: #5865f2; display: flex; justify-content: center; align-items: center; font-size: 1.5em; font-weight: bold; color: white; margin-bottom: 10px; cursor: pointer;
`;
const CommunityItem = styled.div`
  width: 48px; height: 48px; border-radius: 50%; background-color: #3a3c42; display: flex; justify-content: center; align-items: center; font-size: 1.5em; cursor: pointer; transition: border-radius 0.2s, background-color 0.2s;
  &:hover { border-radius: 30%; background-color: #5865f2; }
  ${props => props.active && `border-radius: 30%; background-color: #5865f2;`}
`;

export default App;