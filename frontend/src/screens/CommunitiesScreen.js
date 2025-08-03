import React, { useState } from 'react';
import styled from 'styled-components';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code.match(/.{1,3}/g).join('-');
};

function CommunitiesScreen({ communities, addCommunity, onCommunityClick }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  const handleCreateCommunity = () => {
    const trimmedName = newCommunityName.trim();
    if (trimmedName) {
      addCommunity({ id: Date.now().toString(), name: trimmedName, icon: '⚔️' });
      setShowCreateForm(false);
      setNewCommunityName('');
      alert(`Comunidade "${trimmedName}" criada! Convite: ${generateInviteCode()}`);
    }
  };

  return (
    <ScreenContainer>
      <Header><h1>Suas Comunidades</h1><CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>+</CreateButton></Header>
      {showCreateForm && (
        <CreateForm>
          <Input placeholder="Nome da Comunidade" value={newCommunityName} onChange={(e) => setNewCommunityName(e.target.value)} />
          <Button onClick={handleCreateCommunity}>Criar</Button>
        </CreateForm>
      )}
      {communities.length > 0 ? (
        <CommunityList>
          {communities.map(c => <CommunityItem key={c.id} onClick={() => onCommunityClick(c)}><CommunityIcon>{c.icon}</CommunityIcon><CommunityName>{c.name}</CommunityName></CommunityItem>)}
        </CommunityList>
      ) : (
        <EmptyState><p>Clique no '+' para criar sua primeira comunidade.</p></EmptyState>
      )}
    </ScreenContainer>
  );
}

const ScreenContainer = styled.div`padding: 20px; color: #dcddde;`;
const Header = styled.header`display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; h1 { margin: 0; font-size: 1.6em; }`;
const CreateButton = styled.button`background-color: #5865f2; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 28px; cursor: pointer;`;
const CreateForm = styled.div`background-color: #2f3136; padding: 20px; border-radius: 8px; margin-bottom: 20px;`;
const Input = styled.input`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #40444b; color: #dcddde; margin-bottom: 15px;`;
const Button = styled.button`width: 100%; padding: 12px; border-radius: 5px; border: none; background-color: #4caf50; color: white; font-weight: bold; cursor: pointer;`;
const CommunityList = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const CommunityItem = styled.div`background-color: #2f3136; border-radius: 8px; padding: 15px; display: flex; align-items: center; gap: 15px; cursor: pointer; &:hover { background-color: #40444b; }`;
const CommunityIcon = styled.span`font-size: 24px;`;
const CommunityName = styled.span`font-size: 1.1em; color: #fff;`;
const EmptyState = styled.div`text-align: center; color: #8e9297; padding: 40px 20px; background-color: #2f3136; border-radius: 8px;`;

export default CommunitiesScreen;