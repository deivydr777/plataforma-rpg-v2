import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatGlobal from './ChatGlobal'; 
import TabBar from './components/nav/TabBar';
import CommunityViewScreen from './screens/CommunityViewScreen'; // Importa a nova tela

function App() {
  const currentUser = { id: 'user123', name: 'Aventureiro', avatar: 'https://via.placeholder.com/150' };
  
  // O estado das comunidades agora vive aqui, no componente principal.
  // Assim, podemos passá-lo para as telas que precisam dele.
  const [communities, setCommunities] = useState([]);

  return (
    <Router>
      <AppLayout>
        <ContentArea>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route 
              path="/communities" 
              element={<CommunitiesScreen communities={communities} setCommunities={setCommunities} />} 
            />
            <Route 
              path="/community/:communityId" 
              element={<CommunityViewScreen communities={communities} />} 
            />
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

const AppLayout = styled.div`display: flex; flex-direction: column; height: 100vh; width: 100vw; background-color: #36393f; overflow: hidden;`;
const ContentArea = styled.main`flex-grow: 1; overflow-y: auto; padding-bottom: 70px;`;

export default App;