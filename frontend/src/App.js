import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import ChatGlobal from './ChatGlobal';
import Login from './components/Login';
// AQUI ESTAVA O ERRO DA TELA BRANCA. CORRIGIDO:
import Register from './components/Register'; 

const currentUser = { id: 'user123', name: 'Aventureiro', avatar: '' };
const userCommunities = [{ id: 'global', name: 'Mural & Chat Global', icon: '📜' }];

function AppContent() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <CommunitiesSidebar>
        <AppLogo onClick={() => navigate('/')}>📜</AppLogo>
        {userCommunities.map(community => (
          <CommunityItem
            key={community.id}
            active={window.location.pathname.includes(community.id)}
            onClick={() => navigate('/global/global')}
          >
            {community.icon}
          </CommunityItem>
        ))}
      </CommunitiesSidebar>
      <ContentArea>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/global/global" element={<ChatGlobal currentUser={currentUser} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} /> 
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

// Estilos
const AppLayout = styled.div`display: flex; height: 100vh; background-color: #36393f;`;
const ContentArea = styled.main`flex-grow: 1; display: flex; flex-direction: column; height: 100vh;`;
const CommunitiesSidebar = styled.div`width: 72px; background-color: #202225; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 12px; height: 100vh; flex-shrink: 0;`;
const AppLogo = styled.div`width: 48px; height: 48px; border-radius: 50%; background-color: #5865f2; display: flex; justify-content: center; align-items: center; font-size: 1.5em; color: white; margin-bottom: 10px; cursor: pointer;`;
const CommunityItem = styled.div`width: 48px; height: 48px; border-radius: 50%; background-color: #3a3c42; display: flex; justify-content: center; align-items: center; font-size: 1.5em; cursor: pointer; transition: all 0.2s; &:hover { border-radius: 30%; background-color: #5865f2; } ${props => props.active && `border-radius: 30%; background-color: #5865f2;`}`;

export default App;