import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Importando os componentes de página
import Home from './Home';
import ChatGlobal from './ChatGlobal';
import ChatCommunity from './ChatCommunity';
import Login from './components/Login';
import Register from './components/Register';

// Dados Falsos (Mock Data)
const currentUser = {
  id: 'user123',
  name: 'Aventureiro',
  avatar: 'https://via.placeholder.com/40'
};
const communitiesData = [
  { id: 'global', name: 'Chat Global', icon: '🌍', channels: [{id: 'global', name: 'global', type: 'text'}]}
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Lógica de navegação principal
  const goToHome = () => navigate('/');
  const goToGlobalChat = () => navigate('/global/global');

  // Determina se as barras de navegação devem ser mostradas
  const shouldShowNav = isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <AppLayout>
      {/* Barra de Navegação Esquerda (Comunidades) */}
      {shouldShowNav && (
        <CommunitiesSidebar>
          <AppLogo onClick={goToHome}>RPG</AppLogo>
          <CommunityItem onClick={goToGlobalChat} active={location.pathname.startsWith('/global')}>
            🌍
          </CommunityItem>
        </CommunitiesSidebar>
      )}

      {/* Área de Conteúdo Principal */}
      <ContentArea>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Se estiver autenticado, mostra as rotas principais. Senão, redireciona para o login. */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/global/:channelId" element={<ChatGlobal currentUser={currentUser} />} />
              <Route path="/:communityId/:channelId" element={<ChatCommunity currentUser={currentUser} />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

        </Routes>
      </ContentArea>
    </AppLayout>
  );
}

// --- ESTILOS --- (Simplificados para garantir que não quebrem)

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
  color: #dcddde;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex-shrink: 0;
  background-color: #202225;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
`;

const CommunitiesSidebar = styled(Sidebar)`
  width: 72px;
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
  transition: all 0.2s;
  
  &:hover {
    border-radius: 30%;
    background-color: #5865f2;
  }
  
  ${props => props.active && `
    border-radius: 30%;
    background-color: #5865f2;
  `}
`;

const ContentArea = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export default App;