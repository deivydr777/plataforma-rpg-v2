import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Vamos importar todos os nossos componentes aqui
import CommunitiesScreen from './screens/CommunitiesScreen';
import MainChatView from './screens/MainChatView';
// Remova a TabBar por enquanto, ela depende do Router
// import TabBar from './components/nav/TabBar'; 

function App() {
  const currentUser = { id: 'user123', name: 'Aventureiro', avatar: 'https://via.placeholder.com/150' };

  // O estado que controla TUDO
  const [currentView, setCurrentView] = useState('communities'); // 'communities' ou 'chat'
  const [activeCommunity, setActiveCommunity] = useState(null);
  
  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem('communities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('communities', JSON.stringify(communities));
  }, [communities]);

  const addCommunity = (community) => {
    const newCommunity = { ...community, channels: [{ id: 'geral', name: 'geral', type: 'text' }] };
    setCommunities(prev => [...prev, newCommunity]);
  };

  // Funções para controlar a navegação
  const goToChat = (community) => {
    setActiveCommunity(community);
    setCurrentView('chat');
  };

  const goToCommunities = () => {
    setActiveCommunity(null);
    setCurrentView('communities');
  };

  // Renderiza a tela correta com base no estado
  const renderContent = () => {
    if (currentView === 'chat' && activeCommunity) {
      return <MainChatView currentUser={currentUser} community={activeCommunity} onBack={goToCommunities} />;
    }
    // Por padrão, mostra a lista de comunidades
    return <CommunitiesScreen communities={communities} addCommunity={addCommunity} onCommunityClick={goToChat} />;
  };

  return (
    <AppLayout>
      {renderContent()}
    </AppLayout>
  );
}

// Estilos
const AppLayout = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #36393f;
  overflow: hidden;
`;

export default App;