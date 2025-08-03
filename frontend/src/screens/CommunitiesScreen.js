import React, { useState } from 'react';
import styled from 'styled-components';

const generateInviteCode = () => { /* ...código de gerar convite... */ };

// Agora recebe 'onCommunityClick'
function CommunitiesScreen({ communities, addCommunity, onCommunityClick }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  const handleCreateCommunity = () => {
    const trimmedName = newCommunityName.trim();
    if (trimmedName) {
      addCommunity({ id: Date.now().toString(), name: trimmedName, icon: '⚔️' });
      setShowCreateForm(false);
      setNewCommunityName('');
      alert(`Comunidade "${trimmedName}" criada!`);
    }
  };

  return (
    <ScreenContainer>
      <Header><h1>Suas Comunidades</h1><CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>+</CreateButton></Header>
      {showCreateForm && ( <CreateForm> ... </CreateForm> )}
      {communities.length > 0 ? (
        <CommunityList>
          {communities.map(c => <CommunityItem key={c.id} onClick={() => onCommunityClick(c)}>...</CommunityItem>)}
        </CommunityList>
      ) : ( <EmptyState>...</EmptyState> )}
    </ScreenContainer>
  );
}
// Cole os seus estilos aqui
export default CommunitiesScreen;