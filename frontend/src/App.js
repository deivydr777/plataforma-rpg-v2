import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatGlobal from './ChatGlobal'; 
import TabBar from './components/nav/TabBar';

function App() {
  const currentUser = { id: 'user123', name: 'Aventureiro', avatar: 'https://via.placeholder.com/150' };

  return (
    <Router>
      {/* O AppContainer FORÇA a altura total da tela e impede que ela encolha */}
      <AppContainer>
        <ContentArea>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/communities" element={<CommunitiesScreen />} />
            <Route path="/profile" element={<ProfileScreen currentUser={currentUser} />} />
            <Route path="/global" element={<ChatGlobal currentUser={currentUser} />} />
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </ContentArea>
        {/* A TabBar fica FORA da área de rolagem */}
        <TabBar />
      </AppContainer>
    </Router>
  );
}

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
  /* Garante que o conteúdo não saia da tela */
  overflow: hidden; 
`;

const ContentArea = styled.main`
  flex-grow: 1;
  /* A rolagem agora é controlada aqui */
  overflow-y: auto; 
  /* Adicionamos padding para o conteúdo não colar nas bordas
     e principalmente para não ficar atrás da TabBar */
  padding: 20px;
  padding-bottom: 80px; /* Espaço extra para a TabBar */
`;

export default App;