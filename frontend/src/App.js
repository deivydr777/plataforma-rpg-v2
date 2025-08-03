import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import CommunitiesScreen from './screens/CommunitiesScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatGlobal from './ChatGlobal'; 
import TabBar from './components/nav/TabBar';
import MainChatView from './screens/MainChatView';

const defaultChannels = [
    { id: 'geral', name: 'geral', type: 'text' },
    { id: 'regras', name: 'regras', type: 'text' },
];

function App() {
  const currentUser = { id: 'user123', name: 'Aventureiro', avatar: 'https://via.placeholder.com/150' };
  
  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem('communities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('communities', JSON.stringify(communities));
  }, [communities]);

  const addCommunity = (community) => {
    // Adiciona canais padrão a cada nova comunidade
    const newCommunity = { ...community, channels: defaultChannels };
    setCommunities(prev => [...prev, newCommunity]);
  };

  return (
    <Router>
      <AppLayout>
        <ContentArea>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/communities" element={<CommunitiesScreen communities={communities} addCommunity={addCommunity} />} />
            <Route path="/community/:communityId/:channelId?" element={<MainChatView currentUser={currentUser} communities={communities} />} />
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