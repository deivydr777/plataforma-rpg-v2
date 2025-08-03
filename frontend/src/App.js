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
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const ContentArea = styled.main`
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 70px; /* Espaço para a TabBar não cobrir o conteúdo */
`;
export default App;