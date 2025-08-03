import React from 'react';
import styled from 'styled-components';

// Agora recebe 'community' e 'onBack'
function MainChatView({ currentUser, community, onBack }) {
  if (!community) return null;

  return (
    <Layout>
      <ChannelsSidebar>
        <CommunityHeader>{community.name}</CommunityHeader>
        <ChannelList>
          {community.channels.map(ch => <ChannelItem key={ch.id}># {ch.name}</ChannelItem>)}
        </ChannelList>
      </ChannelsSidebar>
      <ChatContainer>
        <ChatHeader><BackButton onClick={onBack}>←</BackButton><h2># geral</h2></ChatHeader>
        {/* ... resto do chat ... */}
      </ChatContainer>
    </Layout>
  );
}
// Cole os seus estilos aqui
export default MainChatView;