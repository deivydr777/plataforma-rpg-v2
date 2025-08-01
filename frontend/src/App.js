import React from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './Home';
import ChatGlobal from './ChatGlobal';
// Importe os outros componentes se precisar deles no futuro
// import ChatCommunity from './ChatCommunity';
// import Login from './components/Login';
// import Register from './components/Register';

const currentUser = { id: 'user123', name: 'Aventureiro', avatar: '' };
const userCommunities = [{ id: 'global', name: 'Mural & Chat Global', icon: '📜' }];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(p => p);
  const activeCommunityId = pathParts[0] || null;

  const showMainUI = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <AppLayout>
      {showMainUI && (
        <CommunitiesSidebar>
          <AppLogo onClick={() => navigate('/')}>📜</AppLogo>
          {userCommunities.map(community => (
            <CommunityItem
              key={community.id}
              active={activeCommunityId === community.id}
              onClick={() => navigate('/global/global')}
            >
              {community.icon}
            </CommunityItem>
          ))}
        </CommunitiesSidebar>
      )}
      <ContentArea>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/global/global" element={<ChatGlobal currentUser={currentUser} />} />
          {/* Outras rotas podem ser adicionadas aqui no futuro */}
        </Routes>
      </ContentArea>
    </AppLayout>
  );
}

// O componente Wrapper é necessário porque o App precisa estar dentro de um Router
// para usar os hooks como useLocation e useNavigate.
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

// --- Início dos Estilos ---
const AppLayout = styled.div`
  display: flex; 
  height: 100vh; 
  background-color: #36393f;
`;

const ContentArea = styled.main`
  flex-grow: 1; 
  display: flex; 
  flex-direction: column; 
  height: 100vh;
`;

const CommunitiesSidebar = styled.div`
  width: 72px; 
  background-color: #202225; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px; 
  padding-top: 12px; 
  height: 100vh; 
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

export default AppWrapper;