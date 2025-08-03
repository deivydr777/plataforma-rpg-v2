import React, { useState } from 'react';
import styled from 'styled-components';

const initialCommunities = [
  { id: 'global', name: 'Mural & Chat Global', icon: '🌍' },
];

function CommunitiesScreen() {
  const [communities, setCommunities] = useState(initialCommunities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  const handleCreateCommunity = () => {
    if (newCommunityName.trim()) {
      const newCommunity = { id: Date.now().toString(), name: newCommunityName.trim(), icon: '🏰' };
      setCommunities([...communities, newCommunity]);
      setNewCommunityName('');
      setShowCreateForm(false);
    }
  };

  return (
    <ScreenContainer>
      <Header>
        <h1>Suas Comunidades</h1>
        <CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>+</CreateButton>
      </Header>

      {showCreateForm && (
        <CreateForm>
          <h2>Criar Nova Comunidade</h2>
          <Input 
            type="text" 
            placeholder="Nome da Comunidade"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
          />
          <Button onClick={handleCreateCommunity}>Criar</Button>
        </CreateForm>
      )}

      <CommunityList>
        {communities.map(community => (
          <CommunityItem key={community.id}>
            <CommunityIcon>{community.icon}</CommunityIcon>
            <CommunityName>{community.name}</CommunityName>
          </CommunityItem>
        ))}
      </CommunityList>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h1 { margin: 0; font-size: 1.8em; }`;
const CreateButton = styled.button`background-color: #5865f2; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 24px; cursor: pointer;`;
const CreateForm = styled.div`background-color: #2f3136; padding: 20px; border-radius: 8px; margin-bottom: 30px;`;
const Input = styled.input`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #40444b; color: #dcddde; margin-bottom: 15px;`;
const Button = styled.button`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #5865f2; color: white; font-weight: bold; cursor: pointer;`;
const CommunityList = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const CommunityItem = styled.div`background-color: #2f3136; border-radius: 8px; padding: 15px; display: flex; align-items: center; gap: 15px; cursor: pointer;`;
const CommunityIcon = styled.span`font-size: 24px;`;
const CommunityName = styled.span`font-size: 1.1em; color: #fff;`;

export default CommunitiesScreen;