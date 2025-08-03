import React, { useState } from 'react';
import styled from 'styled-components';

// Dados iniciais
const initialCommunities = [
  { id: 'global', name: 'Mural & Chat Global', icon: '🌍', inviteCode: 'GLOBAL' },
];

// Função para gerar um código de convite aleatório (ex: ABC-123)
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 3; i++) {
    code += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return code;
};

function CommunitiesScreen() {
  const [communities, setCommunities] = useState(initialCommunities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  const handleCreateCommunity = () => {
    if (newCommunityName.trim()) {
      const newInviteCode = generateInviteCode();
      const newCommunity = {
        id: Date.now().toString(),
        name: newCommunityName.trim(),
        icon: '🏰',
        inviteCode: newInviteCode,
      };
      setCommunities([...communities, newCommunity]);
      setNewCommunityName('');
      setShowCreateForm(false);

      // A MÁGICA ACONTECE AQUI: Mostra o alerta com o código
      alert(
        `Comunidade "${newCommunity.name}" criada com sucesso!\n\n` +
        `Seu código de convite é: ${newInviteCode}\n\n` +
        `Compartilhe com seus amigos para eles entrarem.`
      );
    }
  };

  return (
    <ScreenContainer>
      <Header>
        <h1>Suas Comunidades</h1>
        <CreateButton onClick={() => setShowCreateForm(!showCreateForm)}>{showCreateForm ? '×' : '+'}</CreateButton>
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
          <Button onClick={handleCreateCommunity}>Confirmar Criação</Button>
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

// Estilos (sem alteração)
const ScreenContainer = styled.div`
  color: #dcddde;
  max-width: 800px;
  margin: 0 auto; /* Centraliza o conteúdo */
`;

const Header = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 30px;
  /* Adicionamos position relative para o botão se alinhar a ele */
  position: relative; 
  
  h1 { 
    margin: 0; 
    font-size: 1.8em; 
  }
`;

const CreateButton = styled.button`
  background-color: #5865f2; 
  color: white; 
  border: none; 
  border-radius: 50%; 
  width: 44px; /* Aumentamos um pouco */
  height: 44px;
  font-size: 28px; 
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4752c4;
  }
`;

const CreateForm = styled.div`
  background-color: #2f3136; 
  padding: 20px; 
  border-radius: 8px; 
  margin-bottom: 30px;
  border: 1px solid #202225;
`;

const Input = styled.input`
  width: 100%; 
  padding: 12px; 
  border-radius: 5px; 
  border: none; 
  background-color: #40444b; 
  color: #dcddde; 
  margin-bottom: 15px;
`;

const Button = styled.button`
  width: 100%; 
  padding: 12px; 
  border-radius: 5px; 
  border: none; 
  background-color: #5865f2; 
  color: white; 
  font-weight: bold; 
  cursor: pointer;
`;

const CommunityList = styled.div`
  display: flex; 
  flex-direction: column; 
  gap: 10px;
`;

const CommunityItem = styled.div`
  background-color: #2f3136; 
  border-radius: 8px; 
  padding: 15px; 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #40444b;
  }
`;

const CommunityIcon = styled.span`
  font-size: 24px;
`;

const CommunityName = styled.span`
  font-size: 1.1em; 
  color: #fff;
`;
export default CommunitiesScreen;