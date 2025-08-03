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
      <AppLayout>
        <ContentArea>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/communities" element={<CommunitiesScreen />} />
            <Route path="/profile" element={<ProfileScreen currentUser={currentUser} />} />
            <Route path="/global" element={<ChatGlobal currentUser={currentUser} />} />
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </ContentArea>
        <TabBar />
      </AppLayout>
    </Router>
  );
}
const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Força a altura total da tela, como recomendado */
  width: 100vw;
  background-color: #36393f;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex-grow: 1;
  /* Garante que a área de conteúdo seja flexível e ocupe o espaço */
  display: flex;
  flex-direction: column;
  overflow-y: auto; 
  padding-bottom: 60px; /* Espaço para a TabBar */
`;

export default App;