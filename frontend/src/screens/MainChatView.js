import React from 'react';
import styled from 'styled-components';

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
        <ChatHeader><BackButton onClick={onBack}>←</BackButton><h2># {community.channels[0].name}</h2></ChatHeader>
        <ChatMessages>
            {/* Mensagens aparecerão aqui */}
        </ChatMessages>
        <ChatInputArea>
            <Input placeholder="Conversar em #geral" />
        </ChatInputArea>
      </ChatContainer>
    </Layout>
  );
}

const Layout = styled.div`display: flex; height: 100%; width: 100%; background-color: #36393f;`;
const ChannelsSidebar = styled.div`width: 240px; background-color: #2f3136; flex-shrink: 0; display: flex; flex-direction: column;`;
const CommunityHeader = styled.div`padding: 20px; font-size: 1.2em; font-weight: bold; color: #fff; border-bottom: 1px solid #202225;`;
const ChannelList = styled.div`padding: 10px; overflow-y: auto;`;
const ChannelItem = styled.div`padding: 10px; border-radius: 5px; color: #8e9297; cursor: pointer; &:hover { background-color: #3a3c42; }`;
const ChatContainer = styled.div`flex-grow: 1; display: flex; flex-direction: column;`;
const ChatHeader = styled.div`padding: 0 20px; height: 60px; display: flex; align-items: center; border-bottom: 1px solid #2f3136; color: #fff; h2 { margin: 0; font-size: 1.2em; }`;
const BackButton = styled.button`background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; margin-right: 15px;`;
const ChatMessages = styled.div`flex-grow: 1; padding: 20px; overflow-y: auto;`;
const ChatInputArea = styled.div`padding: 20px;`;
const Input = styled.input`width: 100%; padding: 12px; border: none; border-radius: 8px; background-color: #40444b; color: #dcddde;`;

export default MainChatView;