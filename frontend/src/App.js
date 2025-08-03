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

// --- ESTILOS ANTI-QUEBRA ---

const AppContainer = styled.div`
  /* Ocupa 100% da altura da janela do navegador */
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
  
  /* Estrutura de coluna: conteúdo em cima, TabBar embaixo */
  display: flex;
  flex-direction: column;

  /* Impede que o container encolha quando o teclado aparecer */
  overflow: hidden;
`;

const ContentArea = styled.main`
  /* Faz a área de conteúdo ocupar todo o espaço disponível */
  flex: 1; 

  /* ESSA É A MÁGICA: Apenas esta área pode rolar */
  overflow-y: auto; 
  
  /* O padding para a TabBar foi removido daqui e a TabBar agora fica por cima */
`;

export default App;